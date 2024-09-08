// src/main/java/com/lsd/dto/CalendarDTO.java
package com.lsd.dto;

import com.lsd.model.Calendar;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalendarDTO {
    private Long id;
    private String title;
    private LocalDate start;
    private LocalDate end;
    private String notificationTime;
    private String username;
    private boolean isShared;

    // Calendar 객체를 CalendarDTO로 변환하는 생성자
    public CalendarDTO(Calendar calendar) {
        this.id = calendar.getId();
        this.title = calendar.getTitle();
        this.start = calendar.getStart();
        this.end = calendar.getEnd();
        this.notificationTime = calendar.getNotificationTime();
        this.username = calendar.getUser() != null ? calendar.getUser().getUsername() : null;
        this.isShared = calendar.isShared(); // Calendar의 isShared 필드를 DTO에 반영
    }
}
