/**
 * RoleCompass Mock Data Service Aggregator
 */

import { mockJobs } from '../data/jobs.js';
import { mockCompanies } from '../data/companies.js';
import { mockSkills } from '../data/skills.js';
import { mockCandidateUser, mockEmployerUser } from '../data/users.js';
import { mockApplications } from '../data/applications.js';
import { mockLearningModules } from '../data/learning.js';
import { COMPANY_ASSET_MANIFEST } from '../data/companyAssets.js';

export const mockData = {
  jobs: mockJobs,
  companies: mockCompanies,
  skills: mockSkills,
  candidateUser: mockCandidateUser,
  employerUser: mockEmployerUser,
  applications: mockApplications,
  learningModules: mockLearningModules,
  companyAssets: COMPANY_ASSET_MANIFEST
};
