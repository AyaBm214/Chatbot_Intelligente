import React from "react";
import "./StatsCards.css";

export default function StatsCards() {
  // Données fictives, à remplacer par des props ou des données dynamiques si besoin
  const stats = [
    { icon: "💬", label: "Total des questions posées", value: 360 },
    { icon: "👥", label: "Nombre d’utilisateurs uniques", value: 42 },
    { icon: "📚", label: "Nombre de FAQ enregistrées", value: 18 },
    { icon: "🧠", label: "Taux de réponse automatique", value: "87%" },
    { icon: "❌", label: "Taux d’échec", value: "13%" },
  ];

  return (
    <div className="stats-cards">
      {stats.map((stat, i) => (
        <div className="stat-card" key={i}>
          <div className="stat-icon" style={{ fontSize: "2rem" }}>{stat.icon}</div>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}