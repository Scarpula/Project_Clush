package com.lsd.repository;

import com.lsd.model.ToDo;
import com.lsd.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ToDoRepository extends JpaRepository<ToDo, Long> {
    // 로그인한 사용자의 ToDo 목록 조회
    List<ToDo> findByUser(User user);
}
