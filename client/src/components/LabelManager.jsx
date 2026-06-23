import { useEffect, useState } from 'react';
import { useLabels } from '../hooks/useLabels';

const LABEL_META = {
  promotions: { emoji: '🏷️', canDelete: true,  permanent: false, protected: false },
  social:     { emoji: '💬', canDelete: true,  permanent: false, protected: false },
  google:     { emoji: '🔵', canDelete: false, permanent: false, protected: false },
  bank:       { emoji: '🏦', canDelete: true, permanent: false, protected: true  },
  otp:        { emoji: '🔑', canDelete: true,  permanent: true,  protected: false },
  jobs:       { emoji: '💼', canDelete: true,  permanent: false, protected: false },
  education:  { emoji: '🎓', canDelete: false, permanent: false, protected: false },
};

const LABEL_NAMES = {
  promotions: 'Promotions',
  social:     'Social',
  google:     'Google',
  bank:       'Bank & Finance',
  otp:        'OTP & Alerts',
  jobs:       'Jobs & Career',
  education:  'Education',
};

export default function LabelManager() {
  const { labels, scanResults, loading, error, setup, scan, apply, deleteLabel, fetchLabels } = useLabels();
  const [setupDone,     setSetupDone]     = useState(false);
  const [scanMax,       setScanMax]       = useState(500);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [statusMsg,     setStatusMsg]     = useState('');

  useEffect(() => { fetchLabels(); }, []);

  async function handleSetup() {
    const result = await setup();
    if (result?.success) {
      setSetupDone(true);
      setStatusMsg('✓ All 7 labels created in your Gmail');
      await fetchLabels();
    }
  }

  async function handleScan() {
    setStatusMsg('Scanning inbox...');
    const result = await scan(scanMax);
    if (result?.success) {
      const total = Object.values(result.summary).reduce((s, v) => s + v.count, 0);
      setStatusMsg(`Found ${total} emails to label across ${scanMax} scanned`);
    }
  }

  async function handleApply() {
    if (!scanResults) return;
    const result = await apply(scanResults);
    if (result?.success) {
      const total = Object.values(result.applied).reduce((s, v) => s + v, 0);
      setStatusMsg(`✓ Applied labels to ${total} emails`);
    }
  }

  async function confirmAndDelete() {
    if (!confirmDelete) return;
    const meta = LABEL_META[confirmDelete];
    const result = await deleteLabel(confirmDelete, meta?.permanent ?? false);
    if (result?.success) {
      setStatusMsg(`✓ ${result.deleted} emails ${meta?.permanent ? 'permanently deleted' : 'moved to trash'}`);
    }
    setConfirmDelete(null);
  }

  return (
    <div style={{ padding: '24px 0', maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Label Manager</h2>
        <button onClick={handleSetup} disabled={loading || setupDone}
          style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer', background: setupDone ? '#e6f4ea' : '#fff' }}>
          {setupDone ? '✓ Labels ready' : 'Set up labels in Gmail'}
        </button>
      </div>

      {/* Status message */}
      {statusMsg && (
        <div style={{ background: '#f0f7ff', border: '1px solid #b3d4f5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#1a3a6b' }}>
          {statusMsg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #f5b3b3', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#6b0000' }}>
          {error}
        </div>
      )}

      {/* Scan bar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#f5f5f5', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: '#555' }}>Scan last</span>
        <select value={scanMax} onChange={e => setScanMax(Number(e.target.value))}
          style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid #ddd', fontSize: 13 }}>
          <option value={200}>200 emails</option>
          <option value={500}>500 emails</option>
          <option value={1000}>1,000 emails</option>
          <option value={2000}>2,000 emails</option>
        </select>
        <button onClick={handleScan} disabled={loading}
          style={{ padding: '7px 16px', borderRadius: 7, border: '1px solid #ccc', cursor: 'pointer', background: '#fff' }}>
          {loading ? 'Working…' : 'Scan inbox'}
        </button>
        {scanResults && (
          <button onClick={handleApply} disabled={loading}
            style={{ padding: '7px 16px', borderRadius: 7, border: '1px solid #4a90d9', color: '#1a5ca8', background: '#f0f7ff', cursor: 'pointer' }}>
            Apply labels
          </button>
        )}
      </div>

      {/* Label rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(LABEL_META).map(([key, meta]) => {
          const gmailLabel = labels.find(l => l.name === LABEL_NAMES[key]);
          const scanCount  = scanResults?.[key]?.count ?? null;

          return (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: '#fff', border: '1px solid #e5e5e5',
              borderRadius: 10, padding: '12px 16px',
            }}>
              <span style={{ fontSize: 22 }}>{meta.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>
                  {LABEL_NAMES[key]}
                  {meta.protected && (
                    <span style={{ marginLeft: 8, fontSize: 11, padding: '2px 8px', borderRadius: 10, background: '#fff8e1', color: '#8a6000' }}>
                      Protected
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {gmailLabel ? `${gmailLabel.messagesTotal ?? 0} total emails` : 'Not set up yet'}
                  {scanCount !== null && (
                    <span style={{ marginLeft: 8, color: '#4a90d9' }}>· {scanCount} to label</span>
                  )}
                </div>
              </div>

              {meta.canDelete && !meta.protected && (
                <button onClick={() => setConfirmDelete(key)} disabled={loading}
                  style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #f5b3b3', color: '#c00', background: '#fff0f0', cursor: 'pointer', fontSize: 12 }}>
                  {meta.permanent ? 'Delete all' : 'Trash all'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, maxWidth: 360, width: '90%' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              {LABEL_META[confirmDelete]?.permanent ? 'Permanently delete' : 'Trash'} all {LABEL_NAMES[confirmDelete]} emails?
            </div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 22, lineHeight: 1.6 }}>
              {LABEL_META[confirmDelete]?.permanent
                ? 'This cannot be undone. Emails will be deleted forever.'
                : 'Emails will move to Trash and auto-delete after 30 days.'}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmDelete(null)}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={confirmAndDelete}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #f5b3b3', color: '#c00', background: '#fff0f0', cursor: 'pointer' }}>
                Yes, {LABEL_META[confirmDelete]?.permanent ? 'delete' : 'trash'} all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}