export const mockSkills = [
  // --- TECH ---
  {
    id: 'react',
    name: 'React.js',
    category: 'Frontend Development',
    description: 'Component-based JavaScript library for building modern user interfaces.',
    learningResourcesCount: 14,
    relatedRoles: ['Frontend Engineer', 'Full Stack Developer', 'UI Developer'],
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES6+)',
    category: 'Core Programming',
    description:
      'The core dynamic scripting language powering web client and node server runtimes.',
    learningResourcesCount: 22,
    relatedRoles: ['Frontend Engineer', 'Full Stack Developer', 'Backend Engineer'],
  },
  {
    id: 'css-design-systems',
    name: 'CSS & Design Systems',
    category: 'UI Engineering',
    description:
      'Mastery of CSS layout systems, Flexbox, Grid, design tokens, and glassmorphic UI principles.',
    learningResourcesCount: 9,
    relatedRoles: ['UI/UX Developer', 'Frontend Engineer', 'Product Designer'],
  },
  {
    id: 'node',
    name: 'Node.js & Express',
    category: 'Backend Development',
    description: 'Asynchronous event-driven JavaScript runtime for server applications and APIs.',
    learningResourcesCount: 11,
    relatedRoles: ['Backend Engineer', 'Full Stack Developer', 'API Architect'],
  },
  {
    id: 'sql',
    name: 'SQL & Relational Databases',
    category: 'Data & Storage',
    description:
      'Data modeling, schema optimization, indexing, and querying using PostgreSQL / MySQL.',
    learningResourcesCount: 16,
    relatedRoles: ['Backend Engineer', 'Data Engineer', 'Full Stack Developer', 'Business Analyst'],
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Core Programming',
    description:
      'Versatile programming language widely used in Data Science, Machine Learning, Automation, and Web Services.',
    learningResourcesCount: 18,
    relatedRoles: ['Data Scientist', 'Data Analyst', 'Backend Engineer', 'ML Engineer'],
  },
  {
    id: 'python-pandas',
    name: 'Pandas & Data Science',
    category: 'Data Analytics',
    description:
      'Data manipulation, ETL pipeline processing, and statistical analysis with Python.',
    learningResourcesCount: 12,
    relatedRoles: ['Data Scientist', 'Data Analyst', 'Data Engineer'],
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning & AI',
    category: 'AI & Machine Learning',
    description:
      'Supervised and unsupervised learning, model training, evaluation metrics, and PyTorch / TensorFlow.',
    learningResourcesCount: 15,
    relatedRoles: ['Machine Learning Engineer', 'AI Specialist', 'Data Scientist'],
  },
  {
    id: 'docker-kubernetes',
    name: 'Docker & Kubernetes',
    category: 'DevOps & Cloud',
    description:
      'Containerization, orchestration, microservice deployment, and cloud infrastructure management.',
    learningResourcesCount: 10,
    relatedRoles: ['DevOps Engineer', 'Cloud Engineer', 'Backend Engineer'],
  },
  {
    id: 'aws-cloud',
    name: 'AWS & Cloud Architecture',
    category: 'Cloud Infrastructure',
    description:
      'Architecting resilient scalable cloud solutions on Amazon Web Services (EC2, S3, Lambda, IAM).',
    learningResourcesCount: 14,
    relatedRoles: ['Cloud Engineer', 'Solutions Architect', 'DevOps Engineer'],
  },

  // --- DESIGN ---
  {
    id: 'figma',
    name: 'Figma & UI Design',
    category: 'Product Design',
    description:
      'Vector interface design, component libraries, auto-layout, and interactive prototyping.',
    learningResourcesCount: 15,
    relatedRoles: ['UI/UX Designer', 'Product Designer', 'Visual Designer'],
  },
  {
    id: 'ux-research',
    name: 'UX Research & Usability Testing',
    category: 'User Experience',
    description:
      'User interviews, persona creation, journey mapping, wireframing, and usability testing methodologies.',
    learningResourcesCount: 11,
    relatedRoles: ['UX Researcher', 'Product Designer', 'Product Manager'],
  },

  // --- BUSINESS & ANALYTICS ---
  {
    id: 'power-bi',
    name: 'Power BI & Data Visualization',
    category: 'Business Intelligence',
    description:
      'Building interactive dashboards, DAX queries, and executive reports for business decision making.',
    learningResourcesCount: 13,
    relatedRoles: ['Business Analyst', 'BI Analyst', 'Data Analyst'],
  },
  {
    id: 'excel',
    name: 'Advanced Excel & Financial Modeling',
    category: 'Business Analytics',
    description:
      'Pivot tables, VLOOKUP/XLOOKUP, macros, and financial modeling for business analysis.',
    learningResourcesCount: 20,
    relatedRoles: ['Financial Analyst', 'Business Analyst', 'Operations Executive'],
  },

  // --- MARKETING ---
  {
    id: 'seo',
    name: 'SEO & Digital Marketing',
    category: 'Marketing',
    description:
      'Search engine optimization, keyword research, link building, and organic traffic growth strategies.',
    learningResourcesCount: 12,
    relatedRoles: ['SEO Specialist', 'Digital Marketing Executive', 'Content Strategist'],
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics & Growth Tracking',
    category: 'Marketing Analytics',
    description:
      'Conversion funnel analysis, user attribution, campaign tracking, and Web Analytics 4.',
    learningResourcesCount: 10,
    relatedRoles: ['Growth Marketer', 'Digital Marketing Executive', 'Product Analyst'],
  },

  // --- SOFT SKILLS / GENERAL ---
  {
    id: 'communication',
    name: 'Professional Communication & Storytelling',
    category: 'Professional Skills',
    description:
      'Clear business writing, executive presentation skills, active listening, and stakeholder management.',
    learningResourcesCount: 16,
    relatedRoles: ['Product Manager', 'Business Analyst', 'Sales Executive', 'All Candidates'],
  },
];

export function getSkillById(id) {
  if (!id) return null;
  const target = String(id).toLowerCase();
  return (
    mockSkills.find(
      (s) =>
        s.id === target ||
        s.id.replace(/-/g, '') === target.replace(/-/g, '') ||
        s.name.toLowerCase().includes(target),
    ) || null
  );
}
