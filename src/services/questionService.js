const API_BASE_URL = 'http://localhost:8080';

class QuestionService {
  // Obtenir le token d'authentification
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log('=== AUTH HEADERS ===');
    console.log('Token présent:', !!token);
    console.log('Token:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (!token) {
      console.error('❌ Aucun token trouvé dans localStorage');
      throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    console.log('Headers construits:', headers);
    return headers;
  }

  // Vérifier l'état de l'authentification
  checkAuthStatus() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('=== AUTH STATUS ===');
    console.log('Token présent:', !!token);
    console.log('Role exact:', role);
    console.log('Role type:', typeof role);
    
    if (!token) {
      console.error('❌ Pas de token');
      throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
    }
    
    // Vérifier le rôle avec différentes variantes (cohérent avec authService)
    const isAdmin = role === 'admin' || role === 'ADMIN' || role === 'Admin';
    console.log('Role est admin?', isAdmin);
    
    if (!isAdmin) {
      console.error('❌ Role non admin:', role);
      throw new Error('Accès refusé. Rôle administrateur requis. Rôle actuel: ' + role);
    }
    
    console.log('✅ Authentification OK');
    return true;
  }

  // Test simple avec données fixes
  async testAPI() {
    try {
      // Vérifier l'authentification d'abord
      if (!this.checkAuthStatus()) {
        return;
      }

      const testData = {
        texte: "Test question simple",
        reponseTexte: "Test réponse",
        correcte: true
      };

      console.log('=== TEST API ===');
      console.log('Headers:', this.getAuthHeaders());
      console.log('Données:', testData);
      console.log('Type de reponseTexte:', typeof testData.reponseTexte);
      console.log('Valeur de reponseTexte:', testData.reponseTexte);
      console.log('Longueur de reponseTexte:', testData.reponseTexte.length);
      console.log('JSON stringifié:', JSON.stringify(testData));

      const response = await fetch(`${API_BASE_URL}/admin/questions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(testData),
      });

      console.log('Status:', response.status);
      console.log('Status text:', response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur réponse:', errorText);
        
        if (response.status === 403) {
          console.error('❌ Accès interdit - token invalide ou expiré');
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Succès:', result);
      return result;
    } catch (error) {
      console.error('Erreur test:', error);
      throw error;
    }
  }

  // Lister toutes les questions (admin)
  async getQuestions() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des questions');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Ajouter une nouvelle question
  async addQuestion(questionData) {
    try {
      // Vérifier l'authentification d'abord
      this.checkAuthStatus();

      console.log('=== ADD QUESTION ===');
      console.log('Données reçues:', questionData);
      console.log('Type de questionData:', typeof questionData);
      console.log('Type de reponseTexte:', typeof questionData.reponseTexte);
      console.log('ReponseTexte:', questionData.reponseTexte);
      
      const jsonString = JSON.stringify(questionData);
      console.log('JSON stringifié:', jsonString);
      
      // Test de parsing pour vérifier si le JSON est valide
      try {
        JSON.parse(jsonString);
        console.log('✅ JSON valide');
      } catch (parseError) {
        console.error('❌ JSON invalide:', parseError);
        throw new Error('JSON invalide: ' + parseError.message);
      }

      const response = await fetch(`${API_BASE_URL}/admin/questions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: jsonString,
      });

      console.log('Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur réponse:', errorText);
        
        if (response.status === 403) {
          console.error('❌ Accès interdit - token invalide ou expiré');
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        
        // Essayer de parser l'erreur comme JSON
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || errorData.error || 'Erreur lors de l\'ajout de la question');
        } catch (parseError) {
          // Si ce n'est pas du JSON, utiliser le texte brut
          throw new Error(errorText || 'Erreur lors de l\'ajout de la question');
        }
      }

      const result = await response.json();
      console.log('Succès:', result);
      return result;
    } catch (error) {
      console.error('Erreur dans addQuestion:', error);
      throw error;
    }
  }

  // Modifier une question
  async updateQuestion(id, questionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification de la question');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Supprimer une question
  async deleteQuestion(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la question');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Ajouter une réponse à une question
  async addReponse(questionId, reponseData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions/${questionId}/reponses`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          texte: reponseData.texte,
          correcte: reponseData.correcte
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout de la réponse');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Supprimer une réponse
  async deleteReponse(reponseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/questions/reponses/${reponseId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la réponse');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default new QuestionService(); 