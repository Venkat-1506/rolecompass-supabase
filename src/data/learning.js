/**
 * RoleCompass Career Learning Catalog & Verified Resource Index
 * Connects career skills and target roles directly to genuine online learning platforms:
 * MDN Web Docs, freeCodeCamp, W3Schools, Python.org, SQLBolt, Kaggle Learn,
 * Microsoft Learn, AWS Skill Builder, GitHub Skills, Cisco NetAcad, and official documentation.
 */

export const verifiedLearningResources = [
  // --- FRONTEND & JAVASCRIPT ---
  {
    id: 'res-react-quickstart',
    title: 'React Official Docs — Quick Start & Thinking in React',
    provider: 'React.dev',
    url: 'https://react.dev/learn',
    description:
      'Official guide covering React 19 component composition, JSX, state management, and declarative UI patterns.',
    skills: ['React.js', 'React', 'Frontend Development'],
    roles: ['Frontend Engineer', 'Full Stack Engineer', 'UI Developer'],
    type: 'Documentation',
    difficulty: 'Beginner',
    isFree: true,
    duration: '45 min',
    isExternal: true,
  },
  {
    id: 'res-react-hooks',
    title: 'Mastering React Hooks & Custom Logic Reusability',
    provider: 'React.dev',
    url: 'https://react.dev/learn/reusing-logic-with-custom-hooks',
    description:
      'Deep dive into building custom hooks, managing lifecycle side-effects with useEffect, and optimizing render performance.',
    skills: ['React.js', 'React', 'Web Performance'],
    roles: ['Frontend Engineer', 'Full Stack Engineer'],
    type: 'Guide',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '50 min',
    isExternal: true,
  },
  {
    id: 'res-fcc-frontend-libs',
    title: 'freeCodeCamp — Front End Development Libraries Certification',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
    description:
      'Comprehensive hands-on certification curriculum covering React, Redux state management, and modern component design.',
    skills: ['React.js', 'State Management', 'JavaScript (ES6+)'],
    roles: ['Frontend Engineer', 'Full Stack Engineer'],
    type: 'Course',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '3 hours',
    isExternal: true,
  },
  {
    id: 'res-mdn-js-guide',
    title: 'MDN Web Docs — Complete JavaScript Guide & ES6+ Features',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    description:
      'The authoritative JavaScript language guide covering closures, prototype inheritance, arrow functions, and ES modules.',
    skills: ['JavaScript (ES6+)', 'JavaScript', 'Core Programming'],
    roles: ['Frontend Engineer', 'Full Stack Engineer', 'Backend Cloud Engineer'],
    type: 'Documentation',
    difficulty: 'Beginner',
    isFree: true,
    duration: '1 hour',
    isExternal: true,
  },
  {
    id: 'res-mdn-async-js',
    title: 'MDN Web Docs — Asynchronous JavaScript, Promises & Event Loop',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises',
    description:
      'Hands-on tutorials on promise chaining, async/await syntax, fetch API integration, and error propagation.',
    skills: ['JavaScript (ES6+)', 'REST APIs', 'Async Programming'],
    roles: ['Frontend Engineer', 'Full Stack Engineer', 'Backend Cloud Engineer'],
    type: 'Interactive',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '40 min',
    isExternal: true,
  },
  {
    id: 'res-mdn-css-grid',
    title: 'MDN Web Docs — CSS Grid & Modern Responsive Layouts',
    provider: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids',
    description:
      'Learn two-dimensional CSS Grid layouts, track sizing, template areas, and mobile-first responsive architecture.',
    skills: ['CSS & Design Systems', 'CSS', 'UI Engineering'],
    roles: ['Frontend Engineer', 'UI/UX Product Designer', 'UI Developer'],
    type: 'Documentation',
    difficulty: 'Beginner',
    isFree: true,
    duration: '35 min',
    isExternal: true,
  },
  {
    id: 'res-web-vitals',
    title: 'web.dev — Optimizing Core Web Vitals (LCP, INP, CLS)',
    provider: 'Google web.dev',
    url: 'https://web.dev/explore/fast',
    description:
      'Industry standard guide on optimizing page load velocity, JavaScript bundle tree-shaking, and interaction latency.',
    skills: ['Web Performance', 'Frontend Development'],
    roles: ['Frontend Engineer', 'Full Stack Engineer'],
    type: 'Guide',
    difficulty: 'Advanced',
    isFree: true,
    duration: '50 min',
    isExternal: true,
  },

  // --- BACKEND & APIS ---
  {
    id: 'res-node-intro',
    title: 'Node.js Official Getting Started & Architecture Guide',
    provider: 'Nodejs.org',
    url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
    description:
      'Understanding the asynchronous V8 JavaScript runtime, event loop, non-blocking I/O, and npm ecosystem.',
    skills: ['Node.js & Express', 'Node.js', 'Backend Development'],
    roles: ['Backend Cloud Engineer', 'Full Stack Engineer'],
    type: 'Documentation',
    difficulty: 'Beginner',
    isFree: true,
    duration: '45 min',
    isExternal: true,
  },
  {
    id: 'res-express-routing',
    title: 'Express.js Routing, Middleware & API Security',
    provider: 'Expressjs.com',
    url: 'https://expressjs.com/en/starter/basic-routing.html',
    description:
      'How to structure production REST microservices, write custom authentication middleware, and handle JSON payloads.',
    skills: ['Node.js & Express', 'REST APIs', 'Backend Development'],
    roles: ['Backend Cloud Engineer', 'Full Stack Engineer'],
    type: 'Documentation',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '40 min',
    isExternal: true,
  },
  {
    id: 'res-fcc-backend-apis',
    title: 'freeCodeCamp — Back End Development and APIs Certification',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
    description:
      'Interactive projects building microservices, REST APIs, MongoDB models, and secure header verification.',
    skills: ['Node.js & Express', 'REST APIs', 'SQL & Databases'],
    roles: ['Backend Cloud Engineer', 'Full Stack Engineer'],
    type: 'Course',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '2.5 hours',
    isExternal: true,
  },

  // --- SQL, DATA & DATABASES ---
  {
    id: 'res-sqlbolt-interactive',
    title: 'SQLBolt — Interactive Relational Database Tutorials',
    provider: 'SQLBolt',
    url: 'https://sqlbolt.com/lesson/introduction',
    description:
      'Interactive in-browser lessons on SQL SELECT, WHERE filtering, INNER/OUTER JOINs, aggregates, and table constraints.',
    skills: ['SQL & Relational Databases', 'SQL & Databases', 'Data Analytics'],
    roles: [
      'Data Analyst',
      'Data Scientist & AI Engineer',
      'Backend Cloud Engineer',
      'Full Stack Engineer',
    ],
    type: 'Interactive',
    difficulty: 'Beginner',
    isFree: true,
    duration: '1 hour',
    isExternal: true,
  },
  {
    id: 'res-postgres-tutorial',
    title: 'PostgreSQL Official Documentation & Query Optimization',
    provider: 'PostgreSQL Docs',
    url: 'https://www.postgresql.org/docs/current/tutorial.html',
    description:
      'Authoritative tutorial on advanced PostgreSQL schemas, foreign key integrity, index optimization, and transaction ACIDity.',
    skills: ['SQL & Relational Databases', 'Distributed Systems'],
    roles: ['Backend Cloud Engineer', 'Data Analyst', 'FinTech & Payments Systems Engineer'],
    type: 'Documentation',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '50 min',
    isExternal: true,
  },
  {
    id: 'res-kaggle-pandas',
    title: 'Kaggle Learn — Pandas Data Manipulation & Cleaning',
    provider: 'Kaggle Learn',
    url: 'https://www.kaggle.com/learn/pandas',
    description:
      'Hands-on data exploration exercises covering DataFrames, indexing, grouped aggregations, missing value imputation, and reshaping.',
    skills: ['Python / R', 'Pandas & Data Science', 'Data Analytics'],
    roles: ['Data Analyst', 'Data Scientist & AI Engineer'],
    type: 'Interactive',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '1.5 hours',
    isExternal: true,
  },
  {
    id: 'res-kaggle-intro-ml',
    title: 'Kaggle Learn — Introduction to Machine Learning',
    provider: 'Kaggle Learn',
    url: 'https://www.kaggle.com/learn/intro-to-machine-learning',
    description:
      'Build your first ML decision trees, random forests, and model validation pipelines with scikit-learn on real datasets.',
    skills: ['Machine Learning', 'Python & PyTorch', 'Data Science'],
    roles: ['Data Scientist & AI Engineer', 'AI & Deep Learning Systems Engineer'],
    type: 'Interactive',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '2 hours',
    isExternal: true,
  },
  {
    id: 'res-mslearn-powerbi',
    title: 'Microsoft Learn — Create & Use Power BI Analytics Dashboards',
    provider: 'Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/training/paths/create-use-analytics-reports-power-bi/',
    description:
      'Official path for business intelligence analysts: connecting disparate data sources, writing DAX expressions, and building executive dashboards.',
    skills: ['Data Visualization', 'Power BI', 'Data Analytics'],
    roles: ['Data Analyst', 'Product Manager'],
    type: 'Course',
    difficulty: 'Beginner',
    isFree: true,
    duration: '1.5 hours',
    isExternal: true,
  },

  // --- PYTHON & AI ---
  {
    id: 'res-python-official',
    title: 'Python 3 Official Tutorial — Language Reference & Modules',
    provider: 'Python.org',
    url: 'https://docs.python.org/3/tutorial/',
    description:
      'Comprehensive official Python guide covering data structures, object-oriented classes, list comprehensions, and virtual environments.',
    skills: ['Python', 'Python & PyTorch', 'Core Programming'],
    roles: ['Data Scientist & AI Engineer', 'Data Analyst', 'Backend Cloud Engineer'],
    type: 'Documentation',
    difficulty: 'Beginner',
    isFree: true,
    duration: '1.5 hours',
    isExternal: true,
  },
  {
    id: 'res-pytorch-blitz',
    title: 'PyTorch Official 60-Minute Blitz & Neural Networks',
    provider: 'PyTorch.org',
    url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html',
    description:
      'Learn Tensor operations on GPU, autograd automatic differentiation, and training your first convolutional neural network.',
    skills: ['Python & PyTorch', 'Machine Learning', 'GPU Architecture'],
    roles: ['Data Scientist & AI Engineer', 'AI & Deep Learning Systems Engineer'],
    type: 'Interactive',
    difficulty: 'Advanced',
    isFree: true,
    duration: '1 hour',
    isExternal: true,
  },

  // --- CLOUD, DEVOPS & INFRASTRUCTURE ---
  {
    id: 'res-docker-curriculum',
    title: 'Docker Get Started — Containerization Fundamentals',
    provider: 'Docker Docs',
    url: 'https://docs.docker.com/get-started/',
    description:
      'Hands-on guide to containerizing microservices, writing Dockerfiles, managing multi-container Compose setups, and volume caching.',
    skills: ['Docker & Kubernetes', 'CI/CD Pipelines', 'DevOps'],
    roles: [
      'DevOps & Cloud Engineer',
      'Backend Cloud Engineer',
      'Cloud Network & 5G Infrastructure Engineer',
    ],
    type: 'Documentation',
    difficulty: 'Beginner',
    isFree: true,
    duration: '50 min',
    isExternal: true,
  },
  {
    id: 'res-kubernetes-basics',
    title: 'Kubernetes Official Interactive Basics & Cluster Management',
    provider: 'Kubernetes.io',
    url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
    description:
      'Interactive tutorial deploying apps on Kubernetes, creating Pods, Services, and configuring rolling updates with zero downtime.',
    skills: ['Docker & Kubernetes', 'Distributed Systems', 'Cloud Infrastructure'],
    roles: ['DevOps & Cloud Engineer', 'Solutions Architect'],
    type: 'Interactive',
    difficulty: 'Advanced',
    isFree: true,
    duration: '1.5 hours',
    isExternal: true,
  },
  {
    id: 'res-mslearn-github-actions',
    title: 'Microsoft Learn — Automate Workflows with GitHub Actions',
    provider: 'Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/training/paths/automate-workflow-github-actions/',
    description:
      'Learn automated continuous integration (CI) and continuous deployment (CD), pull request test validation, and artifact releases.',
    skills: ['CI/CD Pipelines', 'CI/CD Integration', 'Developer Platform'],
    roles: [
      'DevOps & Cloud Engineer',
      'Developer Platform & Tools Engineer',
      'QA Automation Engineer',
    ],
    type: 'Course',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '1 hour',
    isExternal: true,
  },
  {
    id: 'res-aws-skillbuilder',
    title: 'AWS Skill Builder — Cloud Practitioner Essentials',
    provider: 'AWS Skill Builder',
    url: 'https://skillbuilder.aws/',
    description:
      'Official Amazon Web Services cloud foundations: compute (EC2/Lambda), storage (S3), relational databases (RDS), and IAM security.',
    skills: ['AWS / Cloud', 'Cloud Architecture', 'Cloud Infrastructure'],
    roles: ['DevOps & Cloud Engineer', 'Solutions Architect', 'Backend Cloud Engineer'],
    type: 'Course',
    difficulty: 'Beginner',
    isFree: true,
    duration: '2 hours',
    isExternal: true,
  },

  // --- UI/UX & PRODUCT DESIGN ---
  {
    id: 'res-figma-autolayout',
    title: 'Figma Academy — Design Systems & Auto-Layout Guide',
    provider: 'Figma Learn',
    url: 'https://help.figma.com/hc/en-us/categories/360002042114-Design',
    description:
      'Master modern vector design: auto-layout responsive components, nested design tokens, interactive prototyping, and developer handoff.',
    skills: ['Figma', 'Design Systems', 'Prototyping'],
    roles: ['UI/UX Product Designer', 'Frontend Engineer', 'Product Manager'],
    type: 'Guide',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '45 min',
    isExternal: true,
  },
  {
    id: 'res-nng-ux-research',
    title: 'Nielsen Norman Group — UX Research & Usability Methods',
    provider: 'NN/g UX',
    url: 'https://www.nngroup.com/articles/which-ux-research-methods/',
    description:
      'Authoritative framework on conducting qualitative user discovery interviews, usability benchmarking, and identifying cognitive friction.',
    skills: ['User Research', 'User Discovery', 'Prototyping'],
    roles: ['UI/UX Product Designer', 'Product Manager'],
    type: 'Guide',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '30 min',
    isExternal: true,
  },

  // --- PRODUCT MANAGEMENT ---
  {
    id: 'res-atlassian-agile',
    title: 'Atlassian Agile Coach — Scrum, Epics & Product Roadmapping',
    provider: 'Atlassian',
    url: 'https://www.atlassian.com/agile',
    description:
      'Comprehensive industry guide on sprint planning, backlog grooming, story points estimation, and outcome-oriented roadmaps.',
    skills: ['Agile / Scrum', 'Roadmapping', 'Product Strategy'],
    roles: ['Product Manager', 'Solutions Architect'],
    type: 'Guide',
    difficulty: 'Beginner',
    isFree: true,
    duration: '45 min',
    isExternal: true,
  },

  // --- QA & AUTOMATION ---
  {
    id: 'res-playwright-intro',
    title: 'Playwright Official Docs — End-to-End Test Automation',
    provider: 'Playwright.dev',
    url: 'https://playwright.dev/docs/intro',
    description:
      'Modern web automation framework by Microsoft: cross-browser testing (Chromium/Firefox/WebKit), resilient locators, and CI integration.',
    skills: ['Playwright / Cypress', 'API Testing', 'CI/CD Integration'],
    roles: ['QA Automation Engineer', 'Frontend Engineer'],
    type: 'Documentation',
    difficulty: 'Intermediate',
    isFree: true,
    duration: '40 min',
    isExternal: true,
  },

  // --- CYBERSECURITY ---
  {
    id: 'res-cisco-cybersec',
    title: 'Cisco Networking Academy — Cybersecurity & Network Defense',
    provider: 'Cisco NetAcad',
    url: 'https://www.netacad.com/courses/cybersecurity',
    description:
      'Foundations of enterprise network defense, cryptographic protocols, threat actor taxonomy, and SIEM incident response.',
    skills: ['Network Security', 'Cloud Security (AWS/Azure)', 'Vulnerability Testing'],
    roles: ['Cybersecurity & Cloud Analyst', 'Cloud Network & 5G Infrastructure Engineer'],
    type: 'Course',
    difficulty: 'Beginner',
    isFree: true,
    duration: '2 hours',
    isExternal: true,
  },
];

