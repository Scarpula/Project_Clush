package com.lsd.repository;

import com.lsd.model.Calendar;
import com.lsd.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CalendarRepository extends JpaRepository<Calendar, Long> {
    List<Calendar> findByUser(User user);

    // 공유된 일정 조회 쿼리 추가
    @Query("SELECT c FROM Calendar c JOIN c.sharedUsers u WHERE u = :user")
    List<Calendar> findBySharedUsers(@Param("user") User user);
}
