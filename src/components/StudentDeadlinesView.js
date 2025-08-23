import React, { useState, useEffect } from "react";
import "./StudentDeadlinesView.css";

export default function StudentDeadlinesView() {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/deadlines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erreur lors du chargement des deadlines");
      const data = await response.json();
      
      // Filtrer les deadlines selon la classe et filière de l'étudiant
      const userClasse = localStorage.getItem("classe");
      const userFiliere = localStorage.getItem("filiere");
      
      let filteredDeadlines = data;
      
      if (userClasse && userFiliere) {
        // Filtrer par classe et filière spécifiques
        filteredDeadlines = data.filter(deadline => 
          deadline.classe === userClasse && deadline.filiere === userFiliere
        );
      } else if (userClasse) {
        // Filtrer seulement par classe
        filteredDeadlines = data.filter(deadline => 
          deadline.classe === userClasse
        );
      } else if (userFiliere) {
        // Filtrer seulement par filière
        filteredDeadlines = data.filter(deadline => 
          deadline.filiere === userFiliere
        );
      }
      
      // Ajouter aussi les deadlines générales (sans classe/filière spécifiées)
      const generalDeadlines = data.filter(deadline => 
        !deadline.classe && !deadline.filiere
      );
      
      setDeadlines([...filteredDeadlines, ...generalDeadlines]);
    } catch (err) {
      setError("❌ " + err.message);
      // Fallback aux données statiques si l'API échoue
      setDeadlines([
        { id: 1, titre: "Convention", dateLimite: "2024-04-28T00:00:00", classe: "3A", filiere: "GL" },
        { id: 2, titre: "Rapport intermédiaire", dateLimite: "2024-05-10T00:00:00", classe: "3A", filiere: "GL" },
        { id: 3, titre: "Soutenance", dateLimite: "2024-05-15T00:00:00", classe: "3A", filiere: "GL" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (dateString) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyClass = (daysRemaining) => {
    if (daysRemaining < 0) return "overdue";
    if (daysRemaining <= 7) return "urgent";
    if (daysRemaining <= 14) return "warning";
    return "normal";
  };

  if (loading) {
    return (
      <div className="student-deadlines-container">
        <div className="loading-spinner">⏳ Chargement des deadlines...</div>
      </div>
    );
  }

  return (
    <div className="student-deadlines-container">
      <div className="deadlines-header">
        <h1>⏰ Mes Deadlines</h1>
        <p>Consultez vos échéances importantes</p>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="deadlines-grid">
        {deadlines.map((deadline) => {
          const daysRemaining = getDaysRemaining(deadline.dateLimite);
          const urgencyClass = getUrgencyClass(daysRemaining);
          
          return (
            <div key={deadline.id} className={`deadline-card ${urgencyClass}`}>
              <div className="deadline-header">
                <h3>{deadline.titre}</h3>
                <span className={`urgency-badge ${urgencyClass}`}>
                  {daysRemaining < 0 ? "En retard" : 
                   daysRemaining === 0 ? "Aujourd'hui" :
                   daysRemaining === 1 ? "Demain" :
                   `${daysRemaining} jours`}
                </span>
              </div>
                             <div className="deadline-date">
                 📅 {formatDate(deadline.dateLimite)}
               </div>
                               <div className="deadline-target">
                  🎯 {deadline.classe && deadline.filiere 
                    ? `${deadline.classe} - ${deadline.filiere}`
                    : deadline.classe 
                      ? deadline.classe
                      : deadline.filiere 
                        ? deadline.filiere
                        : "Toutes les classes et filières"
                  }
                </div>
               {deadline.description && (
                 <div className="deadline-description">
                   {deadline.description}
                 </div>
               )}
            </div>
          );
        })}
      </div>

      {deadlines.length === 0 && !error && (
        <div className="no-deadlines">
          <p>🎉 Aucune deadline pour le moment !</p>
        </div>
      )}
    </div>
  );
}
