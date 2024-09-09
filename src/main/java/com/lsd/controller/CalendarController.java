package com.lsd.controller;

import com.lsd.dto.CalendarDTO;
import com.lsd.model.Calendar;
import com.lsd.model.User;
import com.lsd.service.CalendarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "로그인한 사용자의 전체 이벤트 조회", description = "현재 로그인한 사용자의 모든 이벤트를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이벤트 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 후 사용 가능합니다.")
    })
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

    @Operation(summary = "이벤트 추가", description = "로그인한 사용자를 기준으로 새로운 이벤트를 추가합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이벤트 추가 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 후 사용 가능합니다.")
    })
    @PostMapping
    public ResponseEntity<?> addEvent(
            @Parameter(description = "새로 추가할 이벤트 객체") @RequestBody Calendar calendar,
            HttpSession session) {
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

    @Operation(summary = "이벤트 수정", description = "로그인한 사용자가 자신의 이벤트를 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이벤트 수정 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 후 사용 가능합니다."),
            @ApiResponse(responseCode = "403", description = "수정 권한이 없습니다.")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @Parameter(description = "수정할 이벤트의 ID") @PathVariable Long id,
            @Parameter(description = "수정할 이벤트 정보") @RequestBody Calendar calendar,
            HttpSession session) {
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

    @Operation(summary = "이벤트 삭제", description = "로그인한 사용자가 자신의 이벤트를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이벤트 삭제 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 후 사용 가능합니다."),
            @ApiResponse(responseCode = "403", description = "삭제 권한이 없습니다.")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(
            @Parameter(description = "삭제할 이벤트의 ID") @PathVariable Long id,
            HttpSession session) {
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
