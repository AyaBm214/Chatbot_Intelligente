import React from "react";
import "./Footer.css";

export default function Footer({ onChatbotToggle }) {
  const handleChatbotClick = () => {
    onChatbotToggle();
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <button 
            className="chatbot-button"
            onClick={handleChatbotClick}
            title="Ouvrir le chatbot"
          >
            🤖
          </button>
        </div>
        <div className="footer-center">
          <p>&copy; 2024 Plateforme Étudiante. Tous droits réservés.</p>
        </div>
        <div className="footer-right">
          <span className="footer-version">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
