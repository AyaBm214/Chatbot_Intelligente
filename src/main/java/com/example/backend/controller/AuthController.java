package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> loginData) {
        try {
            System.out.println("Login attempt received for username: " + loginData.get("username"));
            String username = loginData.get("username");
            String password = loginData.get("password");
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            
            System.out.println("Authentication successful for user: " + username);
            
            User user = userRepository.findByUsername(username).orElseThrow();
            System.out.println("User found in database: " + user.getUsername() + ", Role: " + user.getRole());
            
            String token = jwtUtil.generateToken(username, user.getRole());
            System.out.println("JWT token generated successfully");
            
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getRole());
            return response;
        } catch (AuthenticationException e) {
            System.out.println("Authentication failed: " + e.getMessage());
            throw new BadCredentialsException("Invalid username or password");
        } catch (Exception e) {
            System.out.println("Unexpected error during login: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> registerData) {
        String username = registerData.get("username");
        String password = registerData.get("password");
        String role = registerData.get("role");
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        userRepository.save(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return response;
    }

    @PostMapping("/refresh")
    public Map<String, String> refreshToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BadCredentialsException("Token manquant ou invalide");
        }
        
        String token = authHeader.substring(7);
        try {
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);
            
            // Vérifier que l'utilisateur existe toujours
            if (!userRepository.findByUsername(username).isPresent()) {
                throw new BadCredentialsException("Utilisateur non trouvé");
            }
            
            // Générer un nouveau token
            String newToken = jwtUtil.generateToken(username, role);
            Map<String, String> response = new HashMap<>();
            response.put("token", newToken);
            response.put("role", role);
            return response;
        } catch (Exception e) {
            throw new BadCredentialsException("Token invalide");
        }
    }
} 