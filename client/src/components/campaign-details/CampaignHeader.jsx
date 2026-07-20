import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../campaigns/StatusBadge';

export default function CampaignHeader({ campaign }) {
  const navigate = useNavigate();

  return (
    <header className="topbar" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
      <div>
        <h1 className="greeting">{campaign?.name || 'Campaign Details'}</h1>
        <p className="greeting-sub">Review campaign details and manage recipients.</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button className="topbar-signout" onClick={() => navigate('/campaigns')}>
          Back to Campaigns
        </button>
        <Link to={`/campaigns/${campaign?._id}/analytics`} className="topbar-signout" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          View Analytics
        </Link>
      </div>
    </header>
  );
}
