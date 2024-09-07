package com.lsd.service;

import com.lsd.model.Calendar;
import com.lsd.model.User;
import com.lsd.repository.CalendarRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalendarService {

    private final CalendarRepository calendarRepository;

    public List<Calendar> getEventsByUser(User user) {
        return calendarRepository.findByUser(user); // 로그인된 사용자에 맞는 이벤트만 조회
    }
    public Calendar getEventById(Long id) {
        return calendarRepository.findById(id).orElse(null);
    }

    public CalendarService(CalendarRepository calendarRepository) {
        this.calendarRepository = calendarRepository;
    }

    public List<Calendar> getAllEvents() {
        return calendarRepository.findAll();
    }

    public Calendar addEvent(Calendar calendar) {
        return calendarRepository.save(calendar);
    }

    public Calendar updateEvent(Long id, Calendar updatedCalendar) {
        Calendar existingCalendar = calendarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        existingCalendar.setTitle(updatedCalendar.getTitle());
        existingCalendar.setStart(updatedCalendar.getStart());
        existingCalendar.setEnd(updatedCalendar.getEnd());
        existingCalendar.setNotificationTime(updatedCalendar.getNotificationTime());
        return calendarRepository.save(existingCalendar);
    }

    public void deleteEvent(Long id) {
        calendarRepository.deleteById(id);
    }

}
