package com.example.backend.dto;

import com.example.backend.model.Deadline;
import java.time.LocalDateTime;

public class DeadlineDTO {
    private Long id;
    private String titre;
    private String description;
    private LocalDateTime dateLimite;
    private String type;
    private String classe;
    private String filiere;
    private String cible;
    private String valeurCible;

    public DeadlineDTO() {}

    public DeadlineDTO(Deadline deadline) {
        this.id = deadline.getId();
        this.titre = deadline.getTitre();
        this.description = deadline.getDescription();
        this.dateLimite = deadline.getDateLimite();
        this.type = deadline.getType();

        
        // Determine classe and filiere based on cible and valeurCible

    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getDateLimite() { return dateLimite; }
    public void setDateLimite(LocalDateTime dateLimite) { this.dateLimite = dateLimite; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getClasse() { return classe; }
    public void setClasse(String classe) { this.classe = classe; }
    
    public String getFiliere() { return filiere; }
    public void setFiliere(String filiere) { this.filiere = filiere; }
    
    public String getCible() { return cible; }
    public void setCible(String cible) { this.cible = cible; }
    
    public String getValeurCible() { return valeurCible; }
    public void setValeurCible(String valeurCible) { this.valeurCible = valeurCible; }
}
