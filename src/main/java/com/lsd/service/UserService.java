// src/main/java/com/lsd/service/UserService.java
package com.lsd.service;

import com.lsd.dto.CalendarDTO;
import com.lsd.dto.TodoDTO;
import com.lsd.dto.UserDTO;
import com.lsd.model.User;
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
                                calendar.getStart(), // LocalDate로 수정
                                calendar.getEnd(),   // LocalDate로 수정
                                calendar.getNotificationTime(),
                                calendar.getUser().getUsername()
                        ))
                        .collect(Collectors.toList()),
                user.getTodos().stream()
                        .map(todo -> new TodoDTO(
                                todo.getId(),
                                todo.getTitle(),
                                todo.getSummary(),
                                todo.getTime(),
                                todo.getUsername()
                        ))
                        .collect(Collectors.toList())
        );
    }
}
