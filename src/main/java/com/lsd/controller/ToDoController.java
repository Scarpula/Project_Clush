// ToDoController.java
package com.lsd.controller;

import com.lsd.dto.TodoDTO;
import com.lsd.model.ToDo;
import com.lsd.model.User;
import com.lsd.repository.ToDoRepository;
import com.lsd.repository.UserRepository;
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

    // 새로운 ToDo 생성 (로그인한 사용자 기준)
    @PostMapping
    public ResponseEntity<?> createToDo(@RequestBody ToDo toDo, HttpSession session) {
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

    // 로그인한 사용자 기준 ToDo 리스트 불러오기
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
}
