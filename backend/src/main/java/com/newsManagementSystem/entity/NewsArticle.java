package com.newsManagementSystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "NewsArticle")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticle {
    @Id
//    @UuidGenerator(style = UuidGenerator.Style.TIME)
//    @GeneratedValue
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NewsArticleID", columnDefinition = "nvarchar", length = 20, nullable = false)
    private int id;

    @Column(name = "NewsTitle", columnDefinition = "nvarchar",length = 400, nullable = true)
    private String title;

    @Column(name = "Headline", columnDefinition = "nvarchar",length = 150, nullable = false)
    private String headline;

    @Column(name = "NewsContent", columnDefinition = "nvarchar", length = 4000)
    private String content;

    @Column(name = "NewsSource", columnDefinition = "nvarchar", length = 400)
    private String source;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "NewsTag",
            joinColumns = @JoinColumn(name = "NewsArticleID"),
            inverseJoinColumns = @JoinColumn(name = "TagID")
    )
    private List<Tag> newsTag;

//    @Enumerated(EnumType.STRING)
    @Column(name = "NewsStatus", columnDefinition = "bit")
    private boolean status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryID")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedByID")
    private SystemAccount createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UpdatedByID")
    private SystemAccount updatedBy;

    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    @Column(name = "ModifiedDate")
    private LocalDateTime modifiedDate;
}