// Grouped Curated Learning Modules (Connecting Skills to Genuine Resources)
export const mockLearningModules = [
  {
    id: 'learn-react',
    skillId: 'react',
    title: 'React 19 Component Architecture & Modern Hooks',
    category: 'Frontend Development',
    estimatedHours: 5,
    progressState: 'Learning',
    completionPercentage: 55,
    rolesStrengthened: ['Frontend Engineer', 'Full Stack Engineer', 'UI Developer'],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-react-quickstart'),
      verifiedLearningResources.find((r) => r.id === 'res-react-hooks'),
      verifiedLearningResources.find((r) => r.id === 'res-fcc-frontend-libs'),
    ].filter(Boolean),
  },
  {
    id: 'learn-javascript',
    skillId: 'javascript',
    title: 'Modern ES6+ JavaScript, Closures & Async Patterns',
    category: 'Core Programming',
    estimatedHours: 6,
    progressState: 'Practiced',
    completionPercentage: 80,
    rolesStrengthened: ['Frontend Engineer', 'Full Stack Engineer', 'Backend Cloud Engineer'],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-mdn-js-guide'),
      verifiedLearningResources.find((r) => r.id === 'res-mdn-async-js'),
    ].filter(Boolean),
  },
  {
    id: 'learn-css-design-systems',
    skillId: 'css-design-systems',
    title: 'Enterprise CSS Architecture, Grid & Design Tokens',
    category: 'UI Engineering',
    estimatedHours: 4,
    progressState: 'Demonstrated',
    completionPercentage: 100,
    rolesStrengthened: ['UI/UX Product Designer', 'Frontend Engineer'],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-mdn-css-grid'),
      verifiedLearningResources.find((r) => r.id === 'res-web-vitals'),
    ].filter(Boolean),
  },
  {
    id: 'learn-node',
    skillId: 'node',
    title: 'Node.js & Express RESTful Microservices',
    category: 'Backend Development',
    estimatedHours: 6,
    progressState: 'Not Started',
    completionPercentage: 0,
    rolesStrengthened: ['Backend Cloud Engineer', 'Full Stack Engineer'],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-node-intro'),
      verifiedLearningResources.find((r) => r.id === 'res-express-routing'),
      verifiedLearningResources.find((r) => r.id === 'res-fcc-backend-apis'),
    ].filter(Boolean),
  },
  {
    id: 'learn-sql',
    skillId: 'sql',
    title: 'SQL Relational Queries, Schema Indexing & ACIDity',
    category: 'Data & Storage',
    estimatedHours: 5,
    progressState: 'Learning',
    completionPercentage: 40,
    rolesStrengthened: [
      'Backend Cloud Engineer',
      'Data Analyst',
      'Data Scientist & AI Engineer',
      'Full Stack Engineer',
    ],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-sqlbolt-interactive'),
      verifiedLearningResources.find((r) => r.id === 'res-postgres-tutorial'),
    ].filter(Boolean),
  },
  {
    id: 'learn-python',
    skillId: 'python',
    title: 'Python 3 Fundamentals for Data Science & Automation',
    category: 'Core Programming',
    estimatedHours: 5,
    progressState: 'Not Started',
    completionPercentage: 0,
    rolesStrengthened: ['Data Analyst', 'Data Scientist & AI Engineer', 'Backend Cloud Engineer'],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-python-official'),
      verifiedLearningResources.find((r) => r.id === 'res-kaggle-pandas'),
    ].filter(Boolean),
  },
  {
    id: 'learn-docker-k8s',
    skillId: 'docker-kubernetes',
    title: 'Docker Containerization & Kubernetes Orchestration',
    category: 'Cloud & DevOps',
    estimatedHours: 6,
    progressState: 'Not Started',
    completionPercentage: 0,
    rolesStrengthened: ['DevOps & Cloud Engineer', 'Backend Cloud Engineer', 'Solutions Architect'],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-docker-curriculum'),
      verifiedLearningResources.find((r) => r.id === 'res-kubernetes-basics'),
      verifiedLearningResources.find((r) => r.id === 'res-mslearn-github-actions'),
    ].filter(Boolean),
  },
  {
    id: 'learn-ml-ai',
    skillId: 'machine-learning',
    title: 'Machine Learning Foundations & Deep Neural Networks',
    category: 'AI & Machine Learning',
    estimatedHours: 8,
    progressState: 'Not Started',
    completionPercentage: 0,
    rolesStrengthened: ['Data Scientist & AI Engineer', 'AI & Deep Learning Systems Engineer'],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-kaggle-intro-ml'),
      verifiedLearningResources.find((r) => r.id === 'res-pytorch-blitz'),
    ].filter(Boolean),
  },
  {
    id: 'learn-figma',
    skillId: 'figma',
    title: 'Figma Design Systems, Auto-Layout & UI Prototyping',
    category: 'Product Design',
    estimatedHours: 4,
    progressState: 'Not Started',
    completionPercentage: 0,
    rolesStrengthened: ['UI/UX Product Designer', 'Product Manager'],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-figma-autolayout'),
      verifiedLearningResources.find((r) => r.id === 'res-nng-ux-research'),
    ].filter(Boolean),
  },
  {
    id: 'learn-qa-automation',
    skillId: 'playwright',
    title: 'E2E Test Automation Frameworks & Continuous Validation',
    category: 'Quality Engineering',
    estimatedHours: 5,
    progressState: 'Not Started',
    completionPercentage: 0,
    rolesStrengthened: ['QA Automation Engineer', 'Frontend Engineer'],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-playwright-intro'),
      verifiedLearningResources.find((r) => r.id === 'res-mslearn-github-actions'),
    ].filter(Boolean),
  },
  {
    id: 'learn-cybersecurity',
    skillId: 'cybersecurity',
    title: 'Enterprise Network Security & Cloud Vulnerability Defense',
    category: 'Security',
    estimatedHours: 6,
    progressState: 'Not Started',
    completionPercentage: 0,
    rolesStrengthened: ['Cybersecurity & Cloud Analyst', 'DevOps & Cloud Engineer'],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-cisco-cybersec'),
      verifiedLearningResources.find((r) => r.id === 'res-aws-skillbuilder'),
    ].filter(Boolean),
  },
  {
    id: 'learn-product-agile',
    skillId: 'product-strategy',
    title: 'Product Strategy, Backlog Discovery & Agile Leadership',
    category: 'Product Management',
    estimatedHours: 4,
    progressState: 'Not Started',
    completionPercentage: 0,
    rolesStrengthened: ['Product Manager', 'Solutions Architect'],
    resources: [
      verifiedLearningResources.find((r) => r.id === 'res-atlassian-agile'),
      verifiedLearningResources.find((r) => r.id === 'res-nng-ux-research'),
    ].filter(Boolean),
  },
];

export const LEARNING_CATEGORIES = [
  'Frontend',
  'Backend',
  'Data & AI',
  'Cloud & DevOps',
  'Design & Product',
  'Security & QA',
];

export const LEARNING_PROVIDERS = [
  'MDN Web Docs',
  'freeCodeCamp',
  'W3Schools',
  'Python.org',
  'SQLBolt',
  'Kaggle Learn',
  'Microsoft Learn',
  'AWS Skill Builder',
  'Docker Docs',
  'Kubernetes.io',
  'Playwright.dev',
  'PyTorch.org',
  'Cisco NetAcad',
  'Atlassian Agile',
  'React.dev',
  'Figma Learn',
];

function inferResourceCategory(res) {
  if (res.category) return res.category;
  const combined = ((res.roles || []).join(' ') + ' ' + (res.skills || []).join(' ')).toLowerCase();
  if (
    combined.includes('frontend') ||
    combined.includes('react') ||
    combined.includes('css') ||
    combined.includes('html') ||
    combined.includes('dom')
  )
    return 'Frontend';
  if (
    combined.includes('data') ||
    combined.includes('sql') ||
    combined.includes('python') ||
    combined.includes('machine learning') ||
    combined.includes('pytorch')
  )
    return 'Data & AI';
  if (
    combined.includes('devops') ||
    combined.includes('cloud') ||
    combined.includes('aws') ||
    combined.includes('docker') ||
    combined.includes('kubernetes')
  )
    return 'Cloud & DevOps';
  if (
    combined.includes('design') ||
    combined.includes('ui/ux') ||
    combined.includes('product') ||
    combined.includes('figma')
  )
    return 'Design & Product';
  if (
    combined.includes('security') ||
    combined.includes('testing') ||
    combined.includes('playwright') ||
    combined.includes('qa')
  )
    return 'Security & QA';
  if (
    combined.includes('backend') ||
    combined.includes('api') ||
    combined.includes('node') ||
    combined.includes('system design')
  )
    return 'Backend';
  return 'Engineering';
}

