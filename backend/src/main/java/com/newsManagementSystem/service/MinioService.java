package com.newsManagementSystem.service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.buckets.post-images}")
    private String postImagesBucket;

    @Value("${minio.buckets.attachments}")
    private String attachmentsBucket;

    @Value("${minio.buckets.avatars}")
    private String avatarsBucket;

    public String uploadImage(MultipartFile file) {
        return uploadFileToBucket(file, postImagesBucket);
    }

    public String uploadAttachment(MultipartFile file) {
        return uploadFileToBucket(file, attachmentsBucket);
    }

    public String uploadAvatar(MultipartFile file) {
        return uploadFileToBucket(file, avatarsBucket);
    }

    private String uploadFileToBucket(MultipartFile file, String bucketName) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename().replace(" ", "_");
            InputStream inputStream = file.getInputStream();
            
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            // Generate presigned URL for 7 days
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(fileName)
                            .expiry(7, TimeUnit.DAYS)
                            .build()
            );

        } catch (Exception e) {
            log.error("Error occurred while uploading file to MinIO", e);
            throw new RuntimeException("Error occurred while uploading file to MinIO: " + e.getMessage());
        }
    }
}
