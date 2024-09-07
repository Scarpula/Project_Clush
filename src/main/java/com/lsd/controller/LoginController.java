// LoginController.java
package com.lsd.controller;

import com.lsd.dto.UserDTO;
import com.lsd.model.User;
import com.lsd.repository.UserRepository;
import com.lsd.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    // 로그인 요청 처리
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginUser, HttpSession session) {
        Optional<User> user = userRepository.findByUsernameAndPassword(
                loginUser.getUsername(), loginUser.getPassword());

        if (user.isPresent()) {
            session.setAttribute("user", user.get());
            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(401).body("로그인 실패: 잘못된 아이디 또는 비밀번호");
        }
    }

    // 로그아웃 요청 처리
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("로그아웃 성공");
    }

    // 세션에서 현재 로그인된 사용자 정보 가져오기
    @GetMapping("/session")
    public ResponseEntity<UserDTO> getSessionUser(HttpSession session) {
        UserDTO userDTO = userService.getUserWithDetails(((User) session.getAttribute("user")).getId());

        if (userDTO == null) {
            return ResponseEntity.status(401).body(null); // 로그인되지 않은 상태
        }

        return ResponseEntity.ok(userDTO);
    }
}
