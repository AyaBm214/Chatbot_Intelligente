package com.example.backend.controller;

import com.example.backend.model.Question;
import com.example.backend.model.Reponse;
import com.example.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/etudiant/quiz")
public class EtudiantQuizController {
    @Autowired
    private QuestionRepository questionRepository;

    // Obtenir toutes les questions (sans indiquer les bonnes réponses)
    @GetMapping("/questions")
    public List<QuestionDTO> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();
        return questions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Obtenir une question spécifique
    @GetMapping("/questions/{id}")
    public QuestionDTO getQuestion(@PathVariable Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question non trouvée"));
        return convertToDTO(question);
    }

    // Convertir Question en DTO (sans les bonnes réponses)
    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTexte(question.getTexte());
        
        if (question.getReponse() != null) {
            ReponseDTO reponseDTO = new ReponseDTO();
            reponseDTO.setId(question.getReponse().getId());
            reponseDTO.setTexte(question.getReponse().getTexte());
            // On ne met pas correcte = true/false pour les étudiants
            dto.setReponse(reponseDTO);
        }
        
        return dto;
    }

    // Classes DTO pour masquer les bonnes réponses
    public static class QuestionDTO {
        private Long id;
        private String texte;
        private ReponseDTO reponse;

        // Getters et Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTexte() { return texte; }
        public void setTexte(String texte) { this.texte = texte; }
        public ReponseDTO getReponse() { return reponse; }
        public void setReponse(ReponseDTO reponse) { this.reponse = reponse; }
    }

    public static class ReponseDTO {
        private Long id;
        private String texte;

        // Getters et Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTexte() { return texte; }
        public void setTexte(String texte) { this.texte = texte; }
    }
} 