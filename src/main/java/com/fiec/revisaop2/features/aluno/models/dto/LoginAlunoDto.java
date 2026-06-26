package com.fiec.revisaop2.features.aluno.models.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginAlunoDto {
    private String email;
    private String password;
}
