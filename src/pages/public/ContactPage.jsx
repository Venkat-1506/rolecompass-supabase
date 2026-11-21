import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { ScrollReveal } from '../../components/ui/ScrollReveal.jsx';
import {
  MessageSquare,
  HelpCircle,
  Handshake,
  Send,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  Compass,
  Briefcase,
  Zap,
} from 'lucide-react';
import '../../styles/glass.css';
import '../../styles/motion.css';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });

  const [activeCategory, setActiveCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const departments = [
    {
      id: 'general',
      title: 'General Enquiries',
      desc: 'Platform features, feedback, or general questions',
      email: 'support@rolecompass.demo',
      icon: HelpCircle,
      color: '#059669',
      lightBg: 'rgba(5, 150, 105, 0.08)',
      borderColor: 'rgba(5, 150, 105, 0.25)',
    },
    {
      id: 'candidate',
      title: 'Candidate Support',
      desc: 'Profile matching, resume parsing & skill hub assistance',
      email: 'candidates@rolecompass.demo',
      icon: MessageSquare,
      color: '#0284c7',
      lightBg: 'rgba(2, 132, 199, 0.08)',
      borderColor: 'rgba(2, 132, 199, 0.25)',
    },
    {
      id: 'partnerships',
      title: 'Strategic Partnerships',
      desc: 'University tie-ups, campus drives & enterprise integrations',
      email: 'partnerships@rolecompass.demo',
      icon: Handshake,
      color: '#d97706',
      lightBg: 'rgba(217, 119, 6, 0.08)',
      borderColor: 'rgba(217, 119, 6, 0.25)',
    },
  ];

  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    setFormData((prev) => ({ ...prev, category: id }));
  };

  const handleCopyEmail = (e, email, id) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        category: activeCategory,
        subject: '',
        message: '',
      });
    }, 600);
  };

  const currentDept = departments.find((d) => d.id === activeCategory) || departments[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowX: 'hidden' }}>
      {/* 1. HERO HEADER SECTION */}
      <Section py="8">
        <PageContainer size="lg">
          <div style={{ position: 'relative', textAlign: 'center', padding: '16px 0 8px' }}>
            {/* Ambient Background Aura */}
            <div
              style={{
                position: 'absolute',
                top: '-15%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '540px',
                height: '380px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(56, 189, 248, 0.12) 45%, rgba(255, 255, 255, 0) 75%)',
                filter: 'blur(55px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px', margin: '0 auto' }}>
              <ScrollReveal variant="slide-up">
                {/* Modern Pill Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '18px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#059669',
                      background: 'rgba(236, 253, 245, 0.95)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      padding: '8px 18px',
                      borderRadius: '999px',
                      border: '1px solid rgba(167, 243, 208, 0.9)',
                      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#059669',
                      }}
                      className="rc-animate-pulse"
                    />
                    SUPPORT & INQUIRIES
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    lineHeight: '1.1',
                    fontWeight: '800',
                    color: '#0f172a',
                    letterSpacing: '-0.03em',
                    marginBottom: '16px',
                  }}
                >
                  Let's talk.{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #0284c7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    We're here to guide your pathway.
                  </span>
                </h1>

                <p
                  style={{
                    fontSize: '1.12rem',
                    color: '#475569',
                    maxWidth: '620px',
                    margin: '0 auto 24px',
                    lineHeight: '1.6',
                    fontWeight: '500',
                  }}
                >
                  Have questions about candidate role matching or sample job listings? This local
                  demo does not include live support or enterprise hiring portals.
                </p>

                {/* Trust Badges Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '12px 24px',
                    paddingTop: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.84rem',
                      fontWeight: '600',
                      color: '#059669',
                    }}
                  >
                    <Zap size={16} /> <span>Average Response: &lt; 4 Hours</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.84rem',
                      fontWeight: '600',
                      color: '#0284c7',
                    }}
                  >
                    <ShieldCheck size={16} /> <span>Local Demo Experience</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.84rem',
                      fontWeight: '600',
                      color: '#64748b',
                    }}
                  >
                    <MapPin size={16} /> <span>Bengaluru HQ & Global Operations</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* 2. MAIN 2-COLUMN BALANCED CONTACT HUB */}
      <Section py="2">
        <PageContainer size="lg">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            {/* COLUMN 1: DIRECT MESSAGING FORM CARD */}
            <ScrollReveal variant="slide-left" delay={100}>
              <div
                style={{
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.72)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  borderRadius: '24px',
                  padding: 'clamp(24px, 4vw, 36px)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  boxShadow:
                    '0 20px 48px -12px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
                }}
              >
                {/* Form Header */}
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#059669',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '4px',
                    }}
                  >
                    DIRECT MESSAGING
                  </div>
                  <h2
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '1.75rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      margin: 0,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Send Us a Message
                  </h2>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: '#64748b',
                      marginTop: '6px',
                      lineHeight: '1.5',
                    }}
                  >
                    Select your topic below to direct your message to the appropriate specialist
                    team.
                  </p>
                </div>

                {/* Interactive Category Selector Tabs */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#334155',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    Select Department
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '10px',
                    }}
                  >
                    {departments.map((dept) => {
                      const isSelected = activeCategory === dept.id;
                      const Icon = dept.icon;
                      return (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => handleCategorySelect(dept.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            border: isSelected
                              ? `2px solid ${dept.color}`
                              : '1px solid rgba(203, 213, 225, 0.8)',
                            background: isSelected ? dept.lightBg : 'rgba(255, 255, 255, 0.6)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.18s ease',
                            boxShadow: isSelected ? `0 4px 14px ${dept.color}20` : 'none',
                          }}
                        >
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: isSelected ? '#ffffff' : 'rgba(241, 245, 249, 0.8)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: dept.color,
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: isSelected ? dept.color : '#1e293b',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {dept.title}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {/* Department hint */}
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '0.8rem',
                      color: currentDept.color,
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: currentDept.color,
                      }}
                    />
                    Routing to: {currentDept.email}
                  </div>
                </div>

                {/* Success Banner */}
                {isSubmitted && (
                  <div
                    style={{
                      background: 'rgba(236, 253, 245, 0.95)',
                      border: '1px solid #6ee7b7',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      boxShadow: '0 8px 24px rgba(5, 150, 105, 0.12)',
                    }}
                  >
                    <CheckCircle2
                      size={22}
                      color="#059669"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#065f46' }}>
                        Message Sent Successfully!
                      </div>
                      <p
                        style={{
                          fontSize: '0.85rem',
                          color: '#047857',
                          marginTop: '4px',
                          margin: 0,
                          lineHeight: '1.4',
                        }}
                      >
                        Thank you for contacting RoleCompass. Our {currentDept.title} team will
                        review your inquiry and follow up within 4 business hours.
                      </p>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit}>
                  <Stack gap="4">
                    {/* Name & Email Row */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            color: '#334155',
                            display: 'block',
                            marginBottom: '6px',
                          }}
                        >
                          Your Full Name <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Arjun Verma"
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontSize: '0.92rem',
                            color: '#0f172a',
                            fontWeight: '500',
                            outline: 'none',
                            transition: 'all 0.18s ease',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#059669';
                            e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.12)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#cbd5e1';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            color: '#334155',
                            display: 'block',
                            marginBottom: '6px',
                          }}
                        >
                          Email Address <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@example.com"
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontSize: '0.92rem',
                            color: '#0f172a',
                            fontWeight: '500',
                            outline: 'none',
                            transition: 'all 0.18s ease',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#059669';
                            e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.12)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#cbd5e1';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          color: '#334155',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Subject / Topic
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary of your inquiry..."
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '0.92rem',
                          color: '#0f172a',
                          fontWeight: '500',
                          outline: 'none',
                          transition: 'all 0.18s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#059669';
                          e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.12)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#cbd5e1';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Message Area */}
                    <div>
                      <label
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          color: '#334155',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Message Details <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your inquiry, role requirements, or account issue..."
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '0.92rem',
                          color: '#0f172a',
                          fontWeight: '500',
                          outline: 'none',
                          transition: 'all 0.18s ease',
                          resize: 'vertical',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#059669';
                          e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.12)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#cbd5e1';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Submit Button & Security Note */}
                    <div style={{ paddingTop: '6px' }}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          width: '100%',
                          background: '#059669',
                          color: '#ffffff',
                          fontWeight: '800',
                          fontSize: '0.98rem',
                          padding: '14px 24px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 18px rgba(5, 150, 105, 0.3)',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 6px 22px rgba(5, 150, 105, 0.45)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 18px rgba(5, 150, 105, 0.3)';
                        }}
                      >
                        {isSubmitting ? 'Routing Message...' : 'Send Message'} <Send size={16} />
                      </button>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          marginTop: '12px',
                          fontSize: '0.78rem',
                          color: '#64748b',
                        }}
                      >
                        <ShieldCheck size={14} color="#059669" />
                        <span>
                          256-bit encrypted transmission. We respect your confidentiality.
                        </span>
                      </div>
                    </div>
                  </Stack>
                </form>
              </div>
            </ScrollReveal>

            {/* COLUMN 2: DIRECT CHANNELS & OPERATIONS HUB */}
            <ScrollReveal variant="slide-right" delay={150}>
              <Stack gap="5">
                {/* 2A: DIRECT SPECIALIST CHANNELS */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.72)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    borderRadius: '24px',
                    padding: '24px 28px',
                    border: '1px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 16px 40px -12px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '4px',
                    }}
                  >
                    DIRECT INBOXES
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: '0 0 16px 0',
                    }}
                  >
                    Connect with Specific Teams
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {departments.map((dept) => {
                      const Icon = dept.icon;
                      const isCopied = copiedId === dept.id;
                      return (
                        <div
                          key={dept.id}
                          onClick={() => handleCategorySelect(dept.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            borderRadius: '14px',
                            background:
                              activeCategory === dept.id
                                ? dept.lightBg
                                : 'rgba(248, 250, 252, 0.8)',
                            border:
                              activeCategory === dept.id
                                ? `1.5px solid ${dept.borderColor}`
                                : '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              minWidth: 0,
                            }}
                          >
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: dept.color,
                                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                                flexShrink: 0,
                              }}
                            >
                              <Icon size={18} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '0.88rem',
                                  fontWeight: 700,
                                  color: '#0f172a',
                                  lineHeight: 1.2,
                                }}
                              >
                                {dept.title}
                              </div>
                              <div
                                style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}
                              >
                                {dept.desc}
                              </div>
                            </div>
                          </div>

                          {/* Copy Action Pill */}
                          <button
                            type="button"
                            onClick={(e) => handleCopyEmail(e, dept.email, dept.id)}
                            title={`Copy ${dept.email}`}
                            style={{
                              marginLeft: '8px',
                              flexShrink: 0,
                              background: isCopied ? '#059669' : '#ffffff',
                              color: isCopied ? '#ffffff' : dept.color,
                              border: isCopied ? 'none' : '1px solid rgba(203, 213, 225, 0.8)',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {isCopied ? <Check size={13} /> : <Copy size={13} />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2B: HEADQUARTERS & PLATFORM OPERATIONS */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.72)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    borderRadius: '24px',
                    padding: '24px 28px',
                    border: '1px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 16px 40px -12px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  {/* Status Indicator */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(236, 253, 245, 0.8)',
                      border: '1px solid #a7f3d0',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#059669',
                      marginBottom: '14px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#059669',
                      }}
                      className="rc-animate-pulse"
                    />
                    Support Operations Online
                  </div>

                  <h3
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: '0 0 16px 0',
                    }}
                  >
                    Platform Headquarters
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Location */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#ecfdf5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#059669',
                          flexShrink: 0,
                        }}
                      >
                        <MapPin size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                          RoleCompass Headquarters
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                          Tech District, Bengaluru, Karnataka, India
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#e0f2fe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0284c7',
                          flexShrink: 0,
                        }}
                      >
                        <Phone size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                          Helpline & Demo Desk
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: '#0284c7',
                            fontWeight: 600,
                            marginTop: '2px',
                            fontFamily: 'monospace',
                          }}
                        >
                          +91 80 1234 5678
                        </div>
                      </div>
                    </div>

                    {/* Hours */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#f3e8ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#7c3aed',
                          flexShrink: 0,
                        }}
                      >
                        <Clock size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                          Operational Hours
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                          Monday – Friday: 9:00 AM – 6:00 PM IST
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Stack>
            </ScrollReveal>
          </div>
        </PageContainer>
      </Section>

      {/* 3. QUICK NAVIGATION / EXPLORE NEXT STEPS */}
      <Section py="6">
        <PageContainer size="lg">
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              padding: '32px',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#059669',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                SELF-SERVICE ASSISTANCE
              </div>
              <h3
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: '4px 0 0 0',
                }}
              >
                Looking for Immediate Answers?
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              {/* Card 1 */}
              <Link to="/explore" style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#059669';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(5, 150, 105, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'rgba(5, 150, 105, 0.1)',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <Briefcase size={18} />
                    </div>
                    <h4
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: '0 0 6px 0',
                      }}
                    >
                      Explore Open Jobs
                    </h4>
                    <p
                      style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}
                    >
                      Browse sample roles matched to your local readiness and preferred skills.
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#059669',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      marginTop: '14px',
                    }}
                  >
                    Browse Jobs <ArrowRight size={14} />
                  </div>
                </div>
              </Link>

              {/* Card 2 */}
              <Link to="/roles" style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#0284c7';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(2, 132, 199, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'rgba(2, 132, 199, 0.1)',
                        color: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <Compass size={18} />
                    </div>
                    <h4
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: '0 0 6px 0',
                      }}
                    >
                      Role Benchmarks & Fit
                    </h4>
                    <p
                      style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}
                    >
                      Evaluate readiness scores, high-impact skill gaps, and salary trajectories.
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#0284c7',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      marginTop: '14px',
                    }}
                  >
                    View Roles <ArrowRight size={14} />
                  </div>
                </div>
              </Link>

              {/* Card 3 */}
              <Link to="/how-it-works" style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#7c3aed';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'rgba(124, 58, 237, 0.1)',
                        color: '#7c3aed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <Sparkles size={18} />
                    </div>
                    <h4
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: '0 0 6px 0',
                      }}
                    >
                      Platform Architecture
                    </h4>
                    <p
                      style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}
                    >
                      Learn how transparent algorithmic alignment bridges candidate readiness and
                      hiring.
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#7c3aed',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      marginTop: '14px',
                    }}
                  >
                    How It Works <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
}