/**
 * Returns all distinct verified learning resources with normalized categories.
 */
export function getAllLearningResources() {
  return verifiedLearningResources.map((res) => ({
    ...res,
    category: inferResourceCategory(res),
  }));
}

/**
 * Finds genuine learning resources specifically matching a given skill name.
 */
export function getResourcesForSkill(skillName = '') {
  if (!skillName) return [];
  const s = skillName.toLowerCase();
  return getAllLearningResources().filter((res) => {
    return (res.skills || []).some((sk) => {
      const normalizedSk = sk.toLowerCase();
      return normalizedSk.includes(s) || s.includes(normalizedSk);
    });
  });
}

/**
 * Finds genuine learning resources matching a target role.
 */
export function getResourcesForRole(roleTitle = '') {
  if (!roleTitle) return getAllLearningResources();
  const rt = roleTitle.toLowerCase();
  return getAllLearningResources().filter((res) => {
    return (res.roles || []).some((r) => {
      const normalizedR = r.toLowerCase();
      return normalizedR.includes(rt) || rt.includes(normalizedR);
    });
  });
}

/**
 * Resolves prioritized online learning resources for candidate skill gaps on their target role.
 */
export function getRecommendedResourcesForGaps(
  gapSkills = [],
  candidateSkillsOrTargetRole = [],
  targetRoleTitle = 'Frontend Engineer',
) {
  const roleTitle =
    typeof candidateSkillsOrTargetRole === 'string' ? candidateSkillsOrTargetRole : targetRoleTitle;

  if (!gapSkills || gapSkills.length === 0) {
    // Return top resources for target role
    return getResourcesForRole(roleTitle)
      .slice(0, 4)
      .map((res) => ({
        ...res,
        recommendationReason: `Core competency for ${roleTitle}`,
      }));
  }

  const recommended = [];
  const seenIds = new Set();

  for (const gap of gapSkills) {
    const matched = getResourcesForSkill(gap);
    for (const res of matched) {
      if (!seenIds.has(res.id)) {
        seenIds.add(res.id);
        recommended.push({
          ...res,
          recommendationReason: `Bridges priority gap: ${gap} for ${roleTitle}`,
        });
      }
    }
  }

  // If few matches, backfill with role-specific resources
  if (recommended.length < 3) {
    const roleResources = getResourcesForRole(roleTitle);
    for (const res of roleResources) {
      if (!seenIds.has(res.id)) {
        seenIds.add(res.id);
        recommended.push({
          ...res,
          recommendationReason: `Recommended technical foundation for ${roleTitle}`,
        });
      }
    }
  }

  return recommended;
}

