import React from "react";
import "./QuestionsChart.css";

export default function QuestionsChart() {
  // Données fictives
  const data = [
    { mois: "Avr", valeur: 5 },
    { mois: "Fév", valeur: 6 },
    { mois: "Mar", valeur: 7 },
    { mois: "Mai", valeur: 8 },
    { mois: "Juin", valeur: 10 },
    { mois: "Acor", valeur: 12 }
  ];

  return (
    <div className="questions-chart">
      <h3>Statistiques des questions</h3>
      <div className="chart-bars">
        {data.map((d, i) => (
          <div key={i} className="chart-bar">
            <div
              className="bar"
              style={{ height: `${d.valeur * 10}px` }}
              title={d.valeur}
            ></div>
            <span className="bar-label">{d.mois}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
