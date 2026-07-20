import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', subject: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/api/campaigns`,
        {
          name: form.name,
          subject: form.subject,
          body: form.body,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate('/campaigns');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to create campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="topbar" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="greeting">Create Campaign</h1>
          <p className="greeting-sub">Create a new campaign draft and continue from there.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/campaigns')}
          style={{ minWidth: '140px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #2d2d2d', background: '#2d2d2d', color: '#fff', cursor: 'pointer' }}
        >
          View Campaigns
        </button>
      </header>

      <section style={{ background: '#fff', border: '1px solid #e4e2db', borderRadius: '12px', padding: '1.5rem', maxWidth: '720px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Campaign Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d0cbbd', borderRadius: '8px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Subject</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d0cbbd', borderRadius: '8px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Body</label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              required
              rows="8"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d0cbbd', borderRadius: '8px', resize: 'vertical' }}
            />
          </div>

          {message ? (
            <div style={{ color: '#dc2626', fontSize: '14px' }}>{message}</div>
          ) : null}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading} className="topbar-signout" style={{ minWidth: '140px' }}>
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
            <button type="button" onClick={() => navigate('/campaigns')} className="topbar-signout">
              Cancel
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

