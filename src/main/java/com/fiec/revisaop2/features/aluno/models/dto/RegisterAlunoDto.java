package com.fiec.revisaop2.features.aluno.models.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RegisterAlunoDto {
    private String email;
    private String password;
    private String name;
    private String fcmToken;
}
