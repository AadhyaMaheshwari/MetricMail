import React, { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getInitials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gmailConnected, setGmailConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || '';
    setName(storedName);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/api/gmail/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setGmailConnected(Boolean(data.gmailConnected));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="topbar">
        <div>
          <h1 className="greeting">Profile</h1>
          <p className="greeting-sub">Your account details:</p>
        </div>
      </header>

      <section
        style={{
          background: '#fff',
          border: '1px solid #e4e2db',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#2d2d2d',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 600,
          }}
        >
          {getInitials(name)}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>{name || 'Loading...'}</div>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #efece6' }}>
            <span style={{ color: '#6b6860' }}>Gmail Status: </span>
            <span style={{ fontWeight: 600, color: gmailConnected ? '#059669' : '#dc2626' }}>
              {loading ? '...' : gmailConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
