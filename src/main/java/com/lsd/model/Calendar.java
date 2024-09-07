package com.lsd.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Builder
public class Calendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private LocalDate start;

    private LocalDate end;

    private String notificationTime;

    private String username;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // User와의 관계 설정
    @JsonBackReference
    private User user;
}
