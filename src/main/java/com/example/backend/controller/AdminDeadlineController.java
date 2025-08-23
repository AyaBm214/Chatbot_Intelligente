package com.example.backend.controller;

import com.example.backend.model.Deadline;
import com.example.backend.model.User;
import com.example.backend.repository.DeadlineRepository;
import com.example.backend.repository.UserRepository;
// removed DTO dependency; entity exposes classe/filiere via JsonProperty
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/deadlines")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDeadlineController {
    
    @Autowired
    private DeadlineRepository deadlineRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Récupérer toutes les deadlines
    @GetMapping
    public List<Deadline> getAllDeadlines() {
        return deadlineRepository.findAll();
    }
    
    // Récupérer une deadline par ID
    @GetMapping("/{id}")
    public ResponseEntity<Deadline> getDeadlineById(@PathVariable Long id) {
        Optional<Deadline> deadline = deadlineRepository.findById(id);
        return deadline.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    // Créer une nouvelle deadline
    @PostMapping
    public ResponseEntity<Deadline> createDeadline(@RequestBody Map<String, Object> deadlineData) {
        try {
            Deadline deadline = new Deadline();
            deadline.setTitre((String) deadlineData.get("titre"));
            deadline.setDescription((String) deadlineData.get("description"));
            
            // Conversion de la date
            String dateString = (String) deadlineData.get("dateLimite");
            LocalDateTime dateLimite = LocalDateTime.parse(dateString.replace("Z", ""));
            deadline.setDateLimite(dateLimite);
            
            deadline.setType((String) deadlineData.get("type"));

            String classe = (String) deadlineData.get("classe");
            String filiere = (String) deadlineData.get("filiere");
            String etudiant = (String) deadlineData.get("etudiant");

            deadline.setClasse((classe != null && !classe.isBlank()) ? classe : null);
            deadline.setFiliere((filiere != null && !filiere.isBlank()) ? filiere : null);

            Deadline savedDeadline = deadlineRepository.save(deadline);
            return ResponseEntity.ok(savedDeadline);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Mettre à jour une deadline
    @PutMapping("/{id}")
    public ResponseEntity<Deadline> updateDeadline(@PathVariable Long id, @RequestBody Map<String, Object> deadlineData) {
        Optional<Deadline> optionalDeadline = deadlineRepository.findById(id);
        if (optionalDeadline.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            Deadline deadline = optionalDeadline.get();
            deadline.setTitre((String) deadlineData.get("titre"));
            deadline.setDescription((String) deadlineData.get("description"));
            
            String dateString = (String) deadlineData.get("dateLimite");
            LocalDateTime dateLimite = LocalDateTime.parse(dateString.replace("Z", ""));
            deadline.setDateLimite(dateLimite);
            
            deadline.setType((String) deadlineData.get("type"));

            String classe = (String) deadlineData.get("classe");
            String filiere = (String) deadlineData.get("filiere");
            String etudiant = (String) deadlineData.get("etudiant");

            deadline.setClasse((classe != null && !classe.isBlank()) ? classe : null);
            deadline.setFiliere((filiere != null && !filiere.isBlank()) ? filiere : null);

            Deadline updatedDeadline = deadlineRepository.save(deadline);
            return ResponseEntity.ok(updatedDeadline);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Supprimer une deadline
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeadline(@PathVariable Long id) {
        if (!deadlineRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        deadlineRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    // Récupérer la liste des classes/filières disponibles
    @GetMapping("/classes")
    public ResponseEntity<List<String>> getAvailableClasses() {
        List<String> classes = userRepository.findDistinctClasses();
        return ResponseEntity.ok(classes);
    }
    
    // Récupérer la liste des filières disponibles
    @GetMapping("/filieres")
    public ResponseEntity<List<String>> getAvailableFilieres() {
        List<String> filieres = userRepository.findDistinctFilieres();
        return ResponseEntity.ok(filieres);
    }
    
    // Récupérer la liste des étudiants
    @GetMapping("/etudiants")
    public ResponseEntity<List<User>> getAllEtudiants() {
        List<User> etudiants = userRepository.findByRole("etudiant");
        return ResponseEntity.ok(etudiants);
    }
}
