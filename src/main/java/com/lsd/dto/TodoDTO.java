// src/main/java/com/lsd/dto/TodoDTO.java
package com.lsd.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodoDTO {
    private Long id;
    private String title;
    private String summary;
    private LocalTime time;
    private String username;
}
