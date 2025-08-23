package com.example.backend.repository;

import com.example.backend.model.Deadline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeadlineRepository extends JpaRepository<Deadline, Long> {
    
    // Trouver les deadlines pour une classe spécifique
    @Query("SELECT d FROM Deadline d WHERE d.classe = :classe")
    List<Deadline> findByClasse(@Param("classe") String classe);
    
    // Trouver les deadlines pour une filière spécifique
    @Query("SELECT d FROM Deadline d WHERE d.filiere = :filiere")
    List<Deadline> findByFiliere(@Param("filiere") String filiere);
    
    // Trouver toutes les deadlines générales (sans classe ni filière)
    @Query("SELECT d FROM Deadline d WHERE d.classe IS NULL AND d.filiere IS NULL")
    List<Deadline> findDeadlinesGenerales();

} 