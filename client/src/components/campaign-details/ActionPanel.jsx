import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ActionPanel({ campaign, loading, onSend, onUpload, uploading, uploadComplete, onDelete }) {
  const navigate = useNavigate();
  const hasRecipients = (campaign?.totalRecipients || 0) > 0;
  const canSend = hasRecipients && campaign?.status !== 'completed' && campaign?.status !== 'sending';

  return (
    <section style={{ background: '#fff', border: '1px solid #e4e2db', borderRadius: '12px', padding: '1.25rem' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '0.75rem' }}>Actions</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          className="topbar-signout"
          onClick={onSend}
          disabled={!canSend || loading}
          style={{ minWidth: '140px', opacity: canSend ? 1 : 0.65 }}
        >
          {loading ? 'Sending...' : 'Send Campaign'}
        </button>
        <button className="topbar-signout" onClick={onUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : uploadComplete ? 'CSV Uploaded' : 'Upload CSV'}
        </button>
        <button className="topbar-signout" onClick={() => navigate(`/campaigns/${campaign?._id}/analytics`)}>
          View Analytics
        </button>
        <button
          className="topbar-signout"
          onClick={onDelete}
          style={{ background: '#fff5f5', color: '#c00000', borderColor: '#f5b3b3' }}
        >
          Delete Campaign
        </button>
      </div>
      {!hasRecipients ? (
        <p style={{ marginTop: '0.75rem', color: '#6b6860' }}>Add recipients before sending this campaign.</p>
      ) : null}
    </section>
  );
}
