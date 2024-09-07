// src/main/java/com/lsd/dto/UserDTO.java
package com.lsd.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private List<CalendarDTO> calendars;
    private List<TodoDTO> todos; // 추가된 필드
}
