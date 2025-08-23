// src/components/DeadlinesManager.js
import React, { useState, useEffect } from "react";
import "./DeadlinesManager.css";

export default function DeadlinesManager() {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    dateLimite: "",
    classe: "",
    filiere: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deadlines, setDeadlines] = useState([]);
  const [editId, setEditId] = useState(null);

  // Récupérer la liste des deadlines au chargement
  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/deadlines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erreur lors du chargement des deadlines");
      const data = await response.json();
      setDeadlines(data);
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette deadline ?')) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/deadlines/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      setSuccess("✅ Deadline supprimée !");
      fetchDeadlines();
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  const handleEdit = (deadline) => {
    setForm({
      titre: deadline.titre,
      description: deadline.description,
      dateLimite: deadline.dateLimite.slice(0, 16), // format pour input datetime-local
      classe: deadline.classe || "",
      filiere: deadline.filiere || "",
    });
    setEditId(deadline.id);
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      let response;
      if (editId) {
        // Edition
        response = await fetch(`http://localhost:8080/deadlines/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Erreur lors de la modification");
        }
        setSuccess("✅ Deadline modifiée !");
      } else {
        // Ajout
        response = await fetch("http://localhost:8080/deadlines", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Erreur lors de l'ajout de la deadline");
        }
        setSuccess("✅ Deadline ajoutée avec succès !");
      }
      setForm({ titre: "", description: "", dateLimite: "", classe: "", filiere: "" });
      setEditId(null);
      fetchDeadlines();
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deadlines-main-layout">
      <div className="deadlines-manager">
        <h2>Ajouter une deadline</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form className="deadline-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre</label>
            <input
              type="text"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date limite</label>
            <input
              type="datetime-local"
              name="dateLimite"
              value={form.dateLimite}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="optional-label">Classe (optionnel)</label>
            <select
              name="classe"
              value={form.classe}
              onChange={handleChange}
            >
              <option value="">Toutes les classes</option>
              <option value="1A">1ère année</option>
              <option value="2A">2ème année</option>
              <option value="3A">3ème année</option>
              <option value="4A">4ème année</option>
              <option value="5A">5ème année</option>
            </select>
          </div>
          <div className="form-group">
            <label className="optional-label">Filière (optionnel)</label>
            <select
              name="filiere"
              value={form.filiere}
              onChange={handleChange}
            >
              <option value="">Toutes les filières</option>
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
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? (editId ? "Modification..." : "Ajout...") : (editId ? "Modifier" : "Ajouter")}
          </button>
          {editId && (
            <button type="button" className="save-btn" style={{background:'#aaa',marginLeft:8}} onClick={() => { setEditId(null); setForm({ titre: "", description: "", dateLimite: "", classe: "", filiere: "" }); }}>Annuler</button>
          )}
        </form>
      </div>
      <div className="deadlines-table">
        <h3>Liste des deadlines</h3>
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Classe</th>
              <th>Filière</th>
              <th>Date limite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deadlines.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#888" }}>
                  Aucune deadline pour le moment.
                </td>
              </tr>
            ) : (
              deadlines.map((d, idx) => (
                <tr key={d.id || idx}>
                  <td>{d.titre}</td>
                  <td>{d.description}</td>
                  <td className={d.classe === "Toutes les classes" ? "general-target" : ""}>{d.classe}</td>
                  <td className={d.filiere === "Toutes les filières" ? "general-target" : ""}>{d.filiere}</td>
                  <td>{new Date(d.dateLimite).toLocaleString("fr-FR")}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(d)}>✏️</button>
                    <button className="delete-btn" onClick={() => handleDelete(d.id)}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}