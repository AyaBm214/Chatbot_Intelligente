package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    List<User> findByRole(String role);
    
    @Query("SELECT DISTINCT u.classe FROM User u WHERE u.classe IS NOT NULL AND u.classe != ''")
    List<String> findDistinctClasses();
    
    @Query("SELECT DISTINCT u.filiere FROM User u WHERE u.filiere IS NOT NULL AND u.filiere != ''")
    List<String> findDistinctFilieres();
    
    @Query("SELECT u FROM User u WHERE u.role = 'etudiant' ORDER BY u.username")
    List<User> findEtudiantsOrderedByName();
} 