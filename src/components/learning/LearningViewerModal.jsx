import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Tag } from '../ui/Tag.jsx';
import { Cluster } from '../layout/Cluster.jsx';
import { Stack } from '../layout/Stack.jsx';
import {
  ExternalLink,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  CheckSquare,
  Square,
  Clock,
  Target,
  Sparkles,
  BookOpen,
  FileText,
  AlertCircle,
  ShieldCheck,
  Edit3,
  Save,
  Maximize2
} from 'lucide-react';

export function LearningViewerModal({
  isOpen = false,
  onClose,
  resource = null,
  targetRole = null,
  record = null,
  onToggleComplete,
  onToggleSave,
  onSaveNotes,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace' | 'notes' | 'details'
  const [notes, setNotes] = useState('');
  const [isSavedNotes, setIsSavedNotes] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (record) {
      setNotes(record.notes || '');
      setIsSavedNotes(true);
    } else {
      setNotes('');
    }
    setIframeError(false);
  }, [record, resource]);

  if (!isOpen || !resource) return null;

  const isCompleted = record?.status === 'completed';
  const isSaved = record?.saved === true;
  const roleTitle = targetRole?.title || record?.roleTitle || 'Target Role';

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    setIsSavedNotes(false);
  };

  const handleSaveNotes = () => {
    if (onSaveNotes) {
      onSaveNotes(resource.id, notes);
      setIsSavedNotes(true);
      if (showToast) showToast('success', 'Study notes saved to your learning timeline.');
    }
  };

  const handleOpenExternal = () => {
    if (showToast) showToast('info', `Opening external resource on ${resource.provider}...`);
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a' }}>
            {resource.title}
          </span>
          <span className="rc-provider-badge">
            {resource.provider}
          </span>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Metadata & Controls Bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.7) 0%, rgba(240, 249, 255, 0.6) 100%)',
            border: '1px solid rgba(167, 243, 208, 0.85)',
            borderRadius: '14px',
            padding: '16px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          {/* Left: Role and Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Badge variant="info" icon={<Target size={12} />}>
              Role: {roleTitle}
            </Badge>

            <Badge variant={isCompleted ? 'success' : 'warning'}>
              {isCompleted ? 'Completed for Role' : 'In Progress'}
            </Badge>

            <span className="rc-small" style={{ color: '#64748b', fontSize: '0.78rem' }}>
              <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {resource.duration} • {resource.difficulty} • {resource.type}
            </span>
          </div>

          {/* Right: Interactive Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenExternal}
              rightIcon={<ExternalLink size={14} />}
            >
              Launch on {resource.provider}
            </Button>

            <button
              type="button"
              onClick={() => onToggleComplete && onToggleComplete(resource, !isCompleted)}
              style={{
                background: isCompleted ? '#ecfdf5' : '#ffffff',
                border: isCompleted ? '1px solid #10b981' : '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: isCompleted ? '#059669' : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              {isCompleted ? <CheckSquare size={16} color="#059669" /> : <Square size={16} />}
              {isCompleted ? 'Marked Completed' : 'Mark Complete'}
            </button>

            <button
              type="button"
              onClick={() => onToggleSave && onToggleSave(resource, !isSaved)}
              title={isSaved ? 'Remove from Saved' : 'Save for Later'}
              style={{
                background: isSaved ? '#fef3c7' : '#ffffff',
                border: isSaved ? '1px solid #f59e0b' : '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: isSaved ? '#b45309' : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              {isSaved ? <BookmarkCheck size={16} color="#b45309" /> : <Bookmark size={16} />}
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            style={{
              background: activeTab === 'workspace' ? '#ecfdf5' : 'transparent',
              color: activeTab === 'workspace' ? '#059669' : '#64748b',
              fontWeight: 700,
              fontSize: '0.86rem',
              border: activeTab === 'workspace' ? '1px solid rgba(167, 243, 208, 0.9)' : '1px solid transparent',
              borderRadius: '8px',
              padding: '6px 14px',
              cursor: 'pointer'
            }}
          >
            Learning Workspace & Preview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            style={{
              background: activeTab === 'notes' ? '#ecfdf5' : 'transparent',
              color: activeTab === 'notes' ? '#059669' : '#64748b',
              fontWeight: 700,
              fontSize: '0.86rem',
              border: activeTab === 'notes' ? '1px solid rgba(167, 243, 208, 0.9)' : '1px solid transparent',
              borderRadius: '8px',
              padding: '6px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Study Notes & Checkpoints
            {notes && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#059669' }} />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            style={{
              background: activeTab === 'details' ? '#ecfdf5' : 'transparent',
              color: activeTab === 'details' ? '#059669' : '#64748b',
              fontWeight: 700,
              fontSize: '0.86rem',
              border: activeTab === 'details' ? '1px solid rgba(167, 243, 208, 0.9)' : '1px solid transparent',
              borderRadius: '8px',
              padding: '6px 14px',
              cursor: 'pointer'
            }}
          >
            Target Role Syllabus & Skills
          </button>
        </div>

        {/* Tab 1: Workspace & Preview */}
        {activeTab === 'workspace' && (
          <Stack gap="4">
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                <div>
                  <h4 className="rc-h4" style={{ margin: '0 0 6px 0', color: '#0f172a' }}>
                    {resource.title}
                  </h4>
                  <p className="rc-body" style={{ margin: 0, color: '#475569', fontSize: '0.92rem', lineHeight: '1.5' }}>
                    {resource.description}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleOpenExternal}
                  rightIcon={<Maximize2 size={13} />}
                  style={{ flexShrink: 0 }}
                >
                  Full Page View
                </Button>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span className="rc-label" style={{ fontSize: '0.74rem', color: '#64748b' }}>Skills Covered:</span>
                {(resource.skills || []).map(sk => (
                  <Tag key={sk}>{sk}</Tag>
                ))}
              </div>
            </div>

            {/* In-App Frame / Live Portal Preview */}
            <div
              style={{
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
              }}
            >
              <div
                style={{
                  background: '#0f172a',
                  color: '#f8fafc',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span style={{ marginLeft: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    {resource.url}
                  </span>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Direct Portal <ExternalLink size={12} />
                </a>
              </div>

              {/* Embedding notice banner */}
              <div style={{ background: '#f0fdf4', borderBottom: '1px solid #bbf7d0', padding: '10px 16px', fontSize: '0.78rem', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#166534" />
                  <strong>Verified Learning Partner:</strong> RoleCompass tracks your learning progress, notes, and role timeline in this workspace.
                </span>
                <span style={{ color: '#15803d' }}>
                  Provider: {resource.provider}
                </span>
              </div>

              <div style={{ position: 'relative', width: '100%', height: '480px', background: '#f8fafc' }}>
                <iframe
                  src={resource.url}
                  title={resource.title}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  onError={() => setIframeError(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                />

                {/* Overlaid quick launch bar if external provider restricts iframing */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    zIndex: 10
                  }}
                >
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Study in dedicated full-screen tab:
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenExternal}
                    style={{
                      background: '#10b981',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '5px 14px',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Open Official Page <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>
          </Stack>
        )}

        {/* Tab 2: Study Notes & Checkpoints */}
        {activeTab === 'notes' && (
          <Stack gap="4">
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Edit3 size={18} color="#059669" />
                  <h4 className="rc-h4" style={{ margin: 0, color: '#0f172a' }}>
                    Personal Study Notes & Key Checkpoints
                  </h4>
                </div>
                <span className="rc-small" style={{ color: '#64748b' }}>
                  Associated with {roleTitle}
                </span>
              </div>
              <p className="rc-small" style={{ color: '#475569', margin: 0 }}>
                Write key takeaways, command cheat-sheets, or architecture notes as you work through this module. Your notes are stored locally in RoleCompass.
              </p>
            </div>

            <textarea
              rows={10}
              value={notes}
              onChange={handleNotesChange}
              placeholder="e.g. Mastered indexing syntax, understood difference between WHERE and HAVING, completed practice exercises on SQLBolt..."
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.92rem',
                lineHeight: '1.6',
                fontFamily: 'inherit',
                color: '#0f172a',
                background: '#ffffff',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="rc-small" style={{ color: isSavedNotes ? '#059669' : '#f59e0b', fontWeight: 600 }}>
                {isSavedNotes ? '✓ All notes saved to local timeline' : '• Unsaved note edits'}
              </span>

              <Button
                variant="primary"
                onClick={handleSaveNotes}
                leftIcon={<Save size={15} />}
              >
                Save Study Notes
              </Button>
            </div>
          </Stack>
        )}

        {/* Tab 3: Target Role Syllabus */}
        {activeTab === 'details' && (
          <Stack gap="4">
            <div className="rc-candidate-card" style={{ padding: '20px' }}>
              <h4 className="rc-h4" style={{ margin: '0 0 10px 0', color: '#0f172a' }}>
                Role Alignment: {roleTitle}
              </h4>
              <p className="rc-small" style={{ color: '#475569', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                This resource was explicitly selected to develop core competencies required for <strong>{roleTitle}</strong>.
              </p>

              <Stack gap="2">
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
                  <span className="rc-label" style={{ fontSize: '0.76rem', color: '#64748b' }}>RESOURCE TYPE & DURATION:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {resource.type} • Est. {resource.duration}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
                  <span className="rc-label" style={{ fontSize: '0.76rem', color: '#64748b' }}>OFFICIAL PROVIDER & CANONICAL URL:</span>
                  <div style={{ marginTop: '2px' }}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}
                    >
                      {resource.provider} — {resource.url}
                    </a>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
                  <span className="rc-label" style={{ fontSize: '0.76rem', color: '#64748b' }}>OTHER ROLES STRENGTHENED:</span>
                  <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(resource.roles || []).map(r => (
                      <span key={r} style={{ fontSize: '0.76rem', fontWeight: 600, color: '#334155', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </Stack>
            </div>
          </Stack>
        )}
      </div>
    </Modal>
  );
}