/**
 * Generates structured, ordered roadmap steps with attached genuine learning resources for a role.
 */
export function getRoleRoadmapSteps(role) {
  if (!role) return [];

  const coreSkills = role.coreSkills || [];
  const relatedSkills = role.relatedSkills || [];
  const prep = role.preparationPath || [];

  // Group skills into 4 distinct progressive stages
  const step1Skills = coreSkills.slice(0, 2);
  const step2Skills =
    coreSkills.slice(2, 4).length > 0 ? coreSkills.slice(2, 4) : coreSkills.slice(1, 2);
  const step3Skills = coreSkills.slice(4).concat(relatedSkills.slice(0, 2));
  const step4Skills = relatedSkills.slice(2, 5);

  const globalSeenIds = new Set();

  const getStepResources = (skillsList, fallbackSkills = []) => {
    const list = [];

    // First pass: match primary step skills
    for (const sk of skillsList) {
      const found = getResourcesForSkill(sk);
      for (const r of found) {
        if (!globalSeenIds.has(r.id)) {
          globalSeenIds.add(r.id);
          list.push(r);
          if (list.length >= 3) break;
        }
      }
      if (list.length >= 3) break;
    }

    // Second pass: fallback skills if needed
    if (list.length < 2 && fallbackSkills.length > 0) {
      for (const sk of fallbackSkills) {
        const found = getResourcesForSkill(sk);
        for (const r of found) {
          if (!globalSeenIds.has(r.id)) {
            globalSeenIds.add(r.id);
            list.push(r);
            if (list.length >= 2) break;
          }
        }
        if (list.length >= 2) break;
      }
    }

    // Third pass: role-level resources not yet seen
    if (list.length === 0) {
      const roleRes = getResourcesForRole(role.title);
      for (const r of roleRes) {
        if (!globalSeenIds.has(r.id)) {
          globalSeenIds.add(r.id);
          list.push(r);
          if (list.length >= 2) break;
        }
      }
    }

    return list;
  };

  const steps = [
    {
      stepNumber: 1,
      stepKey: 'step-1',
      phaseLabel: 'Phase 01: Language & Architecture Foundations',
      title: 'Step 1: Core Fundamentals & Language Standards',
      description:
        prep[0] ||
        `Master foundational principles and essential syntax for ${step1Skills.join(', ')}.`,
      skills: step1Skills.length > 0 ? step1Skills : ['Fundamentals'],
      resources: getStepResources(step1Skills, ['JavaScript', 'HTML', 'CSS']),
    },
    {
      stepNumber: 2,
      stepKey: 'step-2',
      phaseLabel: 'Phase 02: Framework Mastery & Microservices',
      title: 'Step 2: Core Engineering & Component Architecture',
      description:
        prep[1] ||
        `Build deep expertise in core frameworks and workflows for ${step2Skills.join(', ')}.`,
      skills: step2Skills.length > 0 ? step2Skills : ['Core Architecture'],
      resources: getStepResources(step2Skills, coreSkills),
    },
    {
      stepNumber: 3,
      stepKey: 'step-3',
      phaseLabel: 'Phase 03: Performance, Testing & Systems',
      title: 'Step 3: Systems, Optimization & Testing Pipelines',
      description: prep[2] || `Optimize reliability, database indexing, and performance standards.`,
      skills: step3Skills.length > 0 ? step3Skills : ['System Performance'],
      resources: getStepResources(step3Skills, ['Web Performance', 'TypeScript', 'Testing']),
    },
    {
      stepNumber: 4,
      stepKey: 'step-4',
      phaseLabel: 'Phase 04: Production Capstone & DevOps',
      title: 'Step 4: End-to-End Capstone & Production Readiness',
      description:
        prep[3] || `Synthesize complete real-world projects featuring production workflows.`,
      skills: step4Skills.length > 0 ? step4Skills : ['Portfolio Project'],
      resources: getStepResources(step4Skills, ['Docker', 'Git', 'CI/CD Pipelines']),
    },
  ];

  return steps;
}
