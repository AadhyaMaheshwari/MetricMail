import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CampaignStats from '../components/campaigns/CampaignStats';
import CampaignTable from '../components/campaigns/CampaignTable';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Campaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/api/campaigns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const items = response?.data?.campaigns || [];
      setCampaigns(items);
    } catch (error) {
      console.error('Failed to load campaigns', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const summary = {
    totalCampaigns: campaigns.length,
    totalEmailsSent: campaigns.reduce((sum, campaign) => sum + (campaign.sentCount || 0), 0),
    averageOpenRate: campaigns.length
      ? campaigns.reduce((sum, campaign) => sum + ((campaign.openedCount || 0) / Math.max(campaign.totalRecipients || 1, 1)) * 100, 0) / campaigns.length
      : 0,
    totalReplies: campaigns.reduce((sum, campaign) => sum + (campaign.repliedCount || 0), 0),
  };

  return (
    <>
      <header className="topbar" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="greeting">Campaigns</h1>
          <p className="greeting-sub">Manage your campaign list and performance.</p>
        </div>
        <button
          onClick={() => navigate('/campaigns/new')}
          style={{ minWidth: '140px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #2d2d2d', background: '#2d2d2d', color: '#fff', cursor: 'pointer' }}
        >
          New Campaign
        </button>
      </header>

      <CampaignStats summary={summary} />

      {loading ? (
        <div className="gmail-banner" style={{ justifyContent: 'center' }}>
          Loading campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="gmail-banner" style={{ flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
          <p style={{ marginBottom: '12px' }}>No campaigns yet.</p>
          <button onClick={() => navigate('/campaigns/new')} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #2d2d2d', background: '#2d2d2d', color: '#fff', cursor: 'pointer' }}>
            Create Campaign
          </button>
        </div>
      ) : (
        <CampaignTable campaigns={campaigns} />
      )}
    </>
  );
}
