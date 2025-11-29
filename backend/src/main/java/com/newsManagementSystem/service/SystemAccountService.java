package com.newsManagementSystem.service;

import com.newsManagementSystem.dto.SystemAccountDTO;

import java.util.List;

public interface SystemAccountService {
    List<SystemAccountDTO> getSystemAccounts();
    SystemAccountDTO updateSystemAccount(SystemAccountDTO systemAccountDTO);
    SystemAccountDTO addSystemAccount(SystemAccountDTO systemAccountDTO);
    SystemAccountDTO findByEmail(String email);
    SystemAccountDTO findByUsername(String username);
    SystemAccountDTO findById(int id);
    SystemAccountDTO deleteSystemAccount(int id);
}
