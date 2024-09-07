package com.lsd.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String password;

    // 사용자가 생성한 캘린더 일정 리스트
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonManagedReference // 부모 측에 사용
    private List<ToDo> todos;

    // 사용자가 생성한 할 일 리스트
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Calendar> calendars;

}
