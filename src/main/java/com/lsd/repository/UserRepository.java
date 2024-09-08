// src/main/java/com/lsd/repository/UserRepository.java
package com.lsd.repository;

import com.lsd.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 사용자 이름과 비밀번호로 사용자 조회 (로그인 기능에 사용)
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.calendars WHERE u.username = :username AND u.password = :password")
    Optional<User> findByUsernameAndPassword(@Param("username") String username, @Param("password") String password);

    // 사용자 이름으로 사용자 조회 (공유 기능에 사용)
    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsername(@Param("username") String username);
}
