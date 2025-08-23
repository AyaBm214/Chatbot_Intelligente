package com.example.backend.controller;

import com.example.backend.model.Question;
import com.example.backend.model.Reponse;
import com.example.backend.repository.QuestionRepository;
import com.example.backend.repository.ReponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/questions")
public class AdminQuestionController {
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private ReponseRepository reponseRepository;

    // Lister toutes les questions
    @GetMapping
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    // Ajouter une question avec sa réponse
    @PostMapping
    public Question addQuestion(@RequestBody Map<String, Object> requestData) {
        System.out.println("Données reçues: " + requestData);
        
        // Extraire les données avec gestion flexible des noms de champs
        String questionText = extractString(requestData, "texte", "question", "questionText");
        String reponseText = extractString(requestData, "reponseTexte", "reponse", "reponseText", "answer", "answerText");
        Boolean correcte = extractBoolean(requestData, "correcte", "correct", "isCorrect", "isCorrecte");
        
        // Validation des données
        if (questionText == null || questionText.trim().isEmpty()) {
            throw new IllegalArgumentException("Le texte de la question ne peut pas être vide");
        }
        if (reponseText == null || reponseText.trim().isEmpty()) {
            throw new IllegalArgumentException("Le texte de la réponse ne peut pas être vide");
        }
        if (correcte == null) {
            correcte = false; // Valeur par défaut
        }
        
        System.out.println("Données extraites - Question: " + questionText + ", Réponse: " + reponseText + ", Correcte: " + correcte);
        
        Question question = new Question();
        question.setTexte(questionText.trim());
        
        Reponse reponse = new Reponse();
        reponse.setTexte(reponseText.trim());
        reponse.setCorrecte(correcte);
        
        question.setReponse(reponse);
        
        System.out.println("Question à sauvegarder: " + question);
        System.out.println("Réponse à sauvegarder: " + reponse);
        
        return questionRepository.save(question);
    }

    // Modifier une question
    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Map<String, Object> requestData) {
        System.out.println("Données de modification reçues: " + requestData);
        
        // Extraire les données avec gestion flexible des noms de champs
        String questionText = extractString(requestData, "texte", "question", "questionText");
        String reponseText = extractString(requestData, "reponseTexte", "reponse", "reponseText", "answer", "answerText");
        Boolean correcte = extractBoolean(requestData, "correcte", "correct", "isCorrect", "isCorrecte");
        
        // Validation des données
        if (questionText == null || questionText.trim().isEmpty()) {
            throw new IllegalArgumentException("Le texte de la question ne peut pas être vide");
        }
        if (reponseText == null || reponseText.trim().isEmpty()) {
            throw new IllegalArgumentException("Le texte de la réponse ne peut pas être vide");
        }
        if (correcte == null) {
            correcte = false; // Valeur par défaut
        }
        
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        if (optionalQuestion.isEmpty()) return ResponseEntity.notFound().build();
        
        Question question = optionalQuestion.get();
        question.setTexte(questionText.trim());
        
        if (question.getReponse() != null) {
            question.getReponse().setTexte(reponseText.trim());
            question.getReponse().setCorrecte(correcte);
        } else {
            Reponse reponse = new Reponse();
            reponse.setTexte(reponseText.trim());
            reponse.setCorrecte(correcte);
            question.setReponse(reponse);
        }
        
        return ResponseEntity.ok(questionRepository.save(question));
    }

    // Supprimer une question (et sa réponse)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        if (!questionRepository.existsById(id)) return ResponseEntity.notFound().build();
        questionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Méthodes utilitaires pour extraire les données
    private String extractString(Map<String, Object> data, String... keys) {
        for (String key : keys) {
            Object value = data.get(key);
            if (value != null) {
                return value.toString();
            }
        }
        return null;
    }

    private Boolean extractBoolean(Map<String, Object> data, String... keys) {
        for (String key : keys) {
            Object value = data.get(key);
            if (value != null) {
                if (value instanceof Boolean) {
                    return (Boolean) value;
                } else if (value instanceof String) {
                    return Boolean.parseBoolean((String) value);
                } else if (value instanceof Number) {
                    return ((Number) value).intValue() != 0;
                }
            }
        }
        return null;
    }

    // Classe pour recevoir les données de la requête (maintenue pour compatibilité)
    public static class QuestionRequest {
        private String texte;
        private String reponseTexte;
        private boolean correcte;

        // Getters et Setters
        public String getTexte() { return texte; }
        public void setTexte(String texte) { this.texte = texte; }
        public String getReponseTexte() { return reponseTexte; }
        public void setReponseTexte(String reponseTexte) { this.reponseTexte = reponseTexte; }
        public boolean isCorrecte() { return correcte; }
        public void setCorrecte(boolean correcte) { this.correcte = correcte; }
        
        @Override
        public String toString() {
            return "QuestionRequest{texte='" + texte + "', reponseTexte='" + reponseTexte + "', correcte=" + correcte + "}";
        }
    }
} 