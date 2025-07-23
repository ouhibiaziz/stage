package com.example.demo.controller;

import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    private final UserRepository userRepository;
    
    public TestController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @GetMapping("/db")
    public String testDatabase() {
        try {
            long count = userRepository.count();
            return "Database connection successful! User count: " + count;
        } catch (Exception e) {
            return "Database error: " + e.getMessage();
        }
    }
    
    @GetMapping("/connectivity")
    public String testConnectivity() {
        System.out.println("Connectivity test endpoint hit");
        return "Backend connection successful!";
    }
}
