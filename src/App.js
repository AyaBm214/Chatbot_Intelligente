import React, { useState, useEffect } from "react";
import authService from "./services/authService";
import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import FAQManager from "./components/FAQManager";
import DeadlinesManager from "./components/DeadlinesManager";
import StudentDeadlinesView from "./components/StudentDeadlinesView";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import "./App.css";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowRegister(false);
    // Si c'est un étudiant, afficher directement les deadlines
    if (authService.isEtudiant()) {
      setActiveMenu("Deadlines");
    }
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    // Rediriger vers la page de connexion après inscription
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveMenu("Dashboard");
  };

  const showLoginPage = () => {
    setShowRegister(false);
  };

  const showRegisterPage = () => {
    setShowRegister(true);
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };

  // Si l'utilisateur n'est pas connecté, afficher Login ou Register
  if (!isAuthenticated) {
    return showRegister ? (
      <Register 
        onRegisterSuccess={handleRegisterSuccess}
        onShowLogin={showLoginPage}
      />
    ) : (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onShowRegister={showRegisterPage}
      />
    );
  }

  // Si l'utilisateur est connecté, afficher le dashboard
  return (
    <div className="app-container">
      {authService.isAdmin() && <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />}
      <div className="main-content">
        <Header onLogout={handleLogout} />
        {authService.isAdmin() && (
          <>
            {activeMenu === "Dashboard" && <StatsCards />}
            {activeMenu === "FAQ" && <FAQManager />}
            {activeMenu === "Deadlines" && <DeadlinesManager />}
          </>
        )}
        {authService.isEtudiant() && <StudentDeadlinesView />}
        {/* Tu peux ajouter d'autres vues ici selon le rôle */}
      </div>
      {authService.isEtudiant() && <Footer onChatbotToggle={toggleChatbot} />}
      <Chatbot isOpen={isChatbotOpen} onClose={closeChatbot} />
    </div>
  );
}

export default App;
