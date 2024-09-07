// src/main/java/com/lsd/controller/CalendarController.java
package com.lsd.controller;

import com.lsd.dto.CalendarDTO;
import com.lsd.model.Calendar;
import com.lsd.model.User;
import com.lsd.service.CalendarService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cal")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    // 로그인한 사용자 기준 전체 이벤트 조회
    @GetMapping
    public ResponseEntity<?> getAllEvents(HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        List<Calendar> events = calendarService.getEventsByUser(loggedUser);

        // Calendar 객체를 CalendarDTO로 변환하여 반환
        List<CalendarDTO> eventDTOs = events.stream()
                .map(CalendarDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(eventDTOs);
    }

    // 이벤트 추가 (로그인한 사용자 기준)
    @PostMapping
    public ResponseEntity<?> addEvent(@RequestBody Calendar calendar, HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        calendar.setUser(loggedUser);
        Calendar savedEvent = calendarService.addEvent(calendar);

        // 저장된 이벤트를 DTO로 변환하여 반환
        CalendarDTO eventDTO = new CalendarDTO(savedEvent);
        return ResponseEntity.ok(eventDTO);
    }

    // 이벤트 수정 (로그인한 사용자 기준)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Calendar calendar, HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        Calendar existingEvent = calendarService.getEventById(id);

        if (existingEvent == null || !existingEvent.getUser().getId().equals(loggedUser.getId())) {
            return ResponseEntity.status(403).body("수정 권한이 없습니다.");
        }

        Calendar updatedEvent = calendarService.updateEvent(id, calendar);

        // 수정된 이벤트를 DTO로 변환하여 반환
        CalendarDTO eventDTO = new CalendarDTO(updatedEvent);
        return ResponseEntity.ok(eventDTO);
    }

    // 이벤트 삭제 (로그인한 사용자 기준)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, HttpSession session) {
        User loggedUser = (User) session.getAttribute("user");

        if (loggedUser == null) {
            return ResponseEntity.status(401).body("로그인 후 사용 가능합니다.");
        }

        Calendar event = calendarService.getEventById(id);

        if (event == null || !event.getUser().getId().equals(loggedUser.getId())) {
            return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
        }

        calendarService.deleteEvent(id);
        return ResponseEntity.ok("이벤트가 성공적으로 삭제되었습니다.");
    }
}
