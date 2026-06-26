package com.newsManagementSystem.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class MinioConfig {

    @Value("${minio.url}")
    private String minioUrl;

    @Value("${minio.access-key}")
    private String accessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    @Value("${minio.buckets.avatars}")
    private String avatarsBucket;

    @Value("${minio.buckets.post-images}")
    private String postImagesBucket;

    @Value("${minio.buckets.attachments}")
    private String attachmentsBucket;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioUrl)
                .credentials(accessKey, secretKey)
                .build();
    }

    @Bean
    public org.springframework.boot.CommandLineRunner initBuckets(MinioClient minioClient) {
        return args -> {
            try {
                String[] buckets = {avatarsBucket, postImagesBucket, attachmentsBucket};

                for (String bucket : buckets) {
                    boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
                    if (!found) {
                        minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
                        log.info("MinIO bucket created successfully: {}", bucket);
                    } else {
                        log.info("MinIO bucket already exists: {}", bucket);
                    }
                }
            } catch (Exception e) {
                log.error("Error occurred while initializing MinIO buckets", e);
            }
        };
    }
}
