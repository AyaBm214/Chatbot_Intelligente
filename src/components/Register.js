import React, { useState } from 'react';
import authService from '../services/authService';
import './Register.css';

export default function Register({ onRegisterSuccess, onShowLogin }) {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'etudiant',
    classe: '',
    filiere: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (userData.password !== userData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (userData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.register({
        username: userData.username,
        password: userData.password,
        role: userData.role,
        classe: userData.classe,
        filiere: userData.filiere
      });
      
      // Rediriger vers la page de connexion après inscription réussie
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      onRegisterSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>📝 Inscription</h1>
          <p>Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
              placeholder="Choisissez un nom d'utilisateur"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              placeholder="Choisissez un mot de passe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirmez votre mot de passe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rôle</label>
            <select
              id="role"
              name="role"
              value={userData.role}
              onChange={handleChange}
              className="role-select"
            >
              <option value="etudiant">👨‍🎓 Étudiant</option>
              <option value="admin">👨‍💼 Administrateur</option>
            </select>
          </div>

          {userData.role === 'etudiant' && (
            <>
              <div className="form-group">
                <label htmlFor="classe">Classe</label>
                <select
                  id="classe"
                  name="classe"
                  value={userData.classe}
                  onChange={handleChange}
                  required={userData.role === 'etudiant'}
                >
                  <option value="">Sélectionner une classe</option>
                  <option value="1A">1ère année</option>
                  <option value="2A">2ème année</option>
                  <option value="3A">3ème année</option>
                  <option value="4A">4ème année</option>
                  <option value="5A">5ème année</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="filiere">Filière</label>
                <select
                  id="filiere"
                  name="filiere"
                  value={userData.filiere}
                  onChange={handleChange}
                  required={userData.role === 'etudiant'}
                >
                  <option value="">Sélectionner une filière</option>
                  <option value="GL">Génie Logiciel</option>
                  <option value="DS">Data Science</option>
                  <option value="SE">Systèmes Embarqués</option>
                  <option value="TWIN">Twin</option>
                  <option value="SIM">Simulation</option>
                  <option value="SLEAM">SLEAM</option>
                  <option value="NIDS">NIDS</option>
                  <option value="BI">Business Intelligence</option>
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="register-btn"
            disabled={loading}
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <div className="register-footer">
          <p>Déjà un compte ?</p>
          <button 
            className="login-link"
            onClick={onShowLogin}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
} 