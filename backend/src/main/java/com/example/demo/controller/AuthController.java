package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        System.out.println("Register endpoint hit for user: " + user.getUsername());
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        System.out.println("Request headers: " + request.getHeaderNames());
        
        Map<String, String> response = new HashMap<>();
        System.out.println("Register request received for user: " + user.getUsername());
        try {
            // Check if username or email already exists
            if (userService.existsByUsername(user.getUsername())) {
                System.out.println("Username already exists: " + user.getUsername());
                response.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(response);
            }
            if (userService.existsByEmail(user.getEmail())) {
                System.out.println("Email already exists: " + user.getEmail());
                response.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }

            // Save the user to database
            System.out.println("Attempting to save user: " + user.getUsername());
            userService.saveUser(user);
            System.out.println("User successfully saved: " + user.getUsername());
            
            // Generate JWT token
            final String jwt = jwtUtil.generateToken(user.getUsername());
            
            response.put("message", "User registered successfully");
            response.put("token", jwt);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            response.put("message", "Registration failed");
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            System.out.println("Login attempt for email: " + loginRequest.getEmail()); // Debug log
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String username = ((UserDetails) authentication.getPrincipal()).getUsername();
            System.out.println("Authenticated username: " + username); // Debug log
            
            String jwt = jwtUtil.generateToken(username);
            System.out.println("Generated JWT Token: " + jwt);
            
            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            response.put("email", loginRequest.getEmail());
            
            System.out.println("Returning response: " + response); // Debug log
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            e.printStackTrace(); // Debug log
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Login failed");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getUserStatus() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated"));
        }
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findByUsername(userDetails.getUsername()).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // For stateless JWT, server-side logout can be minimal.
        // The client is responsible for destroying the token.
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
}
