// src/main/java/com/lsd/service/UserService.java
package com.lsd.service;

import com.lsd.dto.CalendarDTO;
import com.lsd.dto.TodoDTO;
import com.lsd.dto.UserDTO;
import com.lsd.model.Calendar;
import com.lsd.model.ToDo;
import com.lsd.model.User;
import com.lsd.repository.CalendarRepository;
import com.lsd.repository.ToDoRepository;
import com.lsd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CalendarRepository calendarRepository;

    @Autowired
    private ToDoRepository toDoRepository;

    @Transactional(readOnly = true)
    public UserDTO getUserWithDetails(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return null;
        }

        User user = userOptional.get();

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getCalendars().stream()
                        .map(calendar -> new CalendarDTO(
                                calendar.getId(),
                                calendar.getTitle(),
                                calendar.getStart(),
                                calendar.getEnd(),
                                calendar.getNotificationTime(),
                                calendar.getUser().getUsername(),
                                calendar.isShared() // 공유 여부 반영
                        ))
                        .collect(Collectors.toList()),
                user.getTodos().stream()
                        .map(todo -> new TodoDTO(
                                todo.getId(),
                                todo.getTitle(),
                                todo.getSummary(),
                                todo.getTime(),
                                todo.getUser().getUsername()
                        ))
                        .collect(Collectors.toList())
        );
    }

    // Calendar ID로 조회
    @Transactional(readOnly = true)
    public Calendar getCalendarById(Long calendarId) {
        return calendarRepository.findById(calendarId).orElse(null);
    }

    // ToDo ID로 조회
    @Transactional(readOnly = true)
    public ToDo getToDoById(Long todoId) {
        return toDoRepository.findById(todoId).orElse(null);
    }

    // 특정 사용자 검색
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
