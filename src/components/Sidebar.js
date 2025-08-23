import React from "react";
import authService from "../services/authService";
import "./Sidebar.css";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const isAdmin = authService.isAdmin();
  const isEtudiant = authService.isEtudiant();
  
  const menus = isAdmin ? [
    { label: "Dashboard", icon: "📊" },
    { label: "FAQ", icon: "📚" },
    { label: "Deadlines", icon: "⏰" },
  ] : [
    { label: "Dashboard", icon: "⏰" },
    { label: "FAQ", icon: "📚" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">☰</div>
      <nav>
        <ul>
          {menus.map((menu) => (
            <li
              key={menu.label}
              className={activeMenu === menu.label ? "active" : ""}
              onClick={() => setActiveMenu(menu.label)}
              style={{ cursor: "pointer" }}
            >
              {menu.label} <span role="img" aria-label={menu.label}>{menu.icon}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}