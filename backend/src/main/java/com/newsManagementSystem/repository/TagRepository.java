package com.newsManagementSystem.repository;

import com.newsManagementSystem.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {
    Optional<Tag> findByNameIgnoreCase(String name);
    List<Tag> findByNameInIgnoreCase(Collection<String> names);
    List<Tag> findByNameContainingIgnoreCase(String keyword);
}
