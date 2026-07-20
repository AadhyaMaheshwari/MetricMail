import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function formatDate(dateValue) {
  if (!dateValue) return '—';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CampaignRow({ campaign }) {
  return (
    <tr>
      <td>{campaign.name}</td>
      <td>{campaign.subject}</td>
      <td><StatusBadge status={campaign.status} /></td>
      <td>
        {campaign.totalRecipients ? `${campaign.totalRecipients} recipients` : 'No recipients yet'}
      </td>
      <td>{formatDate(campaign.createdAt)}</td>
      <td>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link to={`/campaigns/${campaign._id}`} style={{ padding: '6px 10px', textDecoration: 'none', borderRadius: '8px', minWidth: '90px', textAlign: 'center', background: '#fff', border: '1px solid #e4e2db', color: '#1a1917' }}>
            View Details
          </Link>
          <Link to={`/campaigns/${campaign._id}/analytics`} style={{ padding: '6px 10px', textDecoration: 'none', borderRadius: '8px', minWidth: '100px', textAlign: 'center', background: '#f5f4f0', border: '1px solid #e4e2db', color: '#1a1917' }}>
            Analytics
          </Link>
        </div>
      </td>
    </tr>
  );
}
