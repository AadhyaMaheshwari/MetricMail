import React from 'react';
import CampaignRow from './CampaignRow';

export default function CampaignTable({ campaigns }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid #e4e2db', borderRadius: '12px', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f5f4f0' }}>
          <tr>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Campaign Name</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subject</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recipients</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Created At</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <CampaignRow key={campaign._id} campaign={campaign} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
