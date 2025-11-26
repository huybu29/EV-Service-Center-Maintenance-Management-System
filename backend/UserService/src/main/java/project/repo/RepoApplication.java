package project.repo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cache.annotation.EnableCaching;
@EnableCaching
@EnableDiscoveryClient
@EnableFeignClients
@SpringBootApplication
public class RepoApplication {

	public static void main(String[] args) {
		SpringApplication.run(RepoApplication.class, args);
	}

}
