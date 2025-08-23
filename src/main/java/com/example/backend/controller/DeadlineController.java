package com.example.backend.controller;

import com.example.backend.dto.DeadlineDTO;
import com.example.backend.model.Deadline;
import com.example.backend.repository.DeadlineRepository;
import com.example.backend.service.DeadlineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.util.HashMap;
import java.util.Map;

import java.util.List;
import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping({"/api/deadlines", "/deadlines"})
public class DeadlineController {
    @Autowired
    private DeadlineRepository deadlineRepository;
    
    @Autowired
    private DeadlineService deadlineService;

    // Endpoint pour récupérer les deadlines de l'étudiant connecté
    @GetMapping("/my")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<List<Deadline>> getMyDeadlines() {
        try {
            System.out.println("Accessing /my deadlines endpoint");
            List<Deadline> deadlines = deadlineService.getDeadlinesForCurrentUser();
            System.out.println("Found " + deadlines.size() + " deadlines for current user");
            return ResponseEntity.ok(deadlines);
        } catch (Exception e) {
            System.out.println("Error in getMyDeadlines: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Lister toutes les deadlines (étudiant et admin)
    @GetMapping
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN')")
    public List<Deadline> getAllDeadlines() {
        System.out.println("Accessing /deadlines endpoint");
        List<Deadline> deadlines = deadlineRepository.findAll();
        System.out.println("Found " + deadlines.size() + " total deadlines");
        
        // Debug: Print each deadline's details
        for (Deadline deadline : deadlines) {
            System.out.println("Deadline ID: " + deadline.getId());
            System.out.println("  Titre: " + deadline.getTitre());
            System.out.println("  Description: " + deadline.getDescription());
            System.out.println("  Date Limite: " + deadline.getDateLimite());
            System.out.println("  Type: " + deadline.getType());
            System.out.println("  Classe: " + deadline.getClasse());
            System.out.println("  Filiere: " + deadline.getFiliere());
            System.out.println("  ---");
        }
        
        return deadlines;
    }

    // Ajouter une deadline (admin)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Deadline createDeadline(@RequestBody Deadline deadline) {
        return deadlineRepository.save(deadline);
    }

    // Modifier une deadline (admin)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Deadline> updateDeadline(@PathVariable Long id, @RequestBody Deadline deadlineDetails) {
        Optional<Deadline> optionalDeadline = deadlineRepository.findById(id);
        if (optionalDeadline.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Deadline deadline = optionalDeadline.get();
        deadline.setTitre(deadlineDetails.getTitre());
        deadline.setDescription(deadlineDetails.getDescription());
        deadline.setDateLimite(deadlineDetails.getDateLimite());
        deadline.setType(deadlineDetails.getType());
        deadline.setClasse(deadlineDetails.getClasse());
        deadline.setFiliere(deadlineDetails.getFiliere());
        Deadline updated = deadlineRepository.save(deadline);
        return ResponseEntity.ok(updated);
    }

    // Supprimer une deadline (admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDeadline(@PathVariable Long id) {
        if (!deadlineRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        deadlineRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    // Test endpoint to check authentication
    @GetMapping("/test-auth")
    public ResponseEntity<Map<String, Object>> testAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", authentication != null && authentication.isAuthenticated());
        response.put("username", authentication != null ? authentication.getName() : "none");
        response.put("authorities", authentication != null ? authentication.getAuthorities() : "none");
        response.put("principal", authentication != null ? authentication.getPrincipal() : "none");
        return ResponseEntity.ok(response);
    }
    
    // Public test endpoint (no authentication required)
    @GetMapping("/public-test")
    public ResponseEntity<Map<String, String>> publicTest() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Public endpoint working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("service", "Deadline Service");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
    
    // Database schema check endpoint
    @GetMapping("/schema-check")
    public ResponseEntity<Map<String, Object>> schemaCheck() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Deadline> deadlines = deadlineRepository.findAll();
            response.put("total_deadlines", deadlines.size());
            
            if (!deadlines.isEmpty()) {
                Deadline first = deadlines.get(0);
                DeadlineDTO dto = new DeadlineDTO(first);
                
                Map<String, Object> sample = new HashMap<>();
                sample.put("id", dto.getId());
                sample.put("titre", dto.getTitre());
                sample.put("description", dto.getDescription());
                sample.put("dateLimite", dto.getDateLimite());
                sample.put("type", dto.getType());
                sample.put("cible", dto.getCible());
                sample.put("valeurCible", dto.getValeurCible());
                sample.put("classe", dto.getClasse());
                sample.put("filiere", dto.getFiliere());
                response.put("sample_deadline_dto", sample);
                
                // Also show original data
                Map<String, Object> original = new HashMap<>();
                original.put("id", first.getId());
                original.put("titre", first.getTitre());
                original.put("description", first.getDescription());
                original.put("dateLimite", first.getDateLimite());
                original.put("type", first.getType());

                response.put("sample_deadline_original", original);
            }
            
            response.put("status", "success");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("error", e.getMessage());
            e.printStackTrace();
        }
        return ResponseEntity.ok(response);
    }
    
    // Test data insertion endpoint
    @PostMapping("/insert-test-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> insertTestData() {
        Map<String, String> response = new HashMap<>();
        try {
            // Create test deadlines with proper cible and valeurCible values
            Deadline deadline1 = new Deadline();
            deadline1.setTitre("Rendu TP Java");
            deadline1.setDescription("Rendre le TP sur les collections Java en format PDF");
            deadline1.setDateLimite(java.time.LocalDateTime.of(2024, 1, 15, 23, 59));
            deadline1.setType("TP");

            deadlineRepository.save(deadline1);
            
            Deadline deadline2 = new Deadline();
            deadline2.setTitre("Examen Base de données");
            deadline2.setDescription("Examen final sur les bases de données relationnelles");
            deadline2.setDateLimite(java.time.LocalDateTime.of(2024, 1, 20, 14, 0));
            deadline2.setType("Examen");

            deadlineRepository.save(deadline2);
            
            Deadline deadline3 = new Deadline();
            deadline3.setTitre("Deadline générale");
            deadline3.setDescription("Information importante pour tous les étudiants");
            deadline3.setDateLimite(java.time.LocalDateTime.of(2024, 2, 1, 23, 59));
            deadline3.setType("Information");

            deadlineRepository.save(deadline3);
            
            response.put("message", "Test data inserted successfully");
            response.put("status", "success");
        } catch (Exception e) {
            response.put("message", "Error inserting test data: " + e.getMessage());
            response.put("status", "error");
            e.printStackTrace();
        }
        return ResponseEntity.ok(response);
    }
    
    // Log all requests to this controller
    @ModelAttribute
    public void logRequest(HttpServletRequest request) {
        System.out.println("=== DeadlineController Request ===");
        System.out.println("Method: " + request.getMethod());
        System.out.println("URI: " + request.getRequestURI());
        System.out.println("URL: " + request.getRequestURL());
        System.out.println("Authorization: " + request.getHeader("Authorization"));
        System.out.println("Content-Type: " + request.getHeader("Content-Type"));
        System.out.println("================================");
    }
} 