import React from 'react';
import LabelManager from '../components/LabelManager';
import './Dashboard.css';

export default function Labels() {
  return (
    <div className="dash-root">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">◆</span>
          <span className="logo-text">SoftServe</span>
        </div>

        <nav className="sidebar-nav">
          <a className="nav-item" href="#">
            Dashboard
          </a>

          <a className="nav-item" href="#">
            Overview
          </a>

          <a className="nav-item active" href="#">
            Labels
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
            <h1 className="greeting">Labels</h1>
            <p className="greeting-sub">Manage your Gmail labels and actions.</p>
          </div>
        </header>

        <section className="card">
          <LabelManager />
        </section>
      </main>
    </div>
  );
}
