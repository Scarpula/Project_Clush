// src/main/java/com/lsd/controller/ShareController.java
package com.lsd.controller;

import com.lsd.dto.CalendarDTO;
import com.lsd.dto.TodoDTO;
import com.lsd.model.Calendar;
import com.lsd.model.ToDo;
import com.lsd.model.User;
import com.lsd.service.ShareService;
import com.lsd.service.UserService;
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

    // 특정 사용자 검색
    @GetMapping("/search")
    public ResponseEntity<?> searchUser(@RequestParam String username) {
        Optional<User> user = userService.findByUsername(username);

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(user.get());
    }

    // 일정 공유하기
    @PostMapping("/calendar/{calendarId}/share")
    public ResponseEntity<?> shareCalendar(@PathVariable Long calendarId, @RequestParam String username, HttpSession session) {
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

    // 할 일 공유하기
    @PostMapping("/todo/{todoId}/share")
    public ResponseEntity<?> shareTodo(@PathVariable Long todoId, @RequestParam String username, HttpSession session) {
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

    // 로그인한 사용자의 모든 일정과 공유된 일정 조회
    // ShareController.java
    @GetMapping("/calendars")
    public ResponseEntity<?> getAllCalendars(HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        // CalendarDTO 리스트 가져오기
        List<CalendarDTO> calendarDTOs = shareService.getAllCalendarsForUser(loggedUser);

        // 로그 출력 확인
        calendarDTOs.forEach(dto -> System.out.println("DTO isShared: " + dto.isShared()));

        return ResponseEntity.ok(calendarDTOs);
    }


    // 로그인한 사용자의 모든 할 일과 공유된 할 일 조회
    @GetMapping("/todos")
    public ResponseEntity<?> getAllTodos(HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        // 공유받은 작업만 가져오기
        List<ToDo> todos = shareService.getAllToDosForUser(loggedUser); // ToDo 리스트 가져오기
        List<TodoDTO> sharedTodoDTOs = todos.stream()
                .filter(todo -> !todo.getUser().getUsername().equals(loggedUser.getUsername())) // 공유받은 작업 필터링
                .map(todo -> new TodoDTO(
                        todo.getId(),
                        todo.getTitle(),
                        todo.getSummary(),
                        todo.getTime(),
                        todo.getUser().getUsername() // 공유한 사용자의 username 설정
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(sharedTodoDTOs); // 공유받은 TodoDTO 리스트만 반환
    }
}
