import fs from 'fs';

// 1. Read existing jobs and parse
const existingJobsContent = fs.readFileSync('src/data/jobs.js', 'utf8');

// Parse companies
const companiesText = fs.readFileSync('src/data/companies/companies.js', 'utf8');
const companyBlockRegex = /{\s*id:\s*['"]([^'"]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?industry:\s*['"]([^'"]+)['"]/g;
const companies = [];
let match;
while ((match = companyBlockRegex.exec(companiesText)) !== null) {
  companies.push({ id: match[1], name: match[2], industry: match[3] });
}
console.log(`Loaded ${companies.length} companies.`);

// Additional curated, realistic jobs to expand prominent companies
// This includes internships with realistic stipends (₹8k - ₹30k/mo), freshers, mid-level and senior roles.
const additionalJobs = [
  // Google (adding 2 more jobs -> total 4)
  {
    companyId: "google",
    title: "Software Engineering Intern - Cloud & Web Platforms",
    category: "Technology",
    subcategory: "Cloud Infrastructure",
    location: "Bengaluru, KA",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹25,000 – ₹35,000 / month (Stipend)",
    salaryRange: "₹25,000 – ₹35,000 / month (Stipend)",
    skills: ["Go", "C++", "Distributed Systems", "Data Structures", "Linux"],
    description: "Collaborate with Google Cloud infrastructure engineers on distributed storage telemetry, RPC profiling, and core platform microservices.",
    responsibilities: [
      "Implement performance benchmarking scripts and automated tests for cloud storage APIs.",
      "Profile gRPC service latency and memory utilization across test Kubernetes pods.",
      "Participate in weekly team design reviews and present final internship project to engineering leadership."
    ],
    education: "Pursuing B.Tech / B.E. / M.Tech in Computer Science or related engineering field",
    postedDate: "2026-09-22",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },
  {
    companyId: "google",
    title: "Product Marketing Specialist - Developer Platforms",
    category: "Marketing",
    subcategory: "Product Marketing",
    location: "Hyderabad, TS",
    workMode: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    experienceRequirement: "3-5 Years",
    salary: "₹22 – ₹32 LPA (Annual CTC)",
    salaryRange: "₹22 – ₹32 LPA (Annual CTC)",
    skills: ["Developer Marketing", "Content Strategy", "Google Cloud", "Community Engagement", "Campaign Analytics"],
    description: "Drive adoption and engagement for Google developer tools and APIs across India and APAC tech communities.",
    responsibilities: [
      "Formulate go-to-market developer campaigns for Vertex AI and Android Studio tools.",
      "Organize community hackathons, tech workshops, and developer conference showcases.",
      "Analyze funnel metrics from documentation page views to active API token generations."
    ],
    education: "Bachelor's degree in Marketing, Business, or Computer Science",
    postedDate: "2026-09-21",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Microsoft (adding 2 more jobs -> total 4)
  {
    companyId: "microsoft",
    title: "Data Science & Applied AI Intern",
    category: "Data & AI",
    subcategory: "Machine Learning",
    location: "Hyderabad, TS",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹22,000 – ₹32,000 / month (Stipend)",
    salaryRange: "₹22,000 – ₹32,000 / month (Stipend)",
    skills: ["Python", "PyTorch", "Data Science", "SQL", "Azure ML"],
    description: "Apply machine learning algorithms to telemetry datasets, supporting intelligence features in Microsoft 365 and Copilot services.",
    responsibilities: [
      "Cleanse, preprocess, and validate multi-terabyte log data for predictive feature modeling.",
      "Train classification and ranking models using PyTorch and Azure Machine Learning Studio.",
      "Document experimental outcomes, accuracy improvements, and model drift metrics."
    ],
    education: "Pursuing Master or Bachelor degree in Data Science, Computer Science, or Mathematics",
    postedDate: "2026-09-23",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },
  {
    companyId: "microsoft",
    title: "Security Operations Analyst - Azure Defender",
    category: "Cybersecurity",
    subcategory: "SOC & Incident Response",
    location: "Bengaluru, KA",
    workMode: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Associate",
    experienceRequirement: "1-3 Years",
    salary: "₹14 – ₹20 LPA (Annual CTC)",
    salaryRange: "₹14 – ₹20 LPA (Annual CTC)",
    skills: ["SIEM / Sentinel", "Threat Hunting", "Incident Response", "Azure Security", "KQL"],
    description: "Monitor real-time threat intelligence feeds and investigate security alerts across Microsoft Azure customer subscriptions.",
    responsibilities: [
      "Triage security alerts using Microsoft Sentinel and automated Kusto Query Language (KQL) scripts.",
      "Investigate abnormal identity authentications, privilege escalations, and egress anomalies.",
      "Collaborate with incident response teams to remediate and isolate compromised cloud endpoints."
    ],
    education: "B.Tech / B.E. in Cybersecurity, IT, or Computer Science",
    postedDate: "2026-09-22",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Amazon (adding 2 more jobs -> total 4)
  {
    companyId: "amazon",
    title: "Applied Scientist - Recommendation Systems",
    category: "Data & AI",
    subcategory: "Machine Learning",
    location: "Bengaluru, KA",
    workMode: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    experienceRequirement: "5+ Years",
    salary: "₹45 – ₹65 LPA (Annual CTC)",
    salaryRange: "₹45 – ₹65 LPA (Annual CTC)",
    skills: ["Deep Learning", "Ranking Algorithms", "PyTorch", "Spark", "A/B Testing"],
    description: "Design machine learning ranking models that power personalized product recommendations for hundreds of millions of shoppers.",
    responsibilities: [
      "Develop deep retrieval and collaborative filtering models deployed in production recommendation pipelines.",
      "Design and evaluate multi-arm bandit online experiments for real-time personalization.",
      "Collaborate with retail business leaders to align discovery algorithms with customer satisfaction goals."
    ],
    education: "Master's or Ph.D. in Computer Science, Machine Learning, or Statistics",
    postedDate: "2026-09-24",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },
  {
    companyId: "amazon",
    title: "Fulfillment Operations Area Manager Trainee",
    category: "Operations",
    subcategory: "Supply Chain Operations",
    location: "Hyderabad, TS",
    workMode: "On-site",
    employmentType: "Full-time",
    experienceLevel: "Fresher",
    experienceRequirement: "Freshers Allowed (0-1 Year)",
    salary: "₹8 – ₹12 LPA (Annual CTC)",
    salaryRange: "₹8 – ₹12 LPA (Annual CTC)",
    skills: ["Warehouse Operations", "Team Leadership", "Process Optimization", "Safety Compliance", "Excel"],
    description: "Lead front-line fulfillment center shifts, ensuring safety standards, inventory accuracy, and on-time outbound delivery.",
    responsibilities: [
      "Supervise daily packing, sorting, and dispatch stations within a modern robotic fulfillment center.",
      "Monitor operational throughput, ergonomics safety, and SLA adherence across warehouse teams.",
      "Conduct continuous improvement Kaizen projects to eliminate processing bottlenecks."
    ],
    education: "Bachelor's degree in Engineering, Business, or Logistics Management",
    postedDate: "2026-09-23",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Apple (adding 1 more job -> total 3)
  {
    companyId: "apple",
    title: "Hardware Engineering & Validation Intern",
    category: "Technology",
    subcategory: "Hardware Engineering",
    location: "Bengaluru, KA",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹20,000 – ₹28,000 / month (Stipend)",
    salaryRange: "₹20,000 – ₹28,000 / month (Stipend)",
    skills: ["Digital Logic", "Verilog / VHDL", "Oscilloscopes", "Signal Integrity", "Python Scripting"],
    description: "Support signal integrity measurements, thermal profiling, and logic testing for next-generation hardware development platforms.",
    responsibilities: [
      "Assist validation engineers in operating high-speed oscilloscopes and logic analyzers.",
      "Write automated Python testing scripts for chip register diagnostics and thermal cycling.",
      "Compile hardware debug logs and track errata reports in internal tracking systems."
    ],
    education: "Pursuing B.Tech / B.E. in Electrical, Electronics, or Computer Engineering",
    postedDate: "2026-09-25",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Meta (adding 1 more job -> total 3)
  {
    companyId: "meta",
    title: "Product Design & Prototyping Intern",
    category: "Design",
    subcategory: "UI/UX Design",
    location: "Gurugram, HR",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹18,000 – ₹25,000 / month (Stipend)",
    salaryRange: "₹18,000 – ₹25,000 / month (Stipend)",
    skills: ["Figma", "Interaction Design", "Prototyping", "User Research", "Visual Design"],
    description: "Design intuitive interfaces, interactive prototypes, and motion micro-interactions across WhatsApp and Instagram interfaces.",
    responsibilities: [
      "Create high-fidelity component mockups and user flow diagrams in Figma.",
      "Conduct usability observation sessions with candidate user cohorts to identify friction points.",
      "Collaborate with mobile engineering teams to ensure pixel-perfect design implementation."
    ],
    education: "Pursuing Bachelor's or Master's in Interaction Design, HCI, or Visual Arts",
    postedDate: "2026-09-24",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Netflix (adding 1 more job -> total 3)
  {
    companyId: "netflix",
    title: "Content Engineering & Streaming Intern",
    category: "Content",
    subcategory: "Digital Media",
    location: "Mumbai, MH",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹18,000 – ₹25,000 / month (Stipend)",
    salaryRange: "₹18,000 – ₹25,000 / month (Stipend)",
    skills: ["Video Encoding", "FFmpeg", "Python", "Streaming Protocols (HLS/DASH)", "Metadata QC"],
    description: "Assist encoding engineers in testing adaptive bitrate profiles, subtitle timing pipelines, and regional metadata localization.",
    responsibilities: [
      "Run automated video quality analysis (VMAF) benchmarks across varying network bandwidth simulations.",
      "Validate audio description tracks and localized subtitle timing across diverse client devices.",
      "Write helper automation scripts to streamline media ingestion QA workflows."
    ],
    education: "Pursuing Degree in Computer Science, Media Technology, or Information Systems",
    postedDate: "2026-09-25",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Spotify (adding 1 more job -> total 3)
  {
    companyId: "spotify",
    title: "Music Editorial & Content Marketing Intern",
    category: "Marketing",
    subcategory: "Content Marketing",
    location: "Mumbai, MH",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹12,000 – ₹18,000 / month (Stipend)",
    salaryRange: "₹12,000 – ₹18,000 / month (Stipend)",
    skills: ["Music Curation", "Social Media Copy", "Content Planning", "Streaming Analytics", "Artist Relations"],
    description: "Assist regional music editors in curating localized playlist ecosystems and developing creative social campaign activations.",
    responsibilities: [
      "Track emerging independent music artists and weekly regional chart trends across languages.",
      "Draft promotional copy for playlist covers, newsletter highlights, and social video snippets.",
      "Analyze track retention data and skip rates to assist senior editors with playlist sequencing."
    ],
    education: "Pursuing Degree in Mass Communication, Media, Journalism, or Arts",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Swiggy (adding 1 more job -> total 3)
  {
    companyId: "swiggy",
    title: "Full Stack Engineer - Instamart Logistics",
    category: "Technology",
    subcategory: "Full Stack Engineering",
    location: "Bengaluru, KA",
    workMode: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    experienceRequirement: "2-4 Years",
    salary: "₹20 – ₹30 LPA (Annual CTC)",
    salaryRange: "₹20 – ₹30 LPA (Annual CTC)",
    skills: ["Node.js", "React", "Kafka", "PostgreSQL", "Microservices"],
    description: "Build ultra-low latency routing and order batching systems for Swiggy Instamart dark-store networks.",
    responsibilities: [
      "Develop real-time picker allocation algorithms minimizing order preparation times to under 3 minutes.",
      "Maintain event-driven message queues handling peak-hour order surges with zero message drop.",
      "Build live inventory reconciliation dashboards for dark-store warehouse managers."
    ],
    education: "B.Tech / B.E. in Computer Science or Information Technology",
    postedDate: "2026-09-25",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Zomato (adding 1 more job -> total 3)
  {
    companyId: "zomato",
    title: "Product Management Intern - Dining Out & Events",
    category: "Product",
    subcategory: "Product Management",
    location: "Gurugram, HR",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹14,000 – ₹20,000 / month (Stipend)",
    salaryRange: "₹14,000 – ₹20,000 / month (Stipend)",
    skills: ["Product Analytics", "User Interviews", "Wireframing", "SQL", "Market Research"],
    description: "Collaborate with dining product managers to improve table reservation conversion funnels and ticketing flows for live events.",
    responsibilities: [
      "Synthesize feedback from restaurant partners and app users into structured feature problem statements.",
      "Create interactive prototype wireframes and test booking UX with test user panels.",
      "Track post-launch drop-off metrics across the payment confirmation journey."
    ],
    education: "Pursuing Bachelor's or Master's in Business, Engineering, or Design",
    postedDate: "2026-09-24",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Flipkart (adding 1 more job -> total 3)
  {
    companyId: "flipkart",
    title: "Supply Chain Analytics Intern",
    category: "Operations",
    subcategory: "Data & Operations",
    location: "Bengaluru, KA",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹15,000 – ₹22,000 / month (Stipend)",
    salaryRange: "₹15,000 – ₹22,000 / month (Stipend)",
    skills: ["SQL", "Python", "Tableau", "Logistics Metrics", "Spreadsheet Modeling"],
    description: "Analyze middle-mile freight truck turn-around times and hub sorting throughput to identify logistics cost efficiencies.",
    responsibilities: [
      "Build automated Tableau dashboards tracking hub dispatch delays and driver turnaround times.",
      "Analyze historical festive season package volume spikes to model capacity requirements.",
      "Support senior supply chain leads in preparing quarterly operational performance briefs."
    ],
    education: "Pursuing Degree in Industrial Engineering, Statistics, or Supply Chain Management",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Razorpay (adding 1 more job -> total 3)
  {
    companyId: "razorpay",
    title: "Backend Engineering Intern - Payment Gateways",
    category: "Technology",
    subcategory: "Backend Engineering",
    location: "Bengaluru, KA",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹20,000 – ₹28,000 / month (Stipend)",
    salaryRange: "₹20,000 – ₹28,000 / month (Stipend)",
    skills: ["Go", "PHP", "MySQL", "API Design", "Data Structures"],
    description: "Gain real-world experience building mission-critical payment orchestration APIs handling thousands of transactions per second.",
    responsibilities: [
      "Write automated integration tests for banking partner payment switch webhooks.",
      "Optimize database queries and caching layers to minimize checkout redirect latency.",
      "Participate in incident post-mortem reviews and learn idempotent transaction handling."
    ],
    education: "Pursuing B.Tech / B.E. in Computer Science or related engineering discipline",
    postedDate: "2026-09-27",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // TCS (adding 1 more job -> total 3)
  {
    companyId: "tcs",
    title: "Cloud Infrastructure & Testing Intern",
    category: "Technology",
    subcategory: "Quality Assurance",
    location: "Chennai, TN",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹15,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹15,000 / month (Stipend)",
    skills: ["Selenium", "Java", "Test Automation", "SQL", "Agile Basics"],
    description: "Learn enterprise software testing methodologies by building automated test suites for global banking and retail clients.",
    responsibilities: [
      "Develop automated regression test scripts using Selenium WebDriver and Java.",
      "Document test cases, trace requirement matrices, and log defect tickets in Jira.",
      "Verify system functionality across browser versions and cloud environments."
    ],
    education: "Pursuing B.Tech / B.E. / MCA in Computer Science or Information Technology",
    postedDate: "2026-09-25",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Infosys (adding 1 more job -> total 3)
  {
    companyId: "infosys",
    title: "Technology Support & Network Operations Intern",
    category: "Operations",
    subcategory: "IT Operations",
    location: "Mysuru, KA",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹14,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹14,000 / month (Stipend)",
    skills: ["Linux Fundamentals", "Networking (TCP/IP)", "Bash Scripting", "Troubleshooting", "Hardware Support"],
    description: "Participate in global infrastructure monitoring, diagnostic triage, and server maintenance at the Infosys Global Education Center.",
    responsibilities: [
      "Monitor server uptime telemetry and escalate network routing incidents to level 2 support engineers.",
      "Assist in configuring developer laptops, virtual machines, and enterprise VPN security profiles.",
      "Maintain knowledge base articles documenting common workstation resolution workflows."
    ],
    education: "Pursuing Diploma or Bachelor's in IT, Computer Applications, or Electronics",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Wipro (adding 1 more job -> total 3)
  {
    companyId: "wipro",
    title: "Cybersecurity Analyst Intern - SOC Operations",
    category: "Cybersecurity",
    subcategory: "Security Operations",
    location: "Bengaluru, KA",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹16,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹16,000 / month (Stipend)",
    skills: ["Network Security", "Wireshark", "Vulnerability Assessment", "Python Basics", "Log Analysis"],
    description: "Shadow experienced SOC analysts in tracking threat feeds, parsing firewall logs, and investigating phishing email reports.",
    responsibilities: [
      "Review daily vulnerability scan outputs and categorize findings by CVSS severity score.",
      "Assist in inspecting suspicious email headers and attachment sandboxing reports.",
      "Learn compliance audit procedures aligned with ISO 27001 and SOC2 standards."
    ],
    education: "Pursuing Degree in Cybersecurity, Computer Science, or Information Technology",
    postedDate: "2026-09-27",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Deloitte (adding 1 more job -> total 3)
  {
    companyId: "deloitte",
    title: "Strategy & Management Consulting Analyst Intern",
    category: "Consulting",
    subcategory: "Management Consulting",
    location: "Mumbai, MH",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹15,000 – ₹22,000 / month (Stipend)",
    salaryRange: "₹15,000 – ₹22,000 / month (Stipend)",
    skills: ["Market Research", "Financial Modeling", "PowerPoint Storytelling", "Excel", "Data Analysis"],
    description: "Support client engagement teams with secondary industry research, competitive benchmarking, and executive slide synthesis.",
    responsibilities: [
      "Conduct in-depth market size and growth driver assessments for consumer and industrial clients.",
      "Build financial valuation templates and cost-benefit sensitivity models in Excel.",
      "Synthesize qualitative client workshop findings into polished PowerPoint presentation decks."
    ],
    education: "Pursuing Bachelor's in Economics, Commerce, Engineering, or Management",
    postedDate: "2026-09-25",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Accenture (adding 1 more job -> total 3)
  {
    companyId: "accenture",
    title: "Technology Consulting Intern - Cloud Architecture",
    category: "Consulting",
    subcategory: "Technology Consulting",
    location: "Gurugram, HR",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹14,000 – ₹20,000 / month (Stipend)",
    salaryRange: "₹14,000 – ₹20,000 / month (Stipend)",
    skills: ["Cloud Concepts", "Business Analysis", "Process Mapping", "Requirements Gathering", "Agile"],
    description: "Assist technology consultants in mapping legacy application architectures and planning cloud migration roadmaps.",
    responsibilities: [
      "Document current-state IT application inventories and dependency diagrams for client stakeholders.",
      "Conduct functional requirements gathering sessions and draft user story acceptance criteria.",
      "Prepare weekly project milestone status trackers and risk log summaries."
    ],
    education: "Pursuing B.Tech / B.E. / BBA in Information Systems or Computer Science",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Goldman Sachs (adding 1 more job -> total 3)
  {
    companyId: "goldmansachs",
    title: "Financial Analyst Intern - Global Investment Research",
    category: "Finance",
    subcategory: "Investment Research",
    location: "Bengaluru, KA",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹22,000 – ₹30,000 / month (Stipend)",
    salaryRange: "₹22,000 – ₹30,000 / month (Stipend)",
    skills: ["Financial Statements", "Valuation", "Excel Modeling", "Accounting", "Bloomberg Basics"],
    description: "Support equity research analysts in updating DCF valuation models, listening to corporate earnings calls, and parsing quarterly reports.",
    responsibilities: [
      "Extract financial line items from 10-K and 10-Q filings into standardized earnings models.",
      "Track macroeconomic indicators, commodity prices, and central bank interest rate announcements.",
      "Draft concise research briefs summarizing industry news and sector valuation multiples."
    ],
    education: "Pursuing Degree in Finance, Economics, Commerce, or CFA Candidate",
    postedDate: "2026-09-24",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // HDFC Bank (adding 1 more job -> total 3)
  {
    companyId: "hdfc",
    title: "Retail Banking & Customer Experience Intern",
    category: "Finance",
    subcategory: "Retail Banking",
    location: "Mumbai, MH",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹8,000 – ₹14,000 / month (Stipend)",
    salaryRange: "₹8,000 – ₹14,000 / month (Stipend)",
    skills: ["Banking Operations", "Customer Support", "KYC Compliance", "Communication", "Financial Products"],
    description: "Learn branch operations, digital onboarding workflows, and priority customer relationship management at HDFC Bank branches.",
    responsibilities: [
      "Guide walk-in branch customers through mobile app registration and net banking self-service features.",
      "Verify documentation completeness for savings accounts, fixed deposits, and debit card re-issuances.",
      "Assist relationship managers with daily customer query resolution and compliance record keeping."
    ],
    education: "Pursuing Degree in Commerce, Business Administration, or Economics",
    postedDate: "2026-09-27",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // boAt (adding 1 more job -> total 3)
  {
    companyId: "boat",
    title: "Audio DSP & Firmware Engineering Intern",
    category: "Technology",
    subcategory: "Embedded Systems",
    location: "Bengaluru, KA",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹12,000 – ₹18,000 / month (Stipend)",
    salaryRange: "₹12,000 – ₹18,000 / month (Stipend)",
    skills: ["Embedded C", "Digital Signal Processing", "Bluetooth Audio (BLE)", "Acoustic Tuning", "MATLAB"],
    description: "Work with boAt audio engineers on frequency response calibration, active noise cancellation tuning, and Bluetooth firmware testing.",
    responsibilities: [
      "Perform acoustic measurements using artificial head simulators and audio spectrum analyzers.",
      "Test Bluetooth audio latency and pairing reconnection stability across various smartphone brands.",
      "Flash and debug microcontroller firmware for upcoming wireless earbud releases."
    ],
    education: "Pursuing B.Tech / B.E. in Electronics, Communication, or Electrical Engineering",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Nike (adding 1 more job -> total 3)
  {
    companyId: "nike",
    title: "Digital Commerce & Consumer Experience Intern",
    category: "Marketing",
    subcategory: "E-Commerce Marketing",
    location: "Bengaluru, KA",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹16,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹16,000 / month (Stipend)",
    skills: ["Digital Merchandising", "E-Commerce Analytics", "Content Management", "Customer Engagement", "SEO Basics"],
    description: "Support digital product catalog publishing, seasonal launch campaigns, and app engagement analysis on the Nike App.",
    responsibilities: [
      "Audit product imagery, sizing specs, and localized copy across sport categories.",
      "Track click-through rates and add-to-cart conversion across promotional app banners.",
      "Coordinate with logistics teams to monitor member order fulfillment satisfaction ratings."
    ],
    education: "Pursuing Degree in Marketing, Fashion Management, Business, or Communications",
    postedDate: "2026-09-25",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Epic Games (adding 1 more job -> total 3)
  {
    companyId: "epicgames",
    title: "Game QA & Technical Playtesting Intern",
    category: "Technology",
    subcategory: "Quality Assurance",
    location: "Noida, UP",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹15,000 – ₹24,000 / month (Stipend)",
    salaryRange: "₹15,000 – ₹24,000 / month (Stipend)",
    skills: ["Bug Tracking (Jira)", "Game Testing", "Unreal Engine Basics", "Crash Log Analysis", "Gameplay Feedback"],
    description: "Execute functional test suites, stress test multiplayer server matches, and log detailed reproduction steps for Unreal Engine titles.",
    responsibilities: [
      "Playtest weekly build iterations to discover visual glitches, collision holes, and audio sync anomalies.",
      "Capture console crash logs and write concise bug tickets with clear video reproduction proof.",
      "Verify bug fixes submitted by physics and rendering programmers before release builds."
    ],
    education: "Pursuing Degree in Game Development, Computer Science, or Media Arts",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Riot Games (adding 1 more job -> total 3)
  {
    companyId: "riotgames",
    title: "Player Community & Content Operations Intern",
    category: "Content",
    subcategory: "Community & Content",
    location: "Mumbai, MH",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹12,000 – ₹18,000 / month (Stipend)",
    salaryRange: "₹12,000 – ₹18,000 / month (Stipend)",
    skills: ["Gaming Community", "Discord Moderation", "Content Writing", "Esports Knowledge", "Social Media"],
    description: "Engage regional gaming communities, coordinate local tournament viewing parties, and draft game patch breakdown articles.",
    responsibilities: [
      "Monitor player sentiment and technical feedback across official Discord and social channels.",
      "Draft engaging tournament highlight recaps and localized social media updates.",
      "Coordinate student esports ambassadors across colleges and gaming cafes."
    ],
    education: "Pursuing Degree in Mass Media, Communications, or English",
    postedDate: "2026-09-27",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Uber (adding 1 more job -> total 3)
  {
    companyId: "uber",
    title: "Driver Operations & Safety Support Intern",
    category: "Operations",
    subcategory: "Operations Management",
    location: "Hyderabad, TS",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹12,000 – ₹18,000 / month (Stipend)",
    salaryRange: "₹12,000 – ₹18,000 / month (Stipend)",
    skills: ["Operations Analysis", "Customer Support", "Driver Partner Engagement", "SQL Basics", "Incident Triage"],
    description: "Assist city operations teams in reviewing driver onboarding documentation, vehicle fitness verification, and safety incident tickets.",
    responsibilities: [
      "Audit driver license and vehicle background check documents for onboarding compliance.",
      "Analyze rider feedback trends to pinpoint high-cancellation pickup hotspots in metro areas.",
      "Help coordinate community safety training workshops for new driver partners."
    ],
    education: "Pursuing Degree in Business Administration, Operations, or Social Sciences",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Airbnb (adding 1 more job -> total 3)
  {
    companyId: "airbnb",
    title: "Community Host Operations Intern",
    category: "Operations",
    subcategory: "Community Operations",
    location: "Gurugram, HR",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹16,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹16,000 / month (Stipend)",
    skills: ["Hospitality Operations", "Customer Service", "Listing Quality Assurance", "Communication", "Data Entry"],
    description: "Support the India host community with listing optimization guidance, quality standards compliance, and host webinar coordination.",
    responsibilities: [
      "Review new homestay photo listings to ensure compliance with Airbnb photography and safety standards.",
      "Provide step-by-step assistance to new hosts setting up calendar availability and instant book settings.",
      "Collect feedback from regional host meetups and document recurring platform feature requests."
    ],
    education: "Pursuing Degree in Hospitality Management, Tourism, Business, or Communications",
    postedDate: "2026-09-25",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Tesla (adding 1 more job -> total 3)
  {
    companyId: "tesla",
    title: "Embedded Telemetry & Diagnostics Intern",
    category: "Technology",
    subcategory: "Embedded Software",
    location: "Bengaluru, KA",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹20,000 – ₹30,000 / month (Stipend)",
    salaryRange: "₹20,000 – ₹30,000 / month (Stipend)",
    skills: ["C/C++", "CAN Bus Protocol", "Python", "Linux", "Embedded Debugging"],
    description: "Work with vehicle software teams to inspect real-time sensor logs, battery pack thermal telemetry, and over-the-air firmware updates.",
    responsibilities: [
      "Analyze CAN bus message logs for intermittent sensor communication dropouts.",
      "Write automated Python scripts to validate vehicle battery telemetry data streams.",
      "Assist in running firmware flashing regression tests on vehicle test benches."
    ],
    education: "Pursuing B.Tech / B.E. in Electrical, Electronics, Automotive, or Computer Engineering",
    postedDate: "2026-09-24",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Starbucks (adding 1 more job -> total 3)
  {
    companyId: "starbucks",
    title: "Store Operations & Customer Experience Intern",
    category: "Operations",
    subcategory: "Retail Operations",
    location: "Mumbai, MH",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹8,000 – ₹12,000 / month (Stipend)",
    salaryRange: "₹8,000 – ₹12,000 / month (Stipend)",
    skills: ["Hospitality", "Customer Service", "Inventory Stocking", "Teamwork", "Food Safety"],
    description: "Learn retail store excellence, beverage crafting standards, and hospitality inventory management at Starbucks flagship stores.",
    responsibilities: [
      "Assist baristas with customer beverage orders and POS order entry during peak morning rushes.",
      "Maintain cleanliness, merchandise shelf display, and inventory stocking in the front-of-house area.",
      "Learn and strictly adhere to food safety guidelines and customer satisfaction standards."
    ],
    education: "Pursuing Degree in Hotel Management, Hospitality, Business, or General Studies",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // McDonald's (adding 1 more job -> total 3)
  {
    companyId: "mcdonalds",
    title: "Restaurant Supply & Quality Assurance Intern",
    category: "Operations",
    subcategory: "Quality Assurance",
    location: "Mumbai, MH",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹8,000 – ₹12,000 / month (Stipend)",
    salaryRange: "₹8,000 – ₹12,000 / month (Stipend)",
    skills: ["Quality Control", "Food Safety (HACCP)", "Supply Chain Auditing", "Data Entry", "Temperature Logs"],
    description: "Support quality assurance managers in auditing cold chain distribution temperatures, raw material freshness, and kitchen compliance.",
    responsibilities: [
      "Record and review daily temperature logs for cold storage distribution trucks and restaurant freezers.",
      "Participate in mock supplier quality audits following global HACCP food safety standards.",
      "Help compile monthly supplier compliance performance reports for supply chain leadership."
    ],
    education: "Pursuing Degree in Food Technology, Microbiology, Chemistry, or Operations",
    postedDate: "2026-09-27",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Coca-Cola (adding 1 more job -> total 3)
  {
    companyId: "cocacola",
    title: "Brand Activations & Trade Marketing Intern",
    category: "Marketing",
    subcategory: "Trade Marketing",
    location: "Gurugram, HR",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹15,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹15,000 / month (Stipend)",
    skills: ["Trade Marketing", "Retail Audits", "Merchandising", "Field Engagement", "Event Coordination"],
    description: "Assist regional marketing managers with college campus activations, retail cooler merchandising audits, and festival event branding.",
    responsibilities: [
      "Visit partner grocery stores and supermarkets to verify visual cooler placement and promotional point-of-sale displays.",
      "Coordinate sampling booths and merchandise distribution at college fests and sporting tournaments.",
      "Submit weekly photographic audit logs summarizing retail display compliance across assigned territories."
    ],
    education: "Pursuing Degree in Marketing, Commerce, Business Administration, or Mass Media",
    postedDate: "2026-09-25",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Air India (adding 1 more job -> total 3)
  {
    companyId: "airindia",
    title: "Airport Customer Services & Passenger Experience Intern",
    category: "Operations",
    subcategory: "Aviation Operations",
    location: "New Delhi, DL",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹15,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹15,000 / month (Stipend)",
    skills: ["Aviation Customer Service", "Passenger Handling", "Communication", "Problem Solving", "Conflict Resolution"],
    description: "Gain front-line aviation hospitality experience assisting airport duty managers with passenger boarding, transit queries, and baggage tracing.",
    responsibilities: [
      "Assist transit and special-assistance passengers through security checkpoints and departure boarding gates.",
      "Help passengers navigate self-check-in baggage kiosks at Terminal 3 departure halls.",
      "Log baggage inquiry tickets and coordinate with the ramp services team for prompt delivery."
    ],
    education: "Pursuing Degree in Aviation Hospitality, Tourism, Business Administration, or Hotel Management",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Tata Digital (adding 1 more job -> total 3)
  {
    companyId: "tatadigital",
    title: "Neu Loyalty & Customer Lifecycle Marketing Intern",
    category: "Marketing",
    subcategory: "Lifecycle Marketing",
    location: "Mumbai, MH",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹12,000 – ₹18,000 / month (Stipend)",
    salaryRange: "₹12,000 – ₹18,000 / month (Stipend)",
    skills: ["Customer Lifecycle", "Email Marketing", "Loyalty Programs", "CleverTap / MoEngage", "Copywriting"],
    description: "Help design push notification calendars, loyalty NeuCoin earn-and-burn campaigns, and personalized customer segment emails.",
    responsibilities: [
      "Draft engaging promotional copy for app push notifications and WhatsApp customer updates.",
      "Set up A/B subject line tests in marketing automation platforms and monitor open rates.",
      "Analyze cross-brand redemption patterns across grocery, electronics, and fashion categories."
    ],
    education: "Pursuing Degree in Marketing, Commerce, Business, or Mass Media",
    postedDate: "2026-09-27",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // BookMyShow (adding 1 more job -> total 3)
  {
    companyId: "bookmyshow",
    title: "Live Entertainment & Festival Operations Intern",
    category: "Operations",
    subcategory: "Events & Operations",
    location: "Mumbai, MH",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹16,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹16,000 / month (Stipend)",
    skills: ["Event Operations", "On-Ground Management", "Ticket Scanning", "Crowd Coordination", "Vendor Liaison"],
    description: "Support on-ground live event operations for major concerts, theatre festivals, and stadium sports tournaments managed by BookMyShow.",
    responsibilities: [
      "Assist in setting up RFID wristband collection counters and electronic ticket turnstiles at event venues.",
      "Coordinate with stadium security and medical first-aid teams to ensure seamless crowd ingress.",
      "Troubleshoot attendee mobile ticketing issues and resolve entry barcode scanner errors."
    ],
    education: "Pursuing Degree in Event Management, Mass Media, Business, or Arts",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Anthropic (adding 1 more job -> total 3)
  {
    companyId: "anthropic",
    title: "AI Safety & Red-Teaming Research Intern",
    category: "Cybersecurity",
    subcategory: "AI Safety",
    location: "Bengaluru, KA",
    workMode: "Remote",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹25,000 – ₹35,000 / month (Stipend)",
    salaryRange: "₹25,000 – ₹35,000 / month (Stipend)",
    skills: ["Prompt Engineering", "Adversarial Testing", "Python", "LLM Evaluation", "Ethics in AI"],
    description: "Test Claude models against jailbreak prompts, cyber misuse vectors, and ethical edge cases to identify systemic safety gaps.",
    responsibilities: [
      "Design diverse adversarial prompt attack suites evaluating model refusal boundaries.",
      "Categorize model failure modes and contribute to standardized safety evaluation benchmarks.",
      "Collaborate with alignment research scientists to evaluate constitutional AI training responses."
    ],
    education: "Pursuing Degree in Computer Science, Cognitive Science, Philosophy, or AI Ethics",
    postedDate: "2026-09-27",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // DeepMind (adding 1 more job -> total 3)
  {
    companyId: "deepmind",
    title: "Reinforcement Learning Research Intern",
    category: "Data & AI",
    subcategory: "Reinforcement Learning",
    location: "Bengaluru, KA",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹25,000 – ₹35,000 / month (Stipend)",
    salaryRange: "₹25,000 – ₹35,000 / month (Stipend)",
    skills: ["Python", "JAX / PyTorch", "Reinforcement Learning", "Mathematics / Linear Algebra", "Simulation Environments"],
    description: "Conduct algorithmic research on agent exploration, reward shaping, and sample-efficient policy learning in simulated physics environments.",
    responsibilities: [
      "Implement and evaluate benchmark RL algorithms (PPO, SAC, MPO) in custom simulation environments.",
      "Analyze training curves, policy stability, and hyperparameter sensitivity on TPU clusters.",
      "Document experimental methodology and contribute to internal research papers."
    ],
    education: "Pursuing Master's or Ph.D. in Computer Science, Machine Learning, or Applied Mathematics",
    postedDate: "2026-09-25",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // OpenAI (adding 1 more job -> total 3)
  {
    companyId: "openai",
    title: "Model Evaluation & Human Feedback Intern",
    category: "Data & AI",
    subcategory: "LLM Evaluation",
    location: "Bengaluru, KA",
    workMode: "Remote",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹25,000 – ₹35,000 / month (Stipend)",
    salaryRange: "₹25,000 – ₹35,000 / month (Stipend)",
    skills: ["Python", "Human Feedback (RLHF)", "Dataset Quality", "LLM APIs", "Data Annotation"],
    description: "Build rigorous evaluation suites assessing reasoning, coding accuracy, and instruction following across next-generation OpenAI models.",
    responsibilities: [
      "Write automated evaluation scripts testing multi-step mathematical reasoning and code synthesis.",
      "Curate high-signal comparison pairs for reinforcement learning from human feedback (RLHF) pipelines.",
      "Analyze model error distributions and propose dataset balance corrections to research engineers."
    ],
    education: "Pursuing Degree in Computer Science, Linguistics, Mathematics, or Data Science",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Chess.com (adding 1 more job -> total 3)
  {
    companyId: "chessdotcom",
    title: "Chess Content & Community Operations Intern",
    category: "Content",
    subcategory: "Content & Community",
    location: "Bengaluru, KA",
    workMode: "Remote",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹16,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹16,000 / month (Stipend)",
    skills: ["Chess Knowledge (1500+ FIDE/Chess.com)", "Social Video Editing", "Discord", "Community Management", "Copywriting"],
    description: "Create engaging tactical puzzle clips, assist in broadcasting major online blitz tournaments, and moderate player community forums.",
    responsibilities: [
      "Clip brilliant moves and blunders from top grandmaster streams for short-form social videos.",
      "Review tactical puzzle submissions and verify solution tree accuracy using Stockfish engine analysis.",
      "Help coordinate community club tournaments and answer user tournament pairing questions."
    ],
    education: "Pursuing Degree in Any Field, Active Chess Player (1500+ Rating)",
    postedDate: "2026-09-27",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Jio (adding 1 more job -> total 3)
  {
    companyId: "jio",
    title: "5G Core Network & Telecom Operations Intern",
    category: "Technology",
    subcategory: "Telecom Engineering",
    location: "Navi Mumbai, MH",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹12,000 – ₹18,000 / month (Stipend)",
    salaryRange: "₹12,000 – ₹18,000 / month (Stipend)",
    skills: ["5G Telecom Architecture", "Linux", "Wireshark", "Network Protocols", "Python"],
    description: "Gain hands-on telecommunications experience monitoring 5G Standalone core call flows, gNodeB cell uptime, and latency optimization.",
    responsibilities: [
      "Capture and inspect packet traces for 5G session management and authentication signaling failures.",
      "Monitor cell tower traffic handover performance metrics across urban deployment clusters.",
      "Assist network engineers in verifying fiber backhaul router connectivity and QoS SLAs."
    ],
    education: "Pursuing B.Tech / B.E. in Electronics, Telecommunications, or Information Technology",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Airtel (adding 1 more job -> total 3)
  {
    companyId: "airtel",
    title: "Digital Sales & Customer Acquisition Intern",
    category: "Sales",
    subcategory: "Direct Sales",
    location: "Gurugram, HR",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹15,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹15,000 / month (Stipend)",
    skills: ["B2B Lead Generation", "Cold Calling", "CRM (Salesforce)", "Communication", "Negotiation"],
    description: "Assist regional enterprise sales managers in mapping SME business parks, identifying broadband prospects, and booking corporate demos.",
    responsibilities: [
      "Prospect and qualify small-business leads for Airtel Xstream Fiber and cloud telephony plans.",
      "Conduct introductory telephone calls and schedule field consultations for senior account managers.",
      "Log sales interaction notes and pipeline deal stages in Salesforce CRM."
    ],
    education: "Pursuing Degree in Business Administration, Marketing, or Commerce",
    postedDate: "2026-09-27",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Airtel Digital (adding 1 more job -> total 3)
  {
    companyId: "airteldigital",
    title: "Frontend Engineering Intern - Airtel Thanks App",
    category: "Technology",
    subcategory: "Frontend Development",
    location: "Gurugram, HR",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹15,000 – ₹22,000 / month (Stipend)",
    salaryRange: "₹15,000 – ₹22,000 / month (Stipend)",
    skills: ["React Native", "JavaScript", "HTML/CSS", "Mobile Performance", "Git"],
    description: "Work on consumer mobile feature components, recharge flows, and interactive widgets inside the Airtel Thanks super-app.",
    responsibilities: [
      "Build modular UI screens using React Native aligned with Airtel's design token system.",
      "Optimize image asset caching and bundle startup time on mid-range Android devices.",
      "Write unit tests and test widget responsiveness across varying screen sizes."
    ],
    education: "Pursuing B.Tech / B.E. in Computer Science or IT",
    postedDate: "2026-09-25",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Samsung (adding 1 more job -> total 3)
  {
    companyId: "samsung",
    title: "Android System Software Intern - R&D Institute",
    category: "Technology",
    subcategory: "Android OS",
    location: "Bengaluru, KA",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹18,000 – ₹26,000 / month (Stipend)",
    salaryRange: "₹18,000 – ₹26,000 / month (Stipend)",
    skills: ["C/C++", "Java / Kotlin", "Android Framework (AOSP)", "Linux Kernel", "Debugging"],
    description: "Support Samsung R&D engineers in profiling Android One UI framework performance, power consumption, and camera sensor pipelines.",
    responsibilities: [
      "Trace Android framework app launch bottlenecks using Systrace and Perfetto profiling tools.",
      "Build test driver modules for hardware abstraction layer (HAL) sensor communication.",
      "Debug crash logs and memory leaks using Android Debug Bridge (ADB) on prototype devices."
    ],
    education: "Pursuing B.Tech / B.E. in Computer Science, Information Technology, or Electronics",
    postedDate: "2026-09-26",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // Adidas (adding 1 more job -> total 3)
  {
    companyId: "adidas",
    title: "Sports Marketing & Grassroots Activation Intern",
    category: "Marketing",
    subcategory: "Sports Marketing",
    location: "Gurugram, HR",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹16,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹16,000 / month (Stipend)",
    skills: ["Sports Marketing", "Event Planning", "Athlete Coordination", "Social Media", "Field Research"],
    description: "Support community running clubs, school football leagues, and athlete sponsorship brand activations across metro cities.",
    responsibilities: [
      "Coordinate product trial gear and hydration stations for weekly adidas Runners community sessions.",
      "Assist in managing logistics for sponsored athlete appearances and retail flagship meet-and-greets.",
      "Collect participant feedback and photo content for weekly regional marketing newsletters."
    ],
    education: "Pursuing Degree in Sports Management, Marketing, Business, or Communications",
    postedDate: "2026-09-27",
    applicationDeadline: "2026-12-31",
    status: "Active"
  },

  // H&M (adding 1 more job -> total 3)
  {
    companyId: "handm",
    title: "Sustainable Fashion & Circularity Operations Intern",
    category: "Operations",
    subcategory: "Sustainability Operations",
    location: "Bengaluru, KA",
    workMode: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship",
    experienceRequirement: "Students & Recent Graduates (Internship)",
    salary: "₹10,000 – ₹15,000 / month (Stipend)",
    salaryRange: "₹10,000 – ₹15,000 / month (Stipend)",
    skills: ["Sustainability", "Supply Chain Auditing", "Textile Recycling", "Excel", "Data Collection"],
    description: "Support H&M retail garment recycling programs, fabric reuse logistics, and store energy conservation tracking.",
    responsibilities: [
      "Audit monthly garment collection box weights across regional H&M store locations.",
      "Track textile recycling vendor shipment dispatch logs and certificate of destruction records.",
      "Compile educational briefing packs on sustainable fashion choices for retail store staff."
    ],
    education: "Pursuing Degree in Environmental Studies, Textile Design, Fashion Technology, or Sustainability",
    postedDate: "2026-09-25",
    applicationDeadline: "2026-12-31",
    status: "Active"
  }
];

console.log(`Prepared ${additionalJobs.length} additional rich jobs.`);

// Let's read the 154 existing jobs, fix salary formatting for all, and then append additional jobs
// Use regex or parsing on existingJobsContent
const jobBlockRegex = /{\s*id:\s*['"](job-\d+)['"][\s\S]*?companyId:\s*['"]([^'"]+)['"][\s\S]*?title:\s*['"]([^'"]+)['"][\s\S]*?category:\s*['"]([^'"]+)['"][\s\S]*?subcategory:\s*['"]([^'"]+)['"][\s\S]*?location:\s*['"]([^'"]+)['"][\s\S]*?workMode:\s*['"]([^'"]+)['"][\s\S]*?employmentType:\s*['"]([^'"]+)['"][\s\S]*?experienceLevel:\s*['"]([^'"]+)['"][\s\S]*?experienceRequirement:\s*['"]([^'"]+)['"][\s\S]*?salaryRange:\s*['"]([^'"]+)['"][\s\S]*?salary:\s*['"]([^'"]+)['"][\s\S]*?skills:\s*(\[[^\]]+\])[\s\S]*?description:\s*['"]([^'"]+)['"][\s\S]*?responsibilities:\s*(\[[^\]]+\])[\s\S]*?educationRequirements:\s*['"]([^'"]+)['"][\s\S]*?education:\s*['"]([^'"]+)['"][\s\S]*?postedAt:\s*['"]([^'"]+)['"][\s\S]*?postedDate:\s*['"]([^'"]+)['"][\s\S]*?applicationDeadline:\s*['"]([^'"]+)['"][\s\S]*?deadline:\s*['"]([^'"]+)['"][\s\S]*?status:\s*['"]([^'"]+)['"]/g;

const parsedExisting = [];
while ((match = jobBlockRegex.exec(existingJobsContent)) !== null) {
  let sal = match[12];
  let emp = match[8];
  let expLevel = match[9];

  // Specific fix for job-005 (Amazon SDE intern)
  if (match[1] === 'job-005') {
    sal = '₹25,000 – ₹35,000 / month (Stipend)';
  } else if (match[1] === 'job-115') {
    sal = '₹15,000 – ₹22,000 / month (Stipend)';
  } else if (emp.toLowerCase().includes('intern')) {
    if (!sal.toLowerCase().includes('stipend')) {
      sal = `${sal} (Stipend)`;
    }
  } else {
    // Full time roles: make sure it says (Annual CTC) or LPA
    if (!sal.includes('LPA') && !sal.includes('Annual') && !sal.includes('CTC')) {
      sal = `${sal} LPA (Annual CTC)`;
    } else if (sal.includes('LPA') && !sal.includes('Annual CTC')) {
      sal = `${sal} (Annual CTC)`;
    }
  }

  let skillsArr, respArr;
  try {
    skillsArr = JSON.parse(match[13]);
  } catch(e) {
    skillsArr = match[13].replace(/[\[\]"]/g, '').split(',').map(s => s.trim());
  }
  try {
    respArr = JSON.parse(match[15]);
  } catch(e) {
    respArr = match[15].split('",').map(s => s.replace(/[\[\]"]/g, '').trim());
  }

  parsedExisting.push({
    id: match[1],
    companyId: match[2],
    title: match[3],
    category: match[4],
    subcategory: match[5],
    location: match[6],
    workMode: match[7],
    employmentType: emp,
    experienceLevel: expLevel,
    experienceRequirement: match[10],
    salaryRange: sal,
    salary: sal,
    skills: skillsArr,
    description: match[14],
    responsibilities: respArr,
    educationRequirements: match[16],
    education: match[17],
    postedAt: match[18],
    postedDate: match[19],
    applicationDeadline: match[20],
    deadline: match[21],
    status: match[22]
  });
}

console.log(`Parsed ${parsedExisting.length} existing jobs.`);

// Append additional jobs with unique sequential IDs
let currentIdNum = parsedExisting.length + 1;
additionalJobs.forEach(aj => {
  const paddedId = `job-${String(currentIdNum).padStart(3, '0')}`;
  currentIdNum++;
  parsedExisting.push({
    id: paddedId,
    companyId: aj.companyId,
    title: aj.title,
    category: aj.category,
    subcategory: aj.subcategory,
    location: aj.location,
    workMode: aj.workMode,
    employmentType: aj.employmentType,
    experienceLevel: aj.experienceLevel,
    experienceRequirement: aj.experienceRequirement,
    salaryRange: aj.salaryRange,
    salary: aj.salary,
    skills: aj.skills,
    description: aj.description,
    responsibilities: aj.responsibilities,
    educationRequirements: aj.education,
    education: aj.education,
    postedAt: aj.postedDate,
    postedDate: aj.postedDate,
    applicationDeadline: aj.applicationDeadline,
    deadline: aj.applicationDeadline,
    status: aj.status
  });
});

console.log(`Final total jobs: ${parsedExisting.length}`);

// Output new jobs.js
let outputCode = `/**
 * RoleCompass Comprehensive Job Directory
 * Every company has AT LEAST two distinct, relevant job roles covering
 * all 12 canonical categories and the complete career experience spectrum.
 * 
 * Includes realistic monthly stipends for internships and clearly labeled
 * annual CTC compensation benchmarks for full-time opportunities.
 */

export const mockJobs = [\n`;

parsedExisting.forEach((j, index) => {
  outputCode += `  {
    id: ${JSON.stringify(j.id)},
    companyId: ${JSON.stringify(j.companyId)},
    title: ${JSON.stringify(j.title)},
    category: ${JSON.stringify(j.category)},
    subcategory: ${JSON.stringify(j.subcategory)},
    location: ${JSON.stringify(j.location)},
    workMode: ${JSON.stringify(j.workMode)},
    employmentType: ${JSON.stringify(j.employmentType)},
    experienceLevel: ${JSON.stringify(j.experienceLevel)},
    experienceRequirement: ${JSON.stringify(j.experienceRequirement)},
    salaryRange: ${JSON.stringify(j.salaryRange)},
    salary: ${JSON.stringify(j.salary)},
    skills: ${JSON.stringify(j.skills)},
    description: ${JSON.stringify(j.description)},
    responsibilities: ${JSON.stringify(j.responsibilities, null, 6).replace(/\n\s*/g, '\n      ')},
    educationRequirements: ${JSON.stringify(j.educationRequirements)},
    education: ${JSON.stringify(j.education)},
    postedAt: ${JSON.stringify(j.postedAt)},
    postedDate: ${JSON.stringify(j.postedDate)},
    applicationDeadline: ${JSON.stringify(j.applicationDeadline)},
    deadline: ${JSON.stringify(j.deadline)},
    status: ${JSON.stringify(j.status)}
  }${index < parsedExisting.length - 1 ? ',' : ''}\n`;
});

outputCode += `];\n`;

fs.writeFileSync('src/data/jobs.js', outputCode, 'utf8');
console.log('Successfully wrote expanded and normalized job catalogue to src/data/jobs.js!');
