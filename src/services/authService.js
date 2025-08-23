const API_BASE_URL = 'http://localhost:8080'; // Ajuste selon ton port

class AuthService {
  // Inscription
  async register(userData) {
    try {
      console.log('=== REGISTER ATTEMPT ===');
      console.log('User data:', userData);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          role: userData.role,
          classe: userData.classe,
          filiere: userData.filiere
        }),
      });

      console.log('Register response status:', response.status);
      
      const responseText = await response.text();
      console.log('Register response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      // Essayer de parser le JSON seulement si la réponse n'est pas vide
      if (responseText.trim()) {
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error('Erreur parsing JSON register:', parseError);
          throw new Error('Réponse invalide du serveur: ' + responseText);
        }
      } else {
        // Si la réponse est vide mais le statut est OK, c'est peut-être normal
        return { success: true };
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Connexion
  async login(credentials) {
    try {
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Credentials:', credentials);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      // Essayer de parser le JSON seulement si la réponse n'est pas vide
      let data;
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Erreur parsing JSON:', parseError);
          throw new Error('Réponse invalide du serveur: ' + responseText);
        }
      } else {
        throw new Error('Réponse vide du serveur');
      }
      
      console.log('Parsed data:', data);
      
      // Stockage du token et du rôle
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || 'etudiant');
        localStorage.setItem('username', credentials.username);
        
        // Stocker les informations de classe et filière si disponibles
        if (data.classe) {
          localStorage.setItem('classe', data.classe);
        }
        if (data.filiere) {
          localStorage.setItem('filiere', data.filiere);
        }
      } else {
        throw new Error('Token manquant dans la réponse');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('classe');
    localStorage.removeItem('filiere');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Obtenir le rôle de l'utilisateur
  getUserRole() {
    return localStorage.getItem('role');
  }

  // Obtenir le nom d'utilisateur
  getUsername() {
    return localStorage.getItem('username');
  }

  // Obtenir le token
  getToken() {
    return localStorage.getItem('token');
  }

  // Vérifier si l'utilisateur est admin
  isAdmin() {
    return this.getUserRole() === 'admin';
  }

  // Vérifier si l'utilisateur est étudiant
  isEtudiant() {
    return this.getUserRole() === 'etudiant';
  }

  // Obtenir la classe de l'utilisateur
  getUserClasse() {
    return localStorage.getItem('classe');
  }

  // Obtenir la filière de l'utilisateur
  getUserFiliere() {
    return localStorage.getItem('filiere');
  }
}

export default new AuthService(); 