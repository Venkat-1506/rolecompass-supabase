import fs from 'fs';

const companiesText = fs.readFileSync('src/data/companies/companies.js', 'utf8');
const jobsText = fs.readFileSync('src/data/jobs.js', 'utf8');

// Parse companies
const companyBlockRegex = /{\s*id:\s*['"]([^'"]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?industry:\s*['"]([^'"]+)['"]/g;
const companies = [];
let match;
while ((match = companyBlockRegex.exec(companiesText)) !== null) {
  companies.push({ id: match[1], name: match[2], industry: match[3] });
}

console.log(`Found ${companies.length} companies in companies.js`);

// Parse jobs
const jobBlockRegex = /{\s*id:\s*['"](job-\d+)['"][\s\S]*?companyId:\s*['"]([^'"]+)['"][\s\S]*?title:\s*['"]([^'"]+)['"][\s\S]*?category:\s*['"]([^'"]+)['"][\s\S]*?employmentType:\s*['"]([^'"]+)['"][\s\S]*?experienceLevel:\s*['"]([^'"]+)['"][\s\S]*?salary:\s*['"]([^'"]+)['"]/g;
const jobs = [];
while ((match = jobBlockRegex.exec(jobsText)) !== null) {
  jobs.push({
    id: match[1],
    companyId: match[2],
    title: match[3],
    category: match[4],
    employmentType: match[5],
    experienceLevel: match[6],
    salary: match[7]
  });
}

console.log(`Found ${jobs.length} jobs in jobs.js`);

// Check job counts per company
const counts = {};
companies.forEach(c => { counts[c.id] = 0; });
jobs.forEach(j => {
  if (counts[j.companyId] !== undefined) {
    counts[j.companyId]++;
  } else {
    console.warn(`Job ${j.id} references unknown company: ${j.companyId}`);
  }
});

let failedCompanies = 0;
const report = [];
companies.forEach(c => {
  const count = counts[c.id] || 0;
  const status = count >= 2 ? 'PASS' : 'FAIL';
  if (count < 2) failedCompanies++;
  report.push({
    company: c.name,
    id: c.id,
    industry: c.industry,
    jobCount: count,
    status
  });
});

console.log('\n--- Company Jobs Validation Report ---');
console.table(report.slice(0, 30));
console.log(`... and ${report.length - 30} more companies.`);

console.log('\n--- Overall Audit Summary ---');
console.log(`Total Companies: ${companies.length}`);
console.log(`Total Jobs: ${jobs.length}`);
console.log(`Companies with >= 2 Jobs: ${companies.length - failedCompanies} / ${companies.length} (${failedCompanies === 0 ? '100% PASS' : 'FAIL'})`);
console.log(`Companies with > 2 Jobs (3+ jobs): ${companies.filter(c => counts[c.id] > 2).length}`);

// Internship compensation check
const internships = jobs.filter(j => j.employmentType.toLowerCase().includes('intern') || j.experienceLevel.toLowerCase().includes('intern'));
console.log(`\n--- Internship Compensation Audit (${internships.length} internships) ---`);
let invalidInternships = 0;
internships.forEach(j => {
  const isMonth = j.salary.toLowerCase().includes('month') || j.salary.toLowerCase().includes('undisclosed');
  const hasStipend = j.salary.toLowerCase().includes('stipend');
  if (!isMonth || !hasStipend) {
    console.error(`Invalid Internship Compensation: ${j.id} (${j.title}) -> "${j.salary}"`);
    invalidInternships++;
  }
});
if (invalidInternships === 0) {
  console.log(`[PASS] All ${internships.length} internships use valid monthly stipend terminology!`);
} else {
  console.error(`[FAIL] ${invalidInternships} internships have invalid compensation format.`);
}

// Full-time compensation check
const fulltime = jobs.filter(j => !j.employmentType.toLowerCase().includes('intern'));
console.log(`\n--- Full-Time Compensation Audit (${fulltime.length} full-time jobs) ---`);
let invalidFulltime = 0;
fulltime.forEach(j => {
  const hasAnnual = j.salary.includes('LPA') || j.salary.includes('Annual') || j.salary.includes('CTC') || j.salary.includes('year');
  if (!hasAnnual) {
    console.error(`Invalid Full-Time Compensation: ${j.id} (${j.title}) -> "${j.salary}"`);
    invalidFulltime++;
  }
});
if (invalidFulltime === 0) {
  console.log(`[PASS] All ${fulltime.length} full-time jobs clearly specify annual compensation (LPA / CTC)!`);
} else {
  console.error(`[FAIL] ${invalidFulltime} full-time jobs have invalid compensation format.`);
}

if (failedCompanies === 0 && invalidInternships === 0 && invalidFulltime === 0) {
  console.log('\n===============================================================');
  console.log('ALL CATALOGUE AUDIT & COMPENSATION CHECKS PASSED PERFECTLY!');
  console.log('===============================================================');
  process.exit(0);
} else {
  console.error('\nAUDIT FAILED!');
  process.exit(1);
}
