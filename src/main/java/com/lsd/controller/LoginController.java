package com.lsd.controller;

import com.lsd.dto.UserDTO;
import com.lsd.model.User;
import com.lsd.repository.UserRepository;
import com.lsd.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "로그인 요청 처리", description = "사용자의 로그인 요청을 처리합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 실패: 잘못된 아이디 또는 비밀번호")
    })
    @PostMapping("/login")
    public ResponseEntity<String> login(
            @Parameter(description = "로그인 요청 정보") @RequestBody User loginUser,
            HttpSession session) {
        Optional<User> user = userRepository.findByUsernameAndPassword(
                loginUser.getUsername(), loginUser.getPassword());

        if (user.isPresent()) {
            session.setAttribute("user", user.get());
            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(401).body("로그인 실패: 잘못된 아이디 또는 비밀번호");
        }
    }

    @Operation(summary = "로그아웃 요청 처리", description = "사용자의 로그아웃 요청을 처리합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그아웃 성공")
    })
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("로그아웃 성공");
    }

    @Operation(summary = "현재 로그인된 사용자 정보 조회", description = "세션에서 현재 로그인된 사용자 정보를 가져옵니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인된 사용자 정보 조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인되지 않은 상태")
    })
    @GetMapping("/session")
    public ResponseEntity<UserDTO> getSessionUser(HttpSession session) {
        User user = (User) session.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(401).body(null); // 로그인되지 않은 상태
        }

        UserDTO userDTO = userService.getUserWithDetails(user.getId());

        return ResponseEntity.ok(userDTO);
    }
}
