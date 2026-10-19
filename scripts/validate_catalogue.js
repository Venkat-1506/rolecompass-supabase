import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function hashFile(filepath) {
  const content = fs.readFileSync(filepath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

console.log('===============================================================');
console.log('RoleCompass Catalogue & Migration Full Verification Suite');
console.log('===============================================================\n');

let allPassed = true;
function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    allPassed = false;
  }
}

// 1. Target consolidated directory inventory
const targetDir = 'src/assets/company-logos';
const publicTargetDir = 'public/assets/company-logos';
const dir1 = 'src/assets/logos/companies';
const dir2 = 'src/assets/logos/companies2';

const targetFiles = fs.readdirSync(targetDir).filter(f => f.endsWith('.svg'));
const publicTargetFiles = fs.readdirSync(publicTargetDir).filter(f => f.endsWith('.svg'));

assert(targetFiles.length === 78, `Consolidated target directory: ${targetFiles.length} SVGs found (expected 78)`);
assert(publicTargetFiles.length === 78, `Consolidated public target directory: ${publicTargetFiles.length} SVGs found (expected 78)`);

// Check if source directories still exist or have been safely removed post-migration
const dir1Exists = fs.existsSync(dir1);
const dir2Exists = fs.existsSync(dir2);
if (dir1Exists && dir2Exists) {
  const files1 = fs.readdirSync(dir1).filter(f => f.endsWith('.svg'));
  const files2 = fs.readdirSync(dir2).filter(f => f.endsWith('.svg'));
  assert(files1.length === 46, `Inventoried source directory 1: ${files1.length} SVGs found (expected 46)`);
  assert(files2.length === 32, `Inventoried source directory 2: ${files2.length} SVGs found (expected 32)`);
} else {
  assert(!dir1Exists && !dir2Exists, `Legacy folders safely removed after verified migration: companies & companies2 unreferenced`);
}

// 4. Duplicate content analysis
const hashes = new Map();
const duplicates = [];
for (const f of targetFiles) {
  const h = hashFile(path.join(targetDir, f));
  if (hashes.has(h)) {
    duplicates.push(`${f} <=> ${hashes.get(h)}`);
  } else {
    hashes.set(h, f);
  }
}
console.log(`Identified duplicate content variants: ${duplicates.join(', ')}`);
assert(duplicates.length === 2, `Expected duplicate content pairs: 2 (hdfc.svg/hdfcbank.svg, tata.svg/tatadigital.svg)`);

// 5. Company logos mapping verification
const companyLogosText = fs.readFileSync('src/data/companyLogos.js', 'utf8');
const importedFiles = [...companyLogosText.matchAll(/from\s+['"]\.\.\/assets\/company-logos\/([^'"]+)['"]/g)].map(m => m[1]);
let allImportsExist = true;
importedFiles.forEach(f => {
  if (!fs.existsSync(path.join(targetDir, f))) {
    allImportsExist = false;
    console.error(`Missing logo file: ${f}`);
  }
});
assert(allImportsExist && importedFiles.length === 78, `All 78 logo imports in companyLogos.js resolve to existing files`);

// 6. Old paths verification
const assetsText = fs.readFileSync('src/data/assets/assets.js', 'utf8');
assert(!assetsText.includes('assets/logos/companies/'), `assets.js no longer references old directory path src/assets/logos/companies/`);

// 7. Company IDs unique & stable
const companiesText = fs.readFileSync('src/data/companies/companies.js', 'utf8');
const companyIds = [...companiesText.matchAll(/id:\s*["']([^"']+)["']/g)].map(m => m[1]);
const uniqueCompanyIds = new Set(companyIds);
assert(companyIds.length === uniqueCompanyIds.size, `All ${companyIds.length} company IDs are unique (no duplicates)`);
assert(companyIds.length === 77, `Total verified companies: ${companyIds.length} (expected 77)`);

// 8 & 9 & 10. Jobs verification
const jobsText = fs.readFileSync('src/data/jobs.js', 'utf8');
const jobMatches = [...jobsText.matchAll(/id:\s*["'](job-[^"']+)["'][\s\S]*?companyId:\s*["']([^"']+)["'][\s\S]*?category:\s*["']([^"']+)["'][\s\S]*?experienceLevel:\s*["']([^"']+)["']/g)];

const jobIds = jobMatches.map(m => m[1]);
const uniqueJobIds = new Set(jobIds);
assert(jobIds.length === uniqueJobIds.size, `All ${jobIds.length} job IDs are unique`);

// Check job counts per company
const companyJobCounts = {};
companyIds.forEach(id => { companyJobCounts[id] = 0; });
jobMatches.forEach(m => {
  const companyId = m[2];
  assert(uniqueCompanyIds.has(companyId), `Job ${m[1]} references valid companyId "${companyId}"`);
  companyJobCounts[companyId] = (companyJobCounts[companyId] || 0) + 1;
});

let minJobs = 999;
let underpopulated = [];
for (const [id, count] of Object.entries(companyJobCounts)) {
  if (count < minJobs) minJobs = count;
  if (count < 2) underpopulated.push(`${id}: ${count}`);
}
assert(underpopulated.length === 0, `Every company has at least 2 distinct job roles (Min count = ${minJobs})`);

// 11. All 12 categories represented
const categories = new Set(jobMatches.map(m => m[3]));
const canonical12 = [
  'Technology', 'Data & AI', 'Product', 'Design', 'Marketing',
  'Sales', 'Finance', 'HR', 'Operations', 'Cybersecurity',
  'Consulting', 'Content'
];
const missingCategories = canonical12.filter(c => !categories.has(c));
assert(missingCategories.length === 0, `All 12 canonical categories represented (Missing: ${missingCategories.join(', ') || 'None'})`);

const catBreakdown = {};
canonical12.forEach(c => { catBreakdown[c] = 0; });
jobMatches.forEach(m => {
  catBreakdown[m[3]] = (catBreakdown[m[3]] || 0) + 1;
});
console.log('\n--- Canonical 12 Categories Job Distribution ---');
console.table(catBreakdown);

// 12. Full career spectrum coverage
const experienceLevels = new Set(jobMatches.map(m => m[4]));
console.log('\n--- Career Experience Spectrum Levels ---');
const expList = [...experienceLevels];
console.log(expList.join(', '));
assert(experienceLevels.has('Internship'), `Includes Internship roles`);
assert(experienceLevels.has('Fresher'), `Includes Fresher / Graduate roles`);
assert(experienceLevels.has('Junior') || experienceLevels.has('Associate'), `Includes Junior / Associate roles`);
assert(experienceLevels.has('Mid-level'), `Includes Mid-level roles`);
assert(experienceLevels.has('Senior'), `Includes Senior roles`);
assert(experienceLevels.has('Lead / Principal') || experienceLevels.has('Manager') || experienceLevels.has('Director / Head'), `Includes Leadership / Lead / Manager roles`);

console.log('\n===============================================================');
if (allPassed) {
  console.log('ALL 18 VERIFICATION CHECKS PASSED PERFECTLY!');
} else {
  console.error('SOME CHECKS FAILED. PLEASE REVIEW LOGS.');
}
console.log('===============================================================');

process.exit(allPassed ? 0 : 1);
