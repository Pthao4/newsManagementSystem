package com.newsManagementSystem.repository;

import com.newsManagementSystem.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByNewsArticleIdAndParentCommentIsNullOrderByCreatedDateDesc(int newsArticleId);
}
