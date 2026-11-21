import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Grid } from '../../components/layout/Grid.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Tag } from '../../components/ui/Tag.jsx';
import { Toast } from '../../components/ui/Toast.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import {
  Save,
  Briefcase,
  MapPin,
  IndianRupee,
  Laptop,
  Building2,
  Home,
  CheckCircle2,
  Plus,
  Bell,
  Eye,
  Zap,
} from 'lucide-react';
import '../../styles/glass.css';

export function CandidatePreferencesPage() {
  const { candidateUser, updateProfile } = useApp();
  const prefs = candidateUser.careerPreferences || {};

  // Standardize salary default from bloated zeros to LPA notation
  const rawSalary = prefs.targetSalaryRange || '₹12 - ₹18 LPA';
  const initialSalary = rawSalary.includes('000,000') ? '₹12 - ₹18 LPA' : rawSalary;

  const [desiredRoles, setDesiredRoles] = useState(
    prefs.desiredRoles || ['Frontend Engineer', 'Full Stack Developer'],
  );
  const [targetSalary, setTargetSalary] = useState(initialSalary);
  const [preferredLocations, setPreferredLocations] = useState(
    prefs.preferredLocations || ['Bengaluru', 'Hyderabad', 'Remote'],
  );
  const [workModes, setWorkModes] = useState(prefs.workModes || ['Hybrid', 'Remote']);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [newLocInput, setNewLocInput] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  // Notification & Visibility Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [recruiterVisibility, setRecruiterVisibility] = useState(true);
  const [immediateJoiner, setImmediateJoiner] = useState(true);

  const POPULAR_ROLES = [
    'Frontend Engineer',
    'Full Stack Developer',
    'React Developer',
    'Software Engineer',
    'UI/UX Designer',
    'Product Engineer',
    'Data Analyst',
    'DevOps Engineer',
  ];

  const POPULAR_LOCATIONS = [
    'Bengaluru',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Mumbai',
    'Delhi NCR',
    'Remote (India)',
  ];

  const SALARY_BRACKETS = [
    { label: '₹6 - ₹10 LPA', desc: 'Fresher / Junior' },
    { label: '₹10 - ₹15 LPA', desc: 'Early Career (1-3 yrs)' },
    { label: '₹15 - ₹25 LPA', desc: 'Mid-Level (3-5 yrs)' },
    { label: '₹25 - ₹40 LPA', desc: 'Senior (5-8 yrs)' },
    { label: '₹40+ LPA', desc: 'Lead / Principal' },
  ];

  const handleSave = () => {
    updateProfile({
      careerPreferences: {
        desiredRoles,
        targetSalaryRange: targetSalary,
        preferredLocations,
        workModes,
        emailAlerts,
        recruiterVisibility,
        immediateJoiner,
      },
    });
    setToastMsg('Career preferences & job search settings saved successfully!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const addRole = (roleToAdd) => {
    const role = (roleToAdd || newRoleInput).trim();
    if (role && !desiredRoles.includes(role)) {
      setDesiredRoles([...desiredRoles, role]);
      if (!roleToAdd) setNewRoleInput('');
    }
  };

  const removeRole = (roleToRemove) => {
    setDesiredRoles(desiredRoles.filter((r) => r !== roleToRemove));
  };

  const addLocation = (locToAdd) => {
    const loc = (locToAdd || newLocInput).trim();
    if (loc && !preferredLocations.includes(loc)) {
      setPreferredLocations([...preferredLocations, loc]);
      if (!locToAdd) setNewLocInput('');
    }
  };

  const removeLocation = (locToRemove) => {
    setPreferredLocations(preferredLocations.filter((l) => l !== locToRemove));
  };

  const toggleWorkMode = (mode) => {
    if (workModes.includes(mode)) {
      if (workModes.length > 1) {
        setWorkModes(workModes.filter((m) => m !== mode));
      }
    } else {
      setWorkModes([...workModes, mode]);
    }
  };

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="6">
          {/* Unified Candidate Header Banner */}
          <div className="rc-candidate-header-banner">
            <div>
              <span className="rc-candidate-eyebrow">JOB SEARCH PREFERENCES</span>
              <h1 className="rc-candidate-h1">Career Preferences & Settings</h1>
              <p className="rc-candidate-subtitle">
                Set your desired target roles, salary brackets, locations, and work modes to
                personalize your RoleCompass recommendations.
              </p>
            </div>

            <Button variant="primary" size="md" onClick={handleSave} leftIcon={<Save size={18} />}>
              Save Preferences
            </Button>
          </div>

          {toastMsg && (
            <Toast type="success" message={toastMsg} onClose={() => setToastMsg(null)} />
          )}

          <Grid cols="responsive-2" gap="6">
            {/* 1. TARGET CAREER ROLES */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.48)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                boxShadow:
                  '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              }}
            >
              <Stack gap="4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      padding: '8px',
                      background: '#ecfdf5',
                      borderRadius: '10px',
                      color: '#059669',
                    }}
                  >
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.15rem' }}>
                      Target Career Roles
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                      Positions you want RoleCompass matching algorithms to prioritize
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    placeholder="Add target role (e.g. Data Engineer)"
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addRole();
                      }
                    }}
                    style={{ flex: 1 }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => addRole()}
                    leftIcon={<Plus size={16} />}
                  >
                    Add
                  </Button>
                </div>

                {/* Selected Roles */}
                <div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#475569',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Selected Target Roles ({desiredRoles.length}):
                  </span>
                  <Cluster gap="2">
                    {desiredRoles.map((r) => (
                      <Tag key={r} onRemove={() => removeRole(r)}>
                        {r}
                      </Tag>
                    ))}
                  </Cluster>
                </div>

                {/* Popular Quick Suggestions */}
                <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Suggested Roles (click to add):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {POPULAR_ROLES.filter((r) => !desiredRoles.includes(r)).map((pr) => (
                      <button
                        key={pr}
                        type="button"
                        onClick={() => addRole(pr)}
                        style={{
                          background: 'rgba(241, 245, 249, 0.8)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: '#334155',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#ecfdf5';
                          e.currentTarget.style.borderColor = '#a7f3d0';
                          e.currentTarget.style.color = '#059669';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(241, 245, 249, 0.8)';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.color = '#334155';
                        }}
                      >
                        <Plus size={12} /> {pr}
                      </button>
                    ))}
                  </div>
                </div>
              </Stack>
            </div>

            {/* 2. PREFERRED LOCATIONS */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.48)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                boxShadow:
                  '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              }}
            >
              <Stack gap="4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      padding: '8px',
                      background: '#ecfdf5',
                      borderRadius: '10px',
                      color: '#059669',
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.15rem' }}>
                      Preferred Locations
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                      Cities and regions where you wish to work or relocate
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    placeholder="Add location (e.g. Coimbatore)"
                    value={newLocInput}
                    onChange={(e) => setNewLocInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocation();
                      }
                    }}
                    style={{ flex: 1 }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => addLocation()}
                    leftIcon={<Plus size={16} />}
                  >
                    Add
                  </Button>
                </div>

                {/* Selected Locations */}
                <div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#475569',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Selected Locations ({preferredLocations.length}):
                  </span>
                  <Cluster gap="2">
                    {preferredLocations.map((loc) => (
                      <Tag key={loc} onRemove={() => removeLocation(loc)}>
                        {loc}
                      </Tag>
                    ))}
                  </Cluster>
                </div>

                {/* Top Hiring Hubs */}
                <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Top Tech Hubs (click to add):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {POPULAR_LOCATIONS.filter((l) => !preferredLocations.includes(l)).map((pl) => (
                      <button
                        key={pl}
                        type="button"
                        onClick={() => addLocation(pl)}
                        style={{
                          background: 'rgba(241, 245, 249, 0.8)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: '#334155',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#ecfdf5';
                          e.currentTarget.style.borderColor = '#a7f3d0';
                          e.currentTarget.style.color = '#059669';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(241, 245, 249, 0.8)';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.color = '#334155';
                        }}
                      >
                        <Plus size={12} /> {pl}
                      </button>
                    ))}
                  </div>
                </div>
              </Stack>
            </div>

            {/* 3. TARGET SALARY EXPECTATION */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.48)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                boxShadow:
                  '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              }}
            >
              <Stack gap="4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      padding: '8px',
                      background: '#ecfdf5',
                      borderRadius: '10px',
                      color: '#059669',
                    }}
                  >
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.15rem' }}>
                      Target Salary Expectation
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                      Set your expected annual CTC bracket for competitive job matching
                    </p>
                  </div>
                </div>

                <Input
                  label="Target Annual CTC Range"
                  value={targetSalary}
                  onChange={(e) => setTargetSalary(e.target.value)}
                  placeholder="e.g. ₹12 - ₹18 LPA"
                />

                {/* Quick Salary Bracket Buttons */}
                <div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '8px',
                      display: 'block',
                    }}
                  >
                    Standard Salary Brackets (click to apply):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SALARY_BRACKETS.map((sb) => {
                      const isSelected = targetSalary === sb.label;
                      return (
                        <button
                          key={sb.label}
                          type="button"
                          onClick={() => setTargetSalary(sb.label)}
                          style={{
                            background: isSelected ? '#ecfdf5' : '#ffffff',
                            border: isSelected ? '1px solid #059669' : '1px solid #cbd5e1',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            fontSize: '0.82rem',
                            fontWeight: isSelected ? 800 : 600,
                            color: isSelected ? '#047857' : '#334155',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '2px',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 0 0 2px rgba(5, 150, 105, 0.2)' : 'none',
                          }}
                        >
                          <span>{sb.label}</span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: isSelected ? '#059669' : '#94a3b8',
                            }}
                          >
                            {sb.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(248, 250, 252, 0.9)',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.8rem',
                    color: '#475569',
                  }}
                >
                  💡 <strong>Tip:</strong> A realistic market CTC range helps refine local role
                  suggestions. It does not affect real invitations or employer decisions.
                </div>
              </Stack>
            </div>

            {/* 4. WORK MODES */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.48)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                boxShadow:
                  '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              }}
            >
              <Stack gap="4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      padding: '8px',
                      background: '#ecfdf5',
                      borderRadius: '10px',
                      color: '#059669',
                    }}
                  >
                    <Laptop size={20} />
                  </div>
                  <div>
                    <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.15rem' }}>
                      Work Mode Preferences
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                      Select all workplace environments you are comfortable with
                    </p>
                  </div>
                </div>

                {/* Modern Glass Selection Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    {
                      id: 'Remote',
                      icon: <Home size={18} />,
                      title: '100% Remote',
                      desc: 'Work flexibly from anywhere in India with periodic virtual syncs',
                    },
                    {
                      id: 'Hybrid',
                      icon: <Laptop size={18} />,
                      title: 'Hybrid Model',
                      desc: 'Balanced split between office (2-3 days/week) and remote work',
                    },
                    {
                      id: 'On-Site',
                      icon: <Building2 size={18} />,
                      title: 'Full-Time On-Site',
                      desc: 'Work on-location at the employer corporate office or technology center',
                    },
                  ].map((mode) => {
                    const isSelected = workModes.includes(mode.id);
                    return (
                      <div
                        key={mode.id}
                        onClick={() => toggleWorkMode(mode.id)}
                        style={{
                          background: isSelected ? 'rgba(236, 253, 245, 0.85)' : '#ffffff',
                          border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                          borderRadius: '14px',
                          padding: '14px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                          boxShadow: isSelected
                            ? '0 4px 16px rgba(5, 150, 105, 0.12)'
                            : '0 2px 6px rgba(15, 23, 42, 0.02)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div
                            style={{
                              padding: '10px',
                              background: isSelected ? '#059669' : '#f1f5f9',
                              color: isSelected ? '#ffffff' : '#64748b',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.18s ease',
                            }}
                          >
                            {mode.icon}
                          </div>
                          <div>
                            <h4
                              style={{
                                fontSize: '0.94rem',
                                fontWeight: 800,
                                color: '#0f172a',
                                margin: 0,
                              }}
                            >
                              {mode.title}
                            </h4>
                            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                              {mode.desc}
                            </p>
                          </div>
                        </div>

                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            border: isSelected ? '2px solid #059669' : '2px solid #cbd5e1',
                            background: isSelected ? '#059669' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            flexShrink: 0,
                          }}
                        >
                          {isSelected && <CheckCircle2 size={16} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Stack>
            </div>
          </Grid>

          {/* 5. PRIVACY & JOB ALERTS ROW */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              borderRadius: '20px',
              padding: '24px 28px',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow:
                '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
            }}
          >
            <Stack gap="4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    padding: '8px',
                    background: '#ecfdf5',
                    borderRadius: '10px',
                    color: '#059669',
                  }}
                >
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.15rem' }}>
                    Job Alert & Privacy Preferences
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                    Demo settings stored locally. No emails or employer visibility are active.
                  </p>
                </div>
              </div>

              <Grid cols="responsive-3" gap="4">
                {/* Alert 1 */}
                <div
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  style={{
                    background: emailAlerts ? '#ecfdf5' : '#ffffff',
                    border: emailAlerts ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ color: emailAlerts ? '#059669' : '#94a3b8', marginTop: '2px' }}>
                    <Bell size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', margin: 0 }}
                    >
                      Job Alert Preference
                    </h4>
                    <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '4px 0 0' }}>
                      Stored locally in this demo. No email notifications are sent.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={() => {}}
                    style={{ accentColor: '#059669', width: '16px', height: '16px' }}
                  />
                </div>

                {/* Alert 2 */}
                <div
                  onClick={() => setRecruiterVisibility(!recruiterVisibility)}
                  style={{
                    background: recruiterVisibility ? '#ecfdf5' : '#ffffff',
                    border: recruiterVisibility ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{ color: recruiterVisibility ? '#059669' : '#94a3b8', marginTop: '2px' }}
                  >
                    <Eye size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', margin: 0 }}
                    >
                      Profile Visibility
                    </h4>
                    <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '4px 0 0' }}>
                      Local demo preference only. No employer can view this profile.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={recruiterVisibility}
                    onChange={() => {}}
                    style={{ accentColor: '#059669', width: '16px', height: '16px' }}
                  />
                </div>

                {/* Alert 3 */}
                <div
                  onClick={() => setImmediateJoiner(!immediateJoiner)}
                  style={{
                    background: immediateJoiner ? '#ecfdf5' : '#ffffff',
                    border: immediateJoiner ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ color: immediateJoiner ? '#059669' : '#94a3b8', marginTop: '2px' }}>
                    <Zap size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', margin: 0 }}
                    >
                      Availability Signal
                    </h4>
                    <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '4px 0 0' }}>
                      Local demo preference for your own reference. Nothing is shared.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={immediateJoiner}
                    onChange={() => {}}
                    style={{ accentColor: '#059669', width: '16px', height: '16px' }}
                  />
                </div>
              </Grid>
            </Stack>
          </div>

          {/* Bottom Save Action Bar */}
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px' }}
          >
            <Button variant="primary" size="lg" onClick={handleSave} leftIcon={<Save size={18} />}>
              Save Preferences
            </Button>
          </div>
        </Stack>
      </PageContainer>
    </Section>
  );
}
