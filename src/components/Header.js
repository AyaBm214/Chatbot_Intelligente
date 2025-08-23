import React from "react";
import authService from "../services/authService";
import "./Header.css";

export default function Header({ onLogout }) {
  const username = authService.getUsername();
  const role = authService.getUserRole();
  const classe = authService.getUserClasse();
  const filiere = authService.getUserFiliere();

  const handleLogout = () => {
    authService.logout();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="header">
      <div className="header-logo">
        <div className="esprit-logo">
          <div className="logo-text">
            <span className="logo-esp">esp</span>
            <span className="logo-rit">rit</span>
          </div>
          <div className="logo-details">
            <span className="logo-tagline">Se former autrement</span>
            <span className="logo-arrow">▶</span>
          </div>
        </div>
      </div>
      <div className="header-user">
        <span className="header-user-icon">👤</span>
        <div className="user-info">
          <span className="username">{username}</span>
          <span className="user-role">
            {role === 'admin' ? '👨‍💼 Admin' : 
             `👨‍🎓 Étudiant ${classe && filiere ? `- ${classe} ${filiere}` : ''}`}
          </span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Déconnexion
        </button>
      </div>
    </header>
  );
}