import React from 'react';
import StatusBadge from '../campaigns/StatusBadge';

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

export default function CampaignInfo({ campaign }) {
  return (
    <section style={{ background: '#fff', border: '1px solid #e4e2db', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Campaign Name</div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>{campaign?.name || '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Subject</div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>{campaign?.subject || '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Status</div>
          <StatusBadge status={campaign?.status} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Created</div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatDate(campaign?.createdAt)}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Recipients</div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>{campaign?.totalRecipients ?? 0}</div>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '12px', color: '#6b6860', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Body</div>
        <div style={{ background: '#f5f4f0', borderRadius: '8px', padding: '12px 14px', whiteSpace: 'pre-wrap', color: '#1a1917' }}>
          {campaign?.body || 'No body provided.'}
        </div>
      </div>
    </section>
  );
}
