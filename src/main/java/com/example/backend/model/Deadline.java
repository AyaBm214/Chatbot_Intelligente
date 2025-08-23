package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deadline")
public class Deadline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titre")
    private String titre;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "date_limite")
    private LocalDateTime dateLimite;
    
    @Column(name = "type")
    private String type;
    
    // legacy columns removed in DB migration: cible, valeur_cible

    // New persisted columns to align with form
    @Column(name = "classe")
    private String classe;

    @Column(name = "filiere")
    private String filiere;

    // Getters et setters
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
    // removed legacy getters/setters

    // Derived properties for frontend compatibility (not persisted)

    // Getters/Setters for new columns
    public String getClasse() { return classe; }
    public void setClasse(String classe) { this.classe = classe; }
    public String getFiliere() { return filiere; }
    public void setFiliere(String filiere) { this.filiere = filiere; }
} 