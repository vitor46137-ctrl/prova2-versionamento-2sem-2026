package com.fiec.revisaop2.features.aluno.services.impl;

import com.fiec.revisaop2.features.aluno.models.dto.LoginAlunoDto;
import com.fiec.revisaop2.features.aluno.models.dto.RegisterAlunoDto;
import com.fiec.revisaop2.features.aluno.models.dto.ResponseAlunoDto;
import com.fiec.revisaop2.features.aluno.models.entities.Aluno;
import com.fiec.revisaop2.features.aluno.repositories.AlunoRepository;
import com.fiec.revisaop2.features.aluno.services.AlunoService;
import com.fiec.revisaop2.features.eventos.KafkaProducer;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AlunoServiceImpl implements AlunoService {


    private final AlunoRepository alunoRepository;
    private final KafkaProducer kafkaProducer;


    @Override
    public void registraAluno(RegisterAlunoDto registerAlunoDto) {
        Aluno aluno = Aluno.builder()
                .email(registerAlunoDto.getEmail())
                .password(registerAlunoDto.getPassword()) // In a real application, you should encode the password
                .name(registerAlunoDto.getName())
                .fcmToken(registerAlunoDto.getFcmToken())
                .build();
        alunoRepository.save(aluno);
    }

    @Override
    public void insereImagem(MultipartFile file, String userId) {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String bucket = "prova2";
        try {
            S3Client s3Client = S3Client.builder()
                    .region(Region.US_EAST_2)
                    .credentialsProvider(DefaultCredentialsProvider.builder().build())
                    .build();


            PutObjectRequest request = PutObjectRequest.builder()
                    .contentType(file.getContentType())
                    .key(fileName)
                    .bucket(bucket)
                    .build();


            s3Client.putObject(request,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            s3Client.close();
            System.out.println("[AWS S3] Imagem enviada com sucesso: " + fileName);

            kafkaProducer.sendMessage("mensagens", userId + "," + fileName);
            System.out.println("[Kafka] Evento publicado no tópico 'mensagens'");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Override
    public ResponseAlunoDto loginAluno(LoginAlunoDto loginAlunoDto) {
        Optional<Aluno> alunoOptional = alunoRepository.findByEmailAndPassword(
                loginAlunoDto.getEmail(),
                loginAlunoDto.getPassword()
        );

        if (alunoOptional.isPresent()) {
            Aluno aluno = alunoOptional.get();
            return ResponseAlunoDto.builder()
                    .id(UUID.randomUUID()) // Assuming ID is UUID in ResponseAlunoDto, but Aluno has Integer ID. This might need adjustment.
                    .email(aluno.getEmail())
                    .name(aluno.getName())
                    .fcmToken(aluno.getFcmToken())
                    .imageUrl(aluno.getImageUrl())
                    .build();
        }
        return null;
    }
}
