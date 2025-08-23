package com.example.backend.service;

import com.example.backend.model.Deadline;
import com.example.backend.model.User;
import com.example.backend.repository.DeadlineRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DeadlineService {
    
    @Autowired
    private DeadlineRepository deadlineRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Deadline> getDeadlinesForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        System.out.println("Getting deadlines for user: " + username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        System.out.println("User found: " + user.getUsername() + ", Role: " + user.getRole() + ", Classe: " + user.getClasse() + ", Filiere: " + user.getFiliere());
        
        List<Deadline> userDeadlines = new ArrayList<>();
        
        // Ajouter les deadlines générales (pour tous)
        List<Deadline> generales = deadlineRepository.findDeadlinesGenerales();
        System.out.println("General deadlines found: " + generales.size());
        userDeadlines.addAll(generales);
        
        // Ajouter les deadlines pour la classe de l'étudiant
        if (user.getClasse() != null && !user.getClasse().isEmpty()) {
            List<Deadline> classeDeadlines = deadlineRepository.findByClasse(user.getClasse());
            System.out.println("Class deadlines for " + user.getClasse() + ": " + classeDeadlines.size());
            userDeadlines.addAll(classeDeadlines);
        }
        
        // Ajouter les deadlines pour la filière de l'étudiant
        if (user.getFiliere() != null && !user.getFiliere().isEmpty()) {
            List<Deadline> filiereDeadlines = deadlineRepository.findByFiliere(user.getFiliere());
            System.out.println("Filiere deadlines for " + user.getFiliere() + ": " + filiereDeadlines.size());
            userDeadlines.addAll(filiereDeadlines);
        }
        
        // Deadlines spécifiques à l'étudiant (supprimé dans le nouveau schéma)
        
        System.out.println("Total deadlines for user: " + userDeadlines.size());
        return userDeadlines;
    }
}
