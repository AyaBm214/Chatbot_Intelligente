import React, { useState, useEffect } from "react";
import questionService from "../services/questionService";
import "./FAQManager.css";

export default function FAQManager() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    texte: "",
    reponse: {
      texte: "",
      correcte: true
    }
  });

  // Charger les questions au montage du composant
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionService.getQuestions();
      setQuestions(data);
    } catch (error) {
      setError("Erreur lors du chargement des questions: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReponseChange = (field, value) => {
    setFormData({
      ...formData,
      reponse: {
        ...formData.reponse,
        [field]: field === 'correcte' ? (value === 'true') : value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== DÉBUT SOUMISSION ===');
    console.log('formData:', formData);
    
    // Validation stricte
    if (!formData.texte || !formData.texte.trim()) {
      console.log('❌ Question vide');
      setError("La question ne peut pas être vide");
      return;
    }

    if (!formData.reponse.texte || !formData.reponse.texte.trim()) {
      console.log('❌ Réponse vide');
      setError("La réponse ne peut pas être vide");
      return;
    }

    // Validation de la longueur
    if (formData.texte.trim().length < 3) {
      console.log('❌ Question trop courte');
      setError("La question doit contenir au moins 3 caractères");
      return;
    }

    if (formData.reponse.texte.trim().length < 1) {
      console.log('❌ Réponse trop courte');
      setError("La réponse doit contenir au moins 1 caractère");
      return;
    }

    try {
      console.log('✅ Validation OK, début de l\'envoi');
      setLoading(true);
      setError("");

      // Construction des données avec validation stricte
      const questionData = {
        texte: formData.texte.trim(),
        reponseTexte: formData.reponse.texte.trim(),
        correcte: Boolean(formData.reponse.correcte)
      };

      console.log('=== SOUMISSION ===');
      console.log('formData:', formData);
      console.log('questionData construit:', questionData);
      console.log('JSON stringifié:', JSON.stringify(questionData, null, 2));

      // Validation finale avant envoi
      if (!questionData.reponseTexte || questionData.reponseTexte.length === 0) {
        throw new Error("Le texte de la réponse ne peut pas être vide");
      }

      console.log('🚀 Appel du service...');
      if (editMode) {
        console.log('Mode édition');
        await questionService.updateQuestion(formData.id, questionData);
        setSuccess("Question modifiée avec succès !");
        setError("");
      } else {
        console.log('Mode ajout');
        await questionService.addQuestion(questionData);
        setSuccess("Question ajoutée avec succès !");
        setError("");
      }

      console.log('✅ Service appelé avec succès');
      // Recharger les questions
      await loadQuestions();
      
      // Réinitialiser le formulaire mais le garder ouvert
      resetForm();
      
      // Ne pas fermer le formulaire automatiquement
      // setShowForm(false); // Commenté pour garder le formulaire ouvert
      
    } catch (error) {
      console.error('❌ Erreur lors de la soumission:', error);
      setError("❌ Erreur: " + error.message);
    } finally {
      console.log('🏁 Fin de la soumission');
      setLoading(false);
    }
  };

  const handleEdit = (question) => {
    setFormData({
      id: question.id,
      texte: question.texte,
      reponse: question.reponse || { texte: "", correcte: true }
    });
    setEditMode(true);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
      try {
        await questionService.deleteQuestion(id);
        await loadQuestions();
      } catch (error) {
        setError("Erreur lors de la suppression: " + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      texte: "",
      reponse: {
        texte: "",
        correcte: true
      }
    });
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  const cancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  if (loading && questions.length === 0) {
    return <div className="loading">Chargement des questions...</div>;
  }

  return (
    <div className="faq-manager">
      <div className="faq-header">
        <h2>Gestion des Questions 🧠</h2>
        <button 
          className="add-question-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          ➕ Ajouter une question
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="success-message" style={{ 
          background: '#10b981', 
          color: 'white', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          ✅ {success}
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="question-form-container">
          <form onSubmit={handleSubmit} className="question-form">
            <h3>{editMode ? "Modifier la question" : "Ajouter une nouvelle question"}</h3>
            
            <div className="form-group">
              <label>Question :</label>
              <textarea
                name="texte"
                value={formData.texte}
                onChange={handleInputChange}
                placeholder="Entrez votre question..."
                required
              />
            </div>

            <div className="reponse-section">
              <label>Réponse :</label>
              <div className="reponse-input">
                <input
                  type="text"
                  value={formData.reponse.texte}
                  onChange={(e) => handleReponseChange('texte', e.target.value)}
                  placeholder="Entrez la réponse..."
                  required
                />
                <select
                  value={formData.reponse.correcte.toString()}
                  onChange={(e) => handleReponseChange('correcte', e.target.value)}
                >
                  <option value="false">Incorrecte</option>
                  <option value="true">Correcte</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Enregistrement..." : (editMode ? "Modifier" : "Ajouter")}
              </button>
              <button type="button" onClick={cancelForm} className="cancel-btn">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des questions */}
      <div className="questions-list">
        <h3>Questions existantes ({questions.length})</h3>
        {questions.length === 0 ? (
          <p className="no-questions">Aucune question pour le moment.</p>
        ) : (
          <div className="questions-grid">
            {questions.map((question) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <h4>{question.texte}</h4>
                  <div className="question-actions">
                    <button
                      onClick={() => handleEdit(question)}
                      className="edit-btn"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="delete-btn"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
                <div className="reponse-display">
                  {question.reponse && (
                    <div className={`reponse-item ${question.reponse.correcte ? 'correcte' : 'incorrecte'}`}>
                      <span className="reponse-texte">{question.reponse.texte}</span>
                      <span className="reponse-status">
                        {question.reponse.correcte ? '✅' : '❌'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
