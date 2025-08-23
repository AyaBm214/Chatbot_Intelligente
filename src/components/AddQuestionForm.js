import React, { useState } from "react";
import "./AddQuestionForm.css";

export default function AddQuestionForm() {
  const [question, setQuestion] = useState("");
  const [reponse, setReponse] = useState("");
  const [categorie, setCategorie] = useState("Procédure");

  return (
    <div className="add-question-form">
      <h3>Ajouter une Q/R</h3>
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />
      <input
        type="text"
        placeholder="Réponse"
        value={reponse}
        onChange={e => setReponse(e.target.value)}
      />
      <select value={categorie} onChange={e => setCategorie(e.target.value)}>
        <option>Procédure</option>
        <option>Organisation</option>
        <option>Autre</option>
      </select>
      <button>Ajouter</button>
    </div>
  );
}
