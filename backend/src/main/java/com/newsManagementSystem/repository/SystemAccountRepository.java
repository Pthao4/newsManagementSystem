package com.newsManagementSystem.repository;

import com.newsManagementSystem.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Integer> {
    Optional<SystemAccount> findByEmail(String email);
    Optional<SystemAccount> findById(Short id);

    Optional<SystemAccount> findByName(String name);
}
