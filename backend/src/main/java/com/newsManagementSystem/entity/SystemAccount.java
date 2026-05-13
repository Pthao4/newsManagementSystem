package com.newsManagementSystem.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "SystemAccount")
public class SystemAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountID", nullable = false)
    private int id;

    @Column(name = "AccountName", length = 100)
    private String name;

    @Column(name = "AccountEmail", length = 70)
    private String email;

//    @Enumerated(EnumType.STRING)
    @Column(name = "AccountRole")
    private int role;

    @Column(name = "AccountPassword", length = 70)
    private String password;
}
