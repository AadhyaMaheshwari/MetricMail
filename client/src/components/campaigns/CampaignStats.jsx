import React from 'react';

const cards = [
  { label: 'Total Campaigns', key: 'totalCampaigns' },
  { label: 'Total Emails Sent', key: 'totalEmailsSent' },
  { label: 'Average Open Rate', key: 'averageOpenRate' },
  { label: 'Total Replies', key: 'totalReplies' },
];

function formatValue(key, value) {
  if (key === 'averageOpenRate') {
    return `${value.toFixed(1)}%`;
  }

  return value.toLocaleString();
}

export default function CampaignStats({ summary }) {
  return (
    <section className="stats-grid">
      {cards.map((card) => (
        <div key={card.key} className="stat-card">
          <div className="stat-value">{formatValue(card.key, summary[card.key])}</div>
          <div className="stat-label">{card.label}</div>
        </div>
      ))}
    </section>
  );
}
