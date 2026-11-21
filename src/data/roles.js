export const mockRoles = [
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    category: 'Engineering',
    description:
      'Architect and build modern, responsive, and high-performance client-side web applications.',
    overview:
      'Frontend Engineers translate product design into functional, high-speed, accessible user interfaces using React, JavaScript, and modern CSS architecture.',
    responsibilities: [
      'Develop modular React UI components using modern design token systems.',
      'Optimize web vital metrics, page load speeds, and bundle sizes.',
      'Collaborate with UX designers and backend engineers to integrate REST & GraphQL APIs.',
      'Ensure cross-browser compatibility and strict WCAG accessibility standards.',
    ],
    coreSkills: ['React.js', 'JavaScript (ES6+)', 'CSS & Design Systems', 'Web Performance'],
    relatedSkills: ['TypeScript', 'State Management', 'Git', 'Figma'],
    preparationPath: [
      'Master JavaScript fundamentals, DOM manipulation, and ES6+ closures/async.',
      'Build deep expertise in React 19 component lifecycle, hooks, and performance tuning.',
      'Learn CSS layout architecture, design tokens, and glassmorphic UI patterns.',
      'Construct a production-ready portfolio project featuring API integration.',
    ],
    relatedJobIds: ['job-001', 'job-002', 'job-004'],
  },
  {
    id: 'fullstack-engineer',
    title: 'Full Stack Engineer',
    category: 'Engineering',
    description:
      'Build complete end-to-end web applications covering frontend UI, backend microservices, and databases.',
    overview:
      'Full Stack Engineers bridge frontend user experiences with scalable backend APIs and relational databases, owning end-to-end product feature delivery.',
    responsibilities: [
      'Develop full stack features with React/Vite on the client and Node.js/Express on the server.',
      'Design database schemas, writing complex SQL and NoSQL queries.',
      'Implement user authentication, RBAC authorization, and API security.',
      'Build automated unit and integration tests across application layers.',
    ],
    coreSkills: ['React.js', 'Node.js & Express', 'SQL & Databases', 'REST APIs'],
    relatedSkills: ['TypeScript', 'GraphQL', 'Docker', 'Git'],
    preparationPath: [
      'Master modern frontend React framework patterns and state management.',
      'Build RESTful and GraphQL API servers with database ORM models.',
      'Implement persistent user session authentication and middleware.',
      'Deploy full stack web applications to cloud platforms.',
    ],
    relatedJobIds: ['job-001', 'job-002', 'job-003', 'job-055', 'job-057', 'job-067', 'job-072'],
  },
  {
    id: 'backend-engineer',
    title: 'Backend Cloud Engineer',
    category: 'Engineering',
    description:
      'Design and scale server-side microservices, cloud databases, and high-throughput APIs.',
    overview:
      'Backend Engineers build the foundational engine powering scalable cloud infrastructure, data pipelines, security, and database storage.',
    responsibilities: [
      'Design resilient RESTful and gRPC microservices in Node.js, Go, or Java.',
      'Manage relational SQL (PostgreSQL) and NoSQL database schemas.',
      'Implement secure authentication, OAuth2, and PCI-DSS payment compliance.',
      'Monitor cloud telemetry, automated CI/CD pipelines, and server response times.',
    ],
    coreSkills: [
      'Node.js & Express',
      'SQL & Relational Databases',
      'Distributed Systems',
      'REST APIs',
    ],
    relatedSkills: ['Docker', 'Kubernetes', 'Redis Caching', 'AWS/Azure'],
    preparationPath: [
      'Understand asynchronous event loops, multi-threading, and server runtimes.',
      'Master SQL schema design, indexing, join optimization, and transactions.',
      'Build RESTful APIs with input validation, JWT auth, and rate limiting.',
      'Deploy containerized microservices to cloud platforms.',
    ],
    relatedJobIds: ['job-002', 'job-005', 'job-054', 'job-058', 'job-061'],
  },
  {
    id: 'devops-cloud-architect',
    title: 'DevOps & Cloud Engineer',
    category: 'Infrastructure',
    description:
      'Automate CI/CD pipelines, manage Kubernetes clusters, and architect cloud infrastructure as code.',
    overview:
      'DevOps Engineers manage cloud reliability, automated deployment pipelines, infrastructure security, and container orchestration across AWS/GCP.',
    responsibilities: [
      'Write Terraform and CloudFormation scripts for Infrastructure as Code (IaC).',
      'Configure automated GitHub Actions and Jenkins CI/CD deployment pipelines.',
      'Manage Kubernetes container workloads, horizontal auto-scaling, and ingress rules.',
      'Implement Prometheus, Grafana, and Datadog cloud observability monitoring.',
    ],
    coreSkills: ['AWS / Cloud', 'Docker & Kubernetes', 'Terraform / IaC', 'CI/CD Pipelines'],
    relatedSkills: ['Linux Sysadmin', 'Python Shell Scripting', 'Prometheus', 'Networking'],
    preparationPath: [
      'Gain deep expertise in Linux system administration and shell scripting.',
      'Master containerization with Docker and multi-container setups.',
      'Build CI/CD automation pipelines for continuous deployment.',
      'Deploy production Kubernetes clusters with Infrastructure as Code.',
    ],
    relatedJobIds: ['job-002', 'job-005', 'job-059', 'job-069'],
  },
  {
    id: 'data-scientist-ai',
    title: 'Data Scientist & AI Engineer',
    category: 'Data & AI',
    description:
      'Develop predictive machine learning models, statistical analyses, and Generative AI workflows.',
    overview:
      'Data Scientists combine statistical analysis, machine learning algorithms, and deep learning models to extract intelligence from enterprise data.',
    responsibilities: [
      'Train and fine-tune supervised, unsupervised, and LLM machine learning models.',
      'Perform feature engineering, exploratory data analysis, and statistical hypothesis testing.',
      'Deploy ML models into production API endpoints using FastAPI and PyTorch.',
      'Evaluate model performance metrics, accuracy, precision, and drift.',
    ],
    coreSkills: ['Python & PyTorch', 'Machine Learning', 'SQL & Big Data', 'Generative AI'],
    relatedSkills: ['Scikit-Learn', 'Pandas & NumPy', 'FastAPI', 'MLOps'],
    preparationPath: [
      'Master Python data analysis stack (pandas, NumPy, Matplotlib).',
      'Study core statistical methods, linear algebra, and ML algorithms.',
      'Build deep learning and LLM prompt engineering pipelines.',
      'Deploy real-time inference model APIs to production.',
    ],
    relatedJobIds: ['job-001', 'job-002', 'job-053', 'job-056'],
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'Product Management',
    description:
      'Define product vision, prioritize roadmap features, and drive cross-functional engineering execution.',
    overview:
      'Product Managers own the strategic product roadmap, align engineering and design teams around customer needs, and measure business impact.',
    responsibilities: [
      'Conduct market research, competitor analysis, and customer discovery interviews.',
      'Write PRDs, epic definitions, user stories, and acceptance criteria.',
      'Prioritize backlog items using RICE frameworks and business value metrics.',
      'Track product launch KPIs, adoption funnels, and retention analytics.',
    ],
    coreSkills: ['Product Strategy', 'User Discovery', 'Roadmapping', 'Agile / Scrum'],
    relatedSkills: ['A/B Testing', 'Mixpanel / Amplitude', 'Wireframing', 'SQL'],
    preparationPath: [
      'Learn structured problem solving and customer research methodologies.',
      'Understand technical architecture basics to collaborate with developers.',
      'Master agile project management, sprint planning, and user story mapping.',
      'Lead a product launch case study from discovery to metrics evaluation.',
    ],
    relatedJobIds: ['job-003', 'job-004'],
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Product Designer',
    category: 'Design',
    description:
      'Create user-centered visual interfaces, interactive prototypes, and design systems.',
    overview:
      'UI/UX Product Designers conduct user research, craft wireframes, design intuitive user flows, and maintain design systems for enterprise software.',
    responsibilities: [
      'Conduct customer discovery interviews, persona mapping, and usability testing.',
      'Produce wireframes, high-fidelity UI screens, and interactive prototypes in Figma.',
      'Evolve enterprise design token systems and component style guides.',
      'Partner with engineering to ensure pixel-perfect frontend implementation.',
    ],
    coreSkills: ['Figma', 'User Research', 'Design Systems', 'Prototyping'],
    relatedSkills: [
      'Design Tokens',
      'Wireframing',
      'Information Architecture',
      'Micro-interactions',
    ],
    preparationPath: [
      'Study visual hierarchy, typography scales, color theory, and spatial grids.',
      'Master component auto-layout, variants, and interactive prototyping in Figma.',
      'Conduct user testing sessions to iterate on interaction friction.',
      'Build a case study portfolio showcasing end-to-end design problem solving.',
    ],
    relatedJobIds: ['job-003'],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    description:
      'Transform raw organizational data into actionable business intelligence and dashboards.',
    overview:
      'Data Analysts query enterprise databases, perform statistical analysis, and construct executive dashboards to drive data-informed product decisions.',
    responsibilities: [
      'Write complex SQL queries to aggregate and analyze user behavior datasets.',
      'Build interactive BI dashboards in Tableau, PowerBI, or Looker.',
      'Analyze A/B experiment metrics and communicate key insights to stakeholders.',
      'Perform data cleaning, validation, and exploratory data analysis (EDA).',
    ],
    coreSkills: ['SQL & Relational Databases', 'Data Visualization', 'Python / R', 'Statistics'],
    relatedSkills: ['Excel / Spreadsheets', 'Tableau', 'Metrics Definition', 'A/B Testing'],
    preparationPath: [
      'Master SQL queries, aggregations, window functions, and CTEs.',
      'Learn data manipulation using Python pandas and NumPy libraries.',
      'Create interactive visual reports connecting real-world business KPIs.',
      'Analyze open-source datasets to produce actionable recommendation reports.',
    ],
    relatedJobIds: ['job-002', 'job-073'],
  },
  {
    id: 'qa-automation-engineer',
    title: 'QA Automation Engineer',
    category: 'Quality Engineering',
    description:
      'Design automated test suites, end-to-end testing frameworks, and continuous integration validation.',
    overview:
      'QA Automation Engineers write automated regression scripts, API integration tests, and performance benchmarks to ensure software quality.',
    responsibilities: [
      'Develop E2E test automation frameworks using Playwright, Cypress, or Selenium.',
      'Write API integration tests with Postman and REST-assured in CI pipelines.',
      'Perform automated regression testing across web and mobile viewports.',
      'Identify, log, and verify software bugs with detailed reproduction steps.',
    ],
    coreSkills: ['Playwright / Cypress', 'JavaScript / Python', 'API Testing', 'CI/CD Integration'],
    relatedSkills: ['Selenium', 'Postman', 'Bug Tracking', 'Performance Testing'],
    preparationPath: [
      'Master manual QA testing principles and bug lifecycle tracking.',
      'Learn programming in JavaScript or Python for test scripting.',
      'Build end-to-end test automation suites for web applications.',
      'Integrate test scripts into automated GitHub Actions CI pipelines.',
    ],
    relatedJobIds: ['job-001', 'job-004'],
  },
  {
    id: 'mobile-app-developer',
    title: 'Mobile App Engineer',
    category: 'Engineering',
    description: 'Build native and cross-platform mobile applications for iOS and Android.',
    overview:
      'Mobile App Engineers construct smooth, high-performance mobile user experiences using React Native, Flutter, Swift, or Kotlin.',
    responsibilities: [
      'Develop mobile UI screens and navigation flows in React Native or Flutter.',
      'Integrate native device APIs, push notifications, and geolocation services.',
      'Optimize app startup speeds, memory usage, and smooth 60fps animations.',
      'Manage App Store and Google Play deployment release pipelines.',
    ],
    coreSkills: ['React Native / Flutter', 'JavaScript / TypeScript', 'Mobile UI', 'REST APIs'],
    relatedSkills: ['Swift / Kotlin', 'Redux', 'App Store Deployment', 'Offline Storage'],
    preparationPath: [
      'Master core React component architecture and hooks.',
      'Learn React Native native bridges, navigation, and styling.',
      'Build offline-first mobile apps with local data caching.',
      'Deploy a mobile app to iOS TestFlight or Google Play Beta.',
    ],
    relatedJobIds: ['job-001', 'job-003', 'job-066'],
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity & Cloud Analyst',
    category: 'Security',
    description:
      'Protect cloud infrastructure, monitor security threats, and enforce compliance policies.',
    overview:
      'Cybersecurity Analysts evaluate system vulnerabilities, respond to security incidents, and maintain security controls across enterprise networks.',
    responsibilities: [
      'Perform security vulnerability assessments and penetration testing scans.',
      'Configure cloud IAM security policies, firewalls, and encryption standards.',
      'Monitor SIEM logs for anomalous network traffic and security threats.',
      'Ensure compliance with ISO 27001, SOC 2, and GDPR privacy regulations.',
    ],
    coreSkills: [
      'Network Security',
      'Cloud Security (AWS/Azure)',
      'Vulnerability Testing',
      'SIEM Monitoring',
    ],
    relatedSkills: ['Linux', 'Python Scripting', 'Compliance (SOC 2)', 'Incident Response'],
    preparationPath: [
      'Understand networking protocols (TCP/IP, DNS, SSL/TLS, HTTP).',
      'Learn Linux security configuration and privilege escalation checks.',
      'Gain hands-on practice with vulnerability scanners and SIEM logs.',
      'Obtain industry security certifications like CompTIA Security+ or CISSP.',
    ],
    relatedJobIds: ['job-002', 'job-005', 'job-071'],
  },
  {
    id: 'solutions-architect',
    title: 'Solutions Architect',
    category: 'Architecture',
    description:
      'Design enterprise software architecture, technology selection, and scalable system integration.',
    overview:
      'Solutions Architects evaluate technical requirements, design end-to-end multi-cloud software architectures, and guide engineering teams on system design.',
    responsibilities: [
      'Design high-level software system architecture diagrams and data flows.',
      'Evaluate and select cloud platforms, databases, and third-party SaaS tools.',
      'Ensure system scalability, high availability, fault tolerance, and security.',
      'Guide senior engineering leads on architectural patterns and code standards.',
    ],
    coreSkills: [
      'System Design',
      'Cloud Architecture',
      'Distributed Systems',
      'Enterprise Integration',
    ],
    relatedSkills: [
      'Microservices',
      'Data Modeling',
      'Technical Leadership',
      'Security Architecture',
    ],
    preparationPath: [
      'Master distributed systems theory, CAP theorem, and caching strategies.',
      'Gain extensive hands-on experience building backend microservices.',
      'Practice large-scale system design interviews and architectural trade-offs.',
      'Obtain AWS Solutions Architect Professional certification.',
    ],
    relatedJobIds: ['job-002', 'job-005', 'job-069'],
  },
  {
    id: 'ai-systems-engineer',
    title: 'AI & Deep Learning Systems Engineer',
    category: 'Data & AI',
    description:
      'Architect high-performance GPU computing clusters, neural network compilers, and scalable generative AI inference infrastructure.',
    overview:
      'AI Systems Engineers build low-latency inference pipelines, optimize CUDA/TensorRT kernels, and design infrastructure powering foundation models and LLMs.',
    responsibilities: [
      'Optimize GPU kernel performance using CUDA, TensorRT, and low-level C++.',
      'Scale distributed deep learning training pipelines across multi-node GPU clusters.',
      'Build low-latency LLM serving infrastructure with dynamic batching and quantization.',
      'Collaborate with research scientists to deploy state-of-the-art vision and language models.',
    ],
    coreSkills: ['CUDA & C++', 'PyTorch / JAX', 'GPU Architecture', 'TensorRT / ONNX'],
    relatedSkills: ['Distributed Systems', 'Docker & Kubernetes', 'LLM Fine-tuning', 'Python'],
    preparationPath: [
      'Master C++ memory management, multi-threading, and systems programming.',
      'Learn CUDA kernel programming and GPU memory hierarchy optimization.',
      'Study distributed training algorithms (Data Parallelism, Tensor Parallelism).',
      'Deploy a high-throughput transformer inference engine with vLLM / TensorRT-LLM.',
    ],
    relatedJobIds: ['job-053', 'job-066'],
  },
  {
    id: 'fintech-engineer',
    title: 'FinTech & Payments Systems Engineer',
    category: 'Engineering',
    description:
      'Engineer resilient, high-concurrency payment gateways, UPI transaction pipelines, and PCI-DSS compliant financial microservices.',
    overview:
      'FinTech Engineers design ultra-reliable, idempotent transaction processing engines handling millions of daily financial transactions with zero data loss.',
    responsibilities: [
      'Architect distributed ledger services with strict ACID compliance and double-entry accounting.',
      'Build real-time fraud detection and risk assessment microservices.',
      'Integrate banking APIs, card networks, and instant UPI payment rails.',
      'Ensure 99.999% availability with automated reconciliation and idempotent API handling.',
    ],
    coreSkills: [
      'Distributed Systems',
      'Java / Go',
      'Payment Protocols (UPI/ISO8583)',
      'PostgreSQL / Redis',
    ],
    relatedSkills: ['Kafka', 'PCI-DSS Compliance', 'Idempotency Patterns', 'Spring Boot'],
    preparationPath: [
      'Master ACID transactions, distributed locking, and event-driven architectures.',
      'Study financial ledger schemas, double-entry bookkeeping, and settlement lifecycles.',
      'Build an idempotent payments API with webhook retry policies and Redis rate limiting.',
      'Learn payment security compliance standards including encryption and tokenization.',
    ],
    relatedJobIds: ['job-058', 'job-060', 'job-070', 'job-071', 'job-072'],
  },
  {
    id: 'streaming-engineer',
    title: 'Streaming Media & High-Concurrency Systems Engineer',
    category: 'Engineering',
    description:
      'Design low-latency video and audio streaming pipelines, adaptive bitrate distribution networks, and real-time audio analytics.',
    overview:
      'Streaming Systems Engineers architect CDN distribution, WebRTC/HLS protocols, and high-concurrency streaming backends serving global entertainment platforms.',
    responsibilities: [
      'Architect real-time audio/video transcoding pipelines using HLS, DASH, and WebRTC.',
      'Optimize edge caching and Content Delivery Network (CDN) routing algorithms.',
      'Build distributed event-driven microservices handling millions of concurrent listeners.',
      'Design personalization and playback telemetry tracking pipelines.',
    ],
    coreSkills: [
      'Distributed Systems',
      'Go / Java',
      'Kafka / Streaming Data',
      'WebRTC / HLS / Media Protocols',
    ],
    relatedSkills: ['Redis', 'Kubernetes', 'Video/Audio Codecs', 'Telemetry & Monitoring'],
    preparationPath: [
      'Understand video and audio encoding standards, chunking, and adaptive bitrate delivery.',
      'Learn distributed stream processing with Apache Kafka and Flink.',
      'Build an end-to-end live streaming service with WebRTC and WebSocket signaling.',
      'Deploy edge-caching architectures using Cloudflare Workers or AWS CloudFront.',
    ],
    relatedJobIds: ['job-054', 'job-056', 'job-068'],
  },
  {
    id: 'automotive-software-engineer',
    title: 'Connected Mobility & Automotive Software Engineer',
    category: 'Engineering',
    description:
      'Develop software for connected electric vehicles, autonomous drive systems, telematics, and in-vehicle infotainment.',
    overview:
      'Automotive Software Engineers build safety-critical embedded firmware, sensor fusion software, and cloud-connected telematics for next-generation electric and autonomous vehicles.',
    responsibilities: [
      'Develop embedded C/C++ control systems and vehicle telematics services.',
      'Implement CAN/LIN communication protocols and AUTOSAR software architectures.',
      'Process sensor data from radar, lidar, and camera feeds for ADAS driver-assist features.',
      'Engineer secure over-the-air (OTA) firmware update pipelines connecting cars to the cloud.',
    ],
    coreSkills: ['Embedded C / C++', 'CAN Bus / AUTOSAR', 'ROS / Robotics', 'Linux / RTOS'],
    relatedSkills: ['Python', 'Computer Vision', 'IoT Telematics', 'Safety Standards (ISO 26262)'],
    preparationPath: [
      'Master C and C++ programming with focus on memory safety and real-time execution.',
      'Learn automotive bus communication protocols (CAN, LIN, Ethernet).',
      'Gain experience with ROS2 (Robot Operating System) and sensor fusion algorithms.',
      'Build an IoT vehicle telematics gateway using Raspberry Pi or embedded microcontrollers.',
    ],
    relatedJobIds: ['job-063', 'job-064', 'job-065'],
  },
  {
    id: 'cloud-network-engineer',
    title: 'Cloud Network & 5G Infrastructure Engineer',
    category: 'Infrastructure',
    description:
      'Architect carrier-grade software-defined networks, 5G cloud core infrastructure, and enterprise zero-trust networking.',
    overview:
      'Cloud Network Engineers build high-throughput Software-Defined Networks (SDN), configure virtualized telecom cloud cores, and manage zero-trust network perimeters.',
    responsibilities: [
      'Design and manage SDN, BGP routing, and high-performance network overlays.',
      'Deploy containerized 5G core network functions (CNFs) on Kubernetes.',
      'Implement Zero Trust Network Access (ZTNA) and micro-segmentation firewalls.',
      'Optimize network telemetry, eBPF packet inspection, and transit latency.',
    ],
    coreSkills: [
      'Software-Defined Networking (SDN)',
      'Kubernetes / CNFs',
      'BGP / Routing Protocols',
      'Linux Kernel / eBPF',
    ],
    relatedSkills: ['Python Scripting', 'Go', 'Terraform', 'Network Security'],
    preparationPath: [
      'Deepen knowledge of TCP/IP, OSI model, BGP, and DNS routing fundamentals.',
      'Learn Linux network namespaces, virtual interfaces, and eBPF observability.',
      'Deploy Kubernetes container networking plugins (Calico, Cilium, CNI).',
      'Build automated network configuration scripts with Terraform and Python.',
    ],
    relatedJobIds: ['job-062', 'job-068', 'job-069'],
  },
  {
    id: 'developer-experience-engineer',
    title: 'Developer Platform & Tools Engineer',
    category: 'Engineering',
    description:
      'Build developer productivity platforms, automated CI/CD tooling, code intelligence engines, and CLI workflows.',
    overview:
      'Developer Platform Engineers create internal developer platforms, code review bots, CLI utilities, and SDKs that multiply engineering velocity across thousands of developers.',
    responsibilities: [
      'Develop high-speed build systems, monorepo tooling, and developer CLI tools.',
      'Architect automated GitHub Actions workflows, custom bots, and security scanners.',
      'Build SDKs and API client libraries across multiple programming languages.',
      'Optimize local development environments, hot reloading, and remote development containers.',
    ],
    coreSkills: ['TypeScript / Node.js', 'Go / Rust', 'CI/CD & GitHub Actions', 'Git Internals'],
    relatedSkills: ['Docker', 'CLI Development', 'API Design', 'Monorepo Tooling'],
    preparationPath: [
      'Master Git internals, tree objects, commits, and hook mechanisms.',
      'Build CLI tools with Node.js or Go supporting rich terminal interactive UI.',
      'Construct automated CI/CD release workflows with package registry publication.',
      'Create custom linting rules or code generators to enhance developer velocity.',
    ],
    relatedJobIds: ['job-059', 'job-067'],
  },
];

export function getRoleById(id) {
  return mockRoles.find((r) => r.id === id) || null;
}
