import React from "react";
import "./FAQTable.css";

export default function FAQTable() {
  return (
    <div className="faq-table">
      <div className="faq-header">
        <h2>FAQ / Base de connaissances</h2>
        <button className="faq-add-btn">Ajouter une question</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Réponse</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Quelles sont les étapes du stage ?</td>
            <td>Comment valider plan de laoral ?</td>
          </tr>
          <tr>
            <td>Comment valider le plan de travail ?</td>
            <td>Quels sont les critères du rapport ?</td>
          </tr>
          <tr>
            <td>Quels sont les critères du rapport ?</td>
            <td>Valider avec terns</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}