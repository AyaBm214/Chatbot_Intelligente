package com.example.backend.controller;

import com.example.backend.model.Question;
import com.example.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5005"})
public class PublicQuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    /**
     * Endpoint public pour récupérer toutes les questions FAQ
     * Accessible sans authentification pour le chatbot Python
     */
    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestionsPublic() {
        try {
            List<Question> questions = questionRepository.findAll();
            System.out.println("=== PUBLIC FAQ ENDPOINT ===");
            System.out.println("Nombre de questions trouvées: " + questions.size());
            
            // Log des questions pour debug
            for (Question q : questions) {
                System.out.println("Question ID: " + q.getId() + " - Texte: " + q.getTexte());
                System.out.println("  Réponse: " + (q.getReponse() != null ? q.getReponse().getTexte() : "Aucune"));
            }
            
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des questions publiques: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint de test pour vérifier la connectivité
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Public FAQ endpoint is working!");
    }
}
