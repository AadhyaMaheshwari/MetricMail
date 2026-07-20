import React from 'react';

export default function RecipientTable({ recipients }) {
  if (!recipients.length) {
    return (
      <div style={{ border: '1px solid #e4e2db', borderRadius: '12px', padding: '1rem', background: '#fff' }}>
        <p style={{ margin: 0 }}>No recipients uploaded.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #e4e2db', borderRadius: '12px', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f5f4f0' }}>
          <tr>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {recipients.map((recipient) => (
            <tr key={recipient._id || recipient.email}>
              <td style={{ padding: '12px 16px', borderTop: '1px solid #efece6' }}>{recipient.name || '—'}</td>
              <td style={{ padding: '12px 16px', borderTop: '1px solid #efece6' }}>{recipient.email}</td>
              <td style={{ padding: '12px 16px', borderTop: '1px solid #efece6', textTransform: 'capitalize' }}>{recipient.status || 'pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
