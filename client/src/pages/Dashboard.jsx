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
    <>
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
    </>
  );
}