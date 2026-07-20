import React from 'react';
import LabelManager from '../components/LabelManager';
import './Dashboard.css';

export default function Labels() {
  return (
    <>
      <header className="topbar">
        <div>
          <h1 className="greeting">Labels</h1>
          <p className="greeting-sub">Manage your Gmail labels and actions.</p>
        </div>
      </header>

      <section className="card">
        <LabelManager />
      </section>
    </>
  );
}
