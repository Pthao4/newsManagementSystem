package com.newsManagementSystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Tag")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TagID", nullable = false)
    private int id;

    @Column(name = "TagName", length = 50)
    private String name;

    @Column(name = "Note", length = 400)
    private String note;

    @ManyToMany(mappedBy = "newsTag" , fetch = FetchType.LAZY)
    private List<NewsArticle> newsTags;
}
