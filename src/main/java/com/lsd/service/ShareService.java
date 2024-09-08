// src/main/java/com/lsd/service/ShareService.java
package com.lsd.service;

import com.lsd.dto.CalendarDTO;
import com.lsd.model.Calendar;
import com.lsd.model.ToDo;
import com.lsd.model.User;
import com.lsd.repository.CalendarRepository;
import com.lsd.repository.ToDoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShareService {

    @Autowired
    private CalendarRepository calendarRepository;

    @Autowired
    private ToDoRepository toDoRepository;

    // 일정 공유하기
    @Transactional
    public void shareCalendarWithUser(Calendar calendar, User targetUser) {
        calendar.getSharedUsers().add(targetUser); // Calendar 엔티티에 공유 사용자 리스트 추가
        calendarRepository.save(calendar);
    }

    // 할 일 공유하기
    @Transactional
    public void shareToDoWithUser(ToDo todo, User targetUser) {
        todo.getSharedUsers().add(targetUser); // ToDo 엔티티에 공유 사용자 리스트 추가
        toDoRepository.save(todo);
    }

    // 특정 사용자의 모든 일정과 공유된 일정 조회
    @Transactional(readOnly = true)
    public List<CalendarDTO> getAllCalendarsForUser(User user) {
        List<Calendar> ownCalendars = calendarRepository.findByUser(user);
        List<Calendar> sharedCalendars = calendarRepository.findBySharedUsers(user);

        // 자신의 일정과 공유된 일정을 CalendarDTO로 변환하고 isShared 플래그 설정
        List<CalendarDTO> ownCalendarDTOs = ownCalendars.stream()
                .map(calendar -> new CalendarDTO(
                        calendar.getId(),
                        calendar.getTitle(),
                        calendar.getStart(),
                        calendar.getEnd(),
                        calendar.getNotificationTime(),
                        calendar.getUser().getUsername(),
                        false // 자신의 일정이므로 isShared = false
                ))
                .collect(Collectors.toList());

        List<CalendarDTO> sharedCalendarDTOs = sharedCalendars.stream()
                .map(calendar -> new CalendarDTO(
                        calendar.getId(),
                        calendar.getTitle(),
                        calendar.getStart(),
                        calendar.getEnd(),
                        calendar.getNotificationTime(),
                        calendar.getUser().getUsername(),
                        true // 공유된 일정이므로 isShared = true
                ))
                .collect(Collectors.toList());

        ownCalendarDTOs.addAll(sharedCalendarDTOs); // 자신의 일정과 공유된 일정 합치기
        return ownCalendarDTOs;
    }

    // 특정 사용자의 모든 할 일과 공유된 할 일 조회
    @Transactional(readOnly = true)
    public List<ToDo> getAllToDosForUser(User user) {
        List<ToDo> ownTodos = toDoRepository.findByUser(user);
        // findBySharedUsers는 ToDo 엔티티에서 @ManyToMany로 설정한 sharedUsers 필드를 기반으로 해야 함
        List<ToDo> sharedTodos = toDoRepository.findBySharedUsers(user);
        ownTodos.addAll(sharedTodos);
        return ownTodos;
    }
}
