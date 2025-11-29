package com.newsManagementSystem.security;

import com.newsManagementSystem.entity.SystemAccount;
import com.newsManagementSystem.repository.SystemAccountRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service  // 👈 rất quan trọng để Spring tạo bean
public class CustomUserDetailsService implements UserDetailsService {

    private final SystemAccountRepository repository;

    public CustomUserDetailsService(SystemAccountRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        SystemAccount account = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return new CustomUserDetails(account);
    }
}
