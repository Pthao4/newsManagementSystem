package com.newsManagementSystem.service.impl;

import com.newsManagementSystem.dto.SystemAccountDTO;
import com.newsManagementSystem.entity.SystemAccount;
import com.newsManagementSystem.mapper.SystemAccountMapper;
import com.newsManagementSystem.repository.SystemAccountRepository;
import com.newsManagementSystem.service.SystemAccountService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SystemAccountServiceImpl implements SystemAccountService {
    private final SystemAccountRepository systemAccountRepository;
    private final SystemAccountMapper systemAccountMapper;

    @Override
    public List<SystemAccountDTO> getSystemAccounts() {
        List<SystemAccount> systemAccounts = systemAccountRepository.findAll();
        return systemAccounts.stream()
                .map(systemAccountMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional
    public SystemAccountDTO updateSystemAccount(SystemAccountDTO systemAccountDTO) {
        Optional<SystemAccount> systemAccount = systemAccountRepository.findById(systemAccountDTO.getId());
        SystemAccount account = systemAccount.map(a->a).orElse(null);
        account.setPassword(systemAccountDTO.getPassword());
        account.setEmail(systemAccountDTO.getEmail());
        account.setRole(systemAccountDTO.getRole());
        account.setName(systemAccountDTO.getName());
        systemAccountRepository.save(account);
        return systemAccountMapper.toDTO(account);
    }

    @Override
    @Transactional
    public SystemAccountDTO addSystemAccount(SystemAccountDTO systemAccountDTO) {
        SystemAccount account = systemAccountMapper.toEntity(systemAccountDTO);
        return systemAccountMapper.toDTO(systemAccountRepository.save(account));
    }

    @Override
    public SystemAccountDTO findByEmail(String email) {
        Optional<SystemAccount> systemAccount = systemAccountRepository.findByEmail(email);
        return systemAccount
                .map(systemAccountMapper::toDTO)
                .orElse(null);
    }

    @Override
    public SystemAccountDTO findByUsername(String username) {
        Optional<SystemAccount> systemAccount = systemAccountRepository.findByName(username);
        return systemAccount
                .map(systemAccountMapper::toDTO)
                .orElse(null);
    }

    @Override
    public SystemAccountDTO findById(int id) {
        Optional<SystemAccount> systemAccount = systemAccountRepository.findById(id);
        return systemAccountMapper.toDTO(systemAccount.map(a->a).orElse(null));
    }

    @Override
    public SystemAccountDTO deleteSystemAccount(int id) {
        Optional<SystemAccount> systemAccount = systemAccountRepository.findById(id);
        if (systemAccount.isPresent()) {
            systemAccountRepository.delete(systemAccount.get());
            return systemAccountMapper.toDTO(systemAccount.get());
        }
        return null;
    }
}
