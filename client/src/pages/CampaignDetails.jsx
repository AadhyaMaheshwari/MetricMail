import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CampaignHeader from '../components/campaign-details/CampaignHeader';
import CampaignInfo from '../components/campaign-details/CampaignInfo';
import RecipientTable from '../components/campaign-details/RecipientTable';
import ActionPanel from '../components/campaign-details/ActionPanel';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function parseCsvRecipients(fileText) {
  const rows = fileText
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);

  if (!rows.length) return [];

  const headers = rows[0]
    .split(',')
    .map((header) => header.trim().toLowerCase());

  const nameIndex = headers.findIndex((header) => header === 'name' || header === 'recipientname');
  const emailIndex = headers.findIndex((header) => header === 'email' || header === 'recipientemail');

  return rows.slice(1).map((row) => {
    const values = row.split(',').map((value) => value.trim());
    return {
      _id: `${values[emailIndex] || 'recipient'}-${Math.random().toString(36).slice(2, 8)}`,
      name: values[nameIndex] || '—',
      email: values[emailIndex] || '',
      status: 'pending',
    };
  }).filter((recipient) => recipient.email);
}

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [campaign, setCampaign] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/api/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const matchedCampaign = (response?.data?.campaigns || []).find((item) => item._id === id);
      if (!matchedCampaign) {
        throw new Error('Campaign not found.');
      }

      setCampaign(matchedCampaign);
      setRecipients([]);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to load campaign details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/api/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const matchedCampaign = (response?.data?.campaigns || []).find((item) => item._id === id);
      if (matchedCampaign) {
        setCampaign(matchedCampaign);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadRecipients = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setUploadSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      await axios.post(`${API}/api/campaigns/${id}/recipients`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fileText = await file.text();
      const parsedRecipients = parseCsvRecipients(fileText);
      setRecipients(parsedRecipients);
      setUploadSuccess('CSV uploaded successfully.');
      event.target.value = '';
      await fetchCampaignDetails();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to upload recipients.');
    } finally {
      setUploading(false);
    }
  };

  const handleSendCampaign = async () => {
    setSending(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/campaigns/${id}/send`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchCampaignDetails();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to send campaign.');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!window.confirm('Delete this campaign?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/api/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/campaigns');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete campaign.');
    }
  };

  if (loading) {
    return (
      <>
        <CampaignHeader campaign={campaign} />
        <div className="gmail-banner" style={{ justifyContent: 'center' }}>Loading campaign details...</div>
      </>
    );
  }

  if (error && !campaign) {
    return (
      <>
        <CampaignHeader campaign={campaign} />
        <div className="gmail-banner" style={{ justifyContent: 'center' }}>{error}</div>
      </>
    );
  }

  return (
    <>
      <CampaignHeader campaign={campaign} />
      {error ? <div className="gmail-banner" style={{ marginBottom: '1rem' }}>{error}</div> : null}
      {uploadSuccess ? <div className="gmail-banner" style={{ marginBottom: '1rem', background: '#e8f6ed', color: '#1f5d3b' }}>{uploadSuccess}</div> : null}
      <CampaignInfo campaign={campaign} />

      <section style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '18px' }}>Recipients</h2>
        </div>
        <RecipientTable recipients={recipients} />
      </section>

      <ActionPanel campaign={campaign} loading={sending} onSend={handleSendCampaign} onUpload={handleUploadClick} uploading={uploading} uploadComplete={Boolean(uploadSuccess)} onDelete={handleDeleteCampaign} />

      <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleUploadRecipients} />
    </>
  );
}
