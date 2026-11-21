import React, { useState, useMemo } from 'react';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { Clock, CheckCircle2, PlayCircle, Bookmark, Calendar, ArrowRight } from 'lucide-react';

export function LearningTimeline({ events = [], roles = [], onReopenResource }) {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Role filter
      if (selectedRoleFilter !== 'ALL') {
        const targetId = selectedRoleFilter.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (
          e.roleId !== targetId &&
          (e.roleTitle || '').toLowerCase() !== selectedRoleFilter.toLowerCase()
        ) {
          return false;
        }
      }

      // Event type filter
      if (selectedTypeFilter !== 'ALL') {
        if (selectedTypeFilter === 'completed' && e.eventType !== 'completed') return false;
        if (
          selectedTypeFilter === 'in_progress' &&
          e.eventType !== 'started' &&
          e.eventType !== 'resumed' &&
          e.eventType !== 'reopened'
        )
          return false;
        if (selectedTypeFilter === 'saved' && e.eventType !== 'saved') return false;
      }

      return true;
    });
  }, [events, selectedRoleFilter, selectedTypeFilter]);

  const formatTimestamp = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  const getEventBadge = (eventType) => {
    switch (eventType) {
      case 'completed':
        return (
          <Badge variant="success" icon={<CheckCircle2 size={12} />}>
            Completed
          </Badge>
        );
      case 'started':
        return (
          <Badge variant="warning" icon={<PlayCircle size={12} />}>
            Started
          </Badge>
        );
      case 'resumed':
        return (
          <Badge variant="info" icon={<PlayCircle size={12} />}>
            Resumed
          </Badge>
        );
      case 'saved':
        return (
          <Badge variant="default" icon={<Bookmark size={12} />}>
            Saved
          </Badge>
        );
      default:
        return <Badge variant="default">{eventType}</Badge>;
    }
  };

  return (
    <div className="rc-candidate-card" style={{ padding: '26px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="#059669" />
            <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
              Role Learning Timeline
            </h3>
          </div>
          <p className="rc-small" style={{ color: '#64748b', margin: '4px 0 0 0' }}>
            Chronological audit log tracking every course, document, and skill milestone completed
            for your target roles.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: '#ffffff',
              color: '#334155',
            }}
          >
            <option value="ALL">All Target Roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.title}>
                {r.title}
              </option>
            ))}
          </select>

          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: '#ffffff',
              color: '#334155',
            }}
          >
            <option value="ALL">All Activity Types</option>
            <option value="completed">Completed Only</option>
            <option value="in_progress">Started / Resumed</option>
            <option value="saved">Saved Only</option>
          </select>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div style={{ position: 'relative', paddingLeft: '14px', marginTop: '14px' }}>
          {/* Vertical Timeline Track */}
          <div
            style={{
              position: 'absolute',
              left: '23px',
              top: '16px',
              bottom: '16px',
              width: '2px',
              background:
                'linear-gradient(180deg, rgba(16, 185, 129, 0.6) 0%, rgba(203, 213, 225, 0.4) 100%)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredEvents.map((evt) => {
              const isCompleted = evt.eventType === 'completed';
              return (
                <div
                  key={evt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    position: 'relative',
                  }}
                >
                  {/* Timeline Node Icon */}
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: isCompleted
                        ? '#059669'
                        : evt.eventType === 'saved'
                          ? '#f59e0b'
                          : '#0284c7',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '6px',
                      boxShadow: '0 0 0 4px #ffffff, 0 0 0 5px rgba(226, 232, 240, 0.8)',
                      zIndex: 2,
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={12} />
                    ) : evt.eventType === 'saved' ? (
                      <Bookmark size={11} />
                    ) : (
                      <PlayCircle size={11} />
                    )}
                  </div>

                  {/* Content Card */}
                  <div
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: isCompleted
                        ? '1px solid rgba(167, 243, 208, 0.9)'
                        : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {getEventBadge(evt.eventType)}
                        <span
                          className="rc-label"
                          style={{ fontSize: '0.74rem', color: '#64748b' }}
                        >
                          Target: <strong>{evt.roleTitle}</strong>
                        </span>
                        {evt.provider && <span className="rc-provider-badge">{evt.provider}</span>}
                        <span
                          className="rc-small"
                          style={{ color: '#94a3b8', fontSize: '0.74rem' }}
                        >
                          <Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />
                          {formatTimestamp(evt.timestamp)}
                        </span>
                      </div>

                      <h4
                        className="rc-label"
                        style={{ margin: '0 0 2px 0', fontSize: '0.94rem', color: '#0f172a' }}
                      >
                        {evt.resourceTitle || evt.description}
                      </h4>
                    </div>

                    {evt.resourceId && onReopenResource && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onReopenResource(evt.resourceId, evt.roleId)}
                        rightIcon={<ArrowRight size={13} />}
                      >
                        Reopen in Viewer
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '36px 16px',
            background: 'rgba(248, 250, 252, 0.7)',
            borderRadius: '12px',
          }}
        >
          <Clock size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
          <h4 className="rc-h4" style={{ margin: 0, color: '#334155' }}>
            No Learning Timeline Events Yet
          </h4>
          <p
            className="rc-small"
            style={{ color: '#64748b', maxWidth: '380px', margin: '4px auto 0 auto' }}
          >
            Start a learning resource from the catalogue above to begin logging learning milestones
            for your target career roles.
          </p>
        </div>
      )}
    </div>
  );
}
