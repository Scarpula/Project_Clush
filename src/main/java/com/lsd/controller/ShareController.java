package com.lsd.controller;

import com.lsd.dto.CalendarDTO;
import com.lsd.dto.TodoDTO;
import com.lsd.model.Calendar;
import com.lsd.model.ToDo;
import com.lsd.model.User;
import com.lsd.service.ShareService;
import com.lsd.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/share")
public class ShareController {

    private final ShareService shareService;
    private final UserService userService;

    public ShareController(ShareService shareService, UserService userService) {
        this.shareService = shareService;
        this.userService = userService;
    }

    @Operation(summary = "특정 사용자 검색", description = "사용자 이름을 통해 특정 사용자를 검색합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "사용자 검색 성공"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다.")
    })
    @GetMapping("/search")
    public ResponseEntity<?> searchUser(
            @Parameter(description = "검색할 사용자 이름") @RequestParam String username) {
        Optional<User> user = userService.findByUsername(username);

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(user.get());
    }

    @Operation(summary = "일정 공유", description = "로그인한 사용자가 자신의 일정을 다른 사용자에게 공유합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "일정 공유 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 후 사용 가능합니다."),
            @ApiResponse(responseCode = "404", description = "공유할 사용자를 찾을 수 없습니다."),
            @ApiResponse(responseCode = "403", description = "일정을 공유할 권한이 없습니다.")
    })
    @PostMapping("/calendar/{calendarId}/share")
    public ResponseEntity<?> shareCalendar(
            @Parameter(description = "공유할 일정의 ID") @PathVariable Long calendarId,
            @Parameter(description = "공유 대상 사용자 이름") @RequestParam String username,
            HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        Optional<User> targetUser = userService.findByUsername(username);

        if (targetUser.isEmpty()) {
            return ResponseEntity.status(404).body("공유할 사용자를 찾을 수 없습니다.");
        }

        Calendar calendar = userService.getCalendarById(calendarId);

        if (calendar == null || !calendar.getUser().getId().equals(loggedUser.getId())) {
            return ResponseEntity.status(403).body("일정을 공유할 권한이 없습니다.");
        }

        shareService.shareCalendarWithUser(calendar, targetUser.get());
        return ResponseEntity.ok("일정이 성공적으로 공유되었습니다.");
    }

    @Operation(summary = "할 일 공유", description = "로그인한 사용자가 자신의 할 일을 다른 사용자에게 공유합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "할 일 공유 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 후 사용 가능합니다."),
            @ApiResponse(responseCode = "404", description = "공유할 사용자를 찾을 수 없습니다."),
            @ApiResponse(responseCode = "403", description = "할 일을 공유할 권한이 없습니다.")
    })
    @PostMapping("/todo/{todoId}/share")
    public ResponseEntity<?> shareTodo(
            @Parameter(description = "공유할 할 일의 ID") @PathVariable Long todoId,
            @Parameter(description = "공유 대상 사용자 이름") @RequestParam String username,
            HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        Optional<User> targetUser = userService.findByUsername(username);

        if (targetUser.isEmpty()) {
            return ResponseEntity.status(404).body("공유할 사용자를 찾을 수 없습니다.");
        }

        ToDo todo = userService.getToDoById(todoId);

        if (todo == null || !todo.getUser().getId().equals(loggedUser.getId())) {
            return ResponseEntity.status(403).body("할 일을 공유할 권한이 없습니다.");
        }

        shareService.shareToDoWithUser(todo, targetUser.get());
        return ResponseEntity.ok("할 일이 성공적으로 공유되었습니다.");
    }

    @Operation(summary = "일정 조회", description = "로그인한 사용자가 소유한 일정과 공유받은 일정을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "일정 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 후 사용 가능합니다.")
    })
    @GetMapping("/calendars")
    public ResponseEntity<?> getAllCalendars(HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        // CalendarDTO 리스트 가져오기
        List<CalendarDTO> calendarDTOs = shareService.getAllCalendarsForUser(loggedUser);

        return ResponseEntity.ok(calendarDTOs);
    }

    @Operation(summary = "할 일 조회", description = "로그인한 사용자가 소유한 할 일과 공유받은 할 일을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "할 일 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 후 사용 가능합니다.")
    })
    @GetMapping("/todos")
    public ResponseEntity<?> getAllTodos(HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        // 공유받은 작업만 가져오기
        List<ToDo> todos = shareService.getAllToDosForUser(loggedUser);
        List<TodoDTO> sharedTodoDTOs = todos.stream()
                .filter(todo -> !todo.getUser().getUsername().equals(loggedUser.getUsername()))
                .map(todo -> new TodoDTO(
                        todo.getId(),
                        todo.getTitle(),
                        todo.getSummary(),
                        todo.getTime(),
                        todo.getUser().getUsername()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(sharedTodoDTOs);
    }
}
