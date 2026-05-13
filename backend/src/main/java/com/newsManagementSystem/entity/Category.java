package com.newsManagementSystem.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID", nullable = false)
    private Integer id;

    @Column(name = "CategoryName", length = 100, nullable = false)
    private String name;

    @Column(name = "CategoryDesciption", length = 250, nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentCategoryID")
    private Category parent;

//    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
//    private List<Category> children;

    @Column(name = "IsActive")
    private boolean isActive;
}
