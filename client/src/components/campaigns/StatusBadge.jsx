import React from 'react';

const badgeStyles = {
  draft: { background: '#f3f4f6', color: '#6b7280' },
  sending: { background: '#eff6ff', color: '#2563eb' },
  completed: { background: '#ecfdf5', color: '#059669' },
  failed: { background: '#fef2f2', color: '#dc2626' },
};

export default function StatusBadge({ status }) {
  const normalized = (status || 'draft').toLowerCase();
  const style = badgeStyles[normalized] || badgeStyles.draft;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'capitalize',
        ...style,
      }}
    >
      {normalized}
    </span>
  );
}
