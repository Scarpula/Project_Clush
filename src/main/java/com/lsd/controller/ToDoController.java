package com.lsd.controller;

import com.lsd.dto.TodoDTO;
import com.lsd.model.ToDo;
import com.lsd.model.User;
import com.lsd.repository.ToDoRepository;
import com.lsd.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/todos")
public class ToDoController {

    private final ToDoRepository toDoRepository;
    private final UserRepository userRepository;

    public ToDoController(ToDoRepository toDoRepository, UserRepository userRepository) {
        this.toDoRepository = toDoRepository;
        this.userRepository = userRepository;
    }

    @Operation(summary = "새로운 ToDo 생성", description = "로그인한 사용자를 기준으로 새로운 ToDo를 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "ToDo 생성 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 후 사용 가능합니다.")
    })
    @PostMapping
    public ResponseEntity<?> createToDo(
            @Parameter(description = "새로 생성할 ToDo 객체") @RequestBody ToDo toDo,
            HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        toDo.setUser(loggedUser);
        ToDo savedToDo = toDoRepository.save(toDo);

        // ToDo를 TodoDTO로 변환하여 반환
        TodoDTO todoDTO = new TodoDTO(
                savedToDo.getId(),
                savedToDo.getTitle(),
                savedToDo.getSummary(),
                savedToDo.getTime(),
                loggedUser.getUsername() // username 추가
        );

        return ResponseEntity.ok(todoDTO);
    }

    @Operation(summary = "로그인한 사용자의 ToDo 조회", description = "현재 로그인한 사용자의 모든 ToDo를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "ToDo 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 후 사용 가능합니다.")
    })
    @GetMapping
    public ResponseEntity<?> getAllToDos(HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        // 로그인한 사용자의 ToDo 목록 조회 및 DTO 변환
        List<TodoDTO> todos = toDoRepository.findByUser(loggedUser).stream()
                .map(toDo -> new TodoDTO(
                        toDo.getId(),
                        toDo.getTitle(),
                        toDo.getSummary(),
                        toDo.getTime(),
                        toDo.getUser().getUsername() // username 추가
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(todos);
    }

    @Operation(summary = "ToDo 삭제", description = "로그인한 사용자가 자신의 ToDo를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "ToDo 삭제 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 후 사용 가능합니다."),
            @ApiResponse(responseCode = "403", description = "삭제 권한이 없습니다.")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteToDo(
            @Parameter(description = "삭제할 ToDo의 ID") @PathVariable Long id,
            HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        // 삭제할 ToDo를 조회
        ToDo toDo = toDoRepository.findById(id).orElse(null);

        // ToDo가 없거나 삭제할 권한이 없는 경우 처리
        if (toDo == null || !toDo.getUser().getId().equals(loggedUser.getId())) {
            return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
        }

        // ToDo 삭제
        toDoRepository.delete(toDo);

        return ResponseEntity.ok("작업이 성공적으로 삭제되었습니다.");
    }
}
