import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const cards = [
  { title: "Gmail Analytics", path: "/analytics" },
  { title: "Campaigns", path: "/campaigns" },
  { title: "Labels", path: "/labels" },
  { title: "Profile", path: "/profile" },
];

export default function Dashboard() {
  return (
    <div className="dash-root">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">◆</span>
          <span className="logo-text">SoftServe</span>
        </div>

        <nav className="sidebar-nav">
          <a className="nav-item active" href="#">
            Dashboard
          </a>

          <a className="nav-item" href="#">
            Overview
          </a>

          <a className="nav-item" href="#">
            Settings
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-row">
            <div className="avatar">?</div>
            <div className="user-info">
              <div className="user-name">Welcome</div>
              <div className="user-role">Member</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1 className="greeting">Welcome to your workspace</h1>
            <p className="greeting-sub">Choose a section to continue.</p>
          </div>
        </header>

        <section className="stats-grid">
          {cards.map((card) => (
            <Link key={card.path} to={card.path} className="stat-card" style={{ textDecoration: "none" }}>
              <div className="stat-value">{card.title}</div>
              <div className="stat-label">Open {card.title}</div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}