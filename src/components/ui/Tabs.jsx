import React from 'react';
import { cn } from '../../utils/helpers.js';
import './ui.css';

export function Tabs({
  tabs = [], // [{ id, label, icon, badge }]
  activeTabId,
  onTabChange,
  className = ''
}) {
  return (
    <div
      className={cn('rc-tabs-header', className)}
      role="tablist"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        width: '100%',
        maxWidth: '100%',
        paddingBottom: '6px',
        boxSizing: 'border-box'
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn('rc-tab-item', isActive && 'rc-tab-item-active')}
            style={{
              flexShrink: 0,
              whiteSpace: 'nowrap',
              padding: '8px 14px',
              borderRadius: '10px',
              border: isActive ? '1px solid #059669' : '1px solid rgba(226, 232, 240, 0.9)',
              background: isActive ? '#059669' : 'rgba(255, 255, 255, 0.75)',
              color: isActive ? '#ffffff' : '#475569',
              fontWeight: isActive ? 700 : 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.icon && <span style={{ marginRight: '6px' }}>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span style={{
                marginLeft: '6px',
                fontSize: '0.74rem',
                opacity: isActive ? 0.95 : 0.8,
                background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(241, 245, 249, 0.9)',
                padding: '1px 6px',
                borderRadius: '6px'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
