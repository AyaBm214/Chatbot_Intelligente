import React from "react";
import "./DeadlinesTable.css";

export default function DeadlinesTable() {
  return (
    <div className="deadlines-table">
      <h3>Deadlines</h3>
      <table>
        <tbody>
          <tr>
            <td>Convention</td>
            <td>28/04/2024</td>
          </tr>
          <tr>
            <td>Rapport intermédiaire</td>
            <td>10/05/2024</td>
          </tr>
          <tr>
            <td>Soutenance</td>
            <td>15/05/2024</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
