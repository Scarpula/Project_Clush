package com.lsd.repository;

import com.lsd.model.ToDo;
import com.lsd.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ToDoRepository extends JpaRepository<ToDo, Long> {
    List<ToDo> findByUser(User user);

    // 공유된 할 일 조회 쿼리 추가
    @Query("SELECT t FROM ToDo t JOIN t.sharedUsers u WHERE u = :user")
    List<ToDo> findBySharedUsers(@Param("user") User user);
}
