// src/main/java/com/lsd/model/Calendar.java
package com.lsd.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

    private boolean isShared; // 공유 여부 필드

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // User와의 관계 설정
    @JsonBackReference
    private User user;

    @ManyToMany
    @JoinTable(
            name = "calendar_shared_users",
            joinColumns = @JoinColumn(name = "calendar_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private List<User> sharedUsers = new ArrayList<>();
}
