package com.newsManagementSystem.mapper;

import com.newsManagementSystem.dto.SystemAccountDTO;
import com.newsManagementSystem.entity.SystemAccount;
import org.springframework.stereotype.Component;

@Component
public class SystemAccountMapper {
    public SystemAccount toEntity(SystemAccountDTO system){

        return SystemAccount.builder()
                .id(system.getId())
                .name(system.getName())
                .email(system.getEmail())
                .role(system.getRole())
                .password(system.getPassword())
                .build();
    }

    public SystemAccountDTO toDTO(SystemAccount systemAccount){
        return SystemAccountDTO.builder()
                .id(systemAccount.getId())
                .name(systemAccount.getName())
                .email(systemAccount.getEmail())
                .role(systemAccount.getRole())
                .password(systemAccount.getPassword())
                .build();
    }

}
