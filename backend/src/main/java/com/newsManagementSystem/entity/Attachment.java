package com.newsManagementSystem.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "Attachment")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "FileName")
    private String fileName;

    @Column(name = "ContentType")
    private String contentType;

    @Column(name = "FileSize")
    private Long size;

    @Column(name = "FileUrl", length = 1000)
    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NewsArticleID")
    private NewsArticle newsArticle;
}
