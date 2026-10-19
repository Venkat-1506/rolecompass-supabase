/**
 * RoleCompass API Abstraction Service
 * Decouples components from direct data sources to facilitate smooth backend integration later.
 */

import { mockJobs, getJobById } from '../data/jobs.js';
import { mockCompanies, getCompanyById } from '../data/companies.js';
import { mockSkills, getSkillById } from '../data/skills.js';
import { mockCandidateUser, mockEmployerUser } from '../data/users.js';
import { mockApplications, getApplicationsForCandidate } from '../data/applications.js';
import { mockLearningModules } from '../data/learning.js';
import { calculateRoleCompassFit } from '../data/matching.js';

export const api = {
  // Jobs API
  async getJobs(filters = {}) {
    await simulateNetworkDelay(150);
    let jobs = [...mockJobs];
    if (filters.category) {
      jobs = jobs.filter(j => j.category === filters.category);
    }
    if (filters.workMode) {
      jobs = jobs.filter(j => j.workMode === filters.workMode);
    }
    return jobs;
  },

  async getJobById(jobId) {
    await simulateNetworkDelay(100);
    return getJobById(jobId);
  },

  // Companies API
  async getCompanies() {
    await simulateNetworkDelay(150);
    return mockCompanies;
  },

  async getCompanyById(companyId) {
    await simulateNetworkDelay(100);
    return getCompanyById(companyId);
  },

  // Skills API
  async getSkills() {
    await simulateNetworkDelay(150);
    return mockSkills;
  },

  async getSkillById(skillId) {
    await simulateNetworkDelay(100);
    return getSkillById(skillId);
  },

  // Candidate API
  async getCandidateProfile() {
    await simulateNetworkDelay(120);
    return mockCandidateUser;
  },

  // Employer API
  async getEmployerProfile() {
    await simulateNetworkDelay(120);
    return mockEmployerUser;
  },

  // Applications API
  async getApplications() {
    await simulateNetworkDelay(150);
    return getApplicationsForCandidate(mockCandidateUser.id);
  },

  // Learning API
  async getLearningModules() {
    await simulateNetworkDelay(150);
    return mockLearningModules;
  },

  // RoleCompass Fit API
  async getRoleCompassFit(jobId) {
    await simulateNetworkDelay(100);
    const job = getJobById(jobId);
    return calculateRoleCompassFit(mockCandidateUser, job);
  }
};

function simulateNetworkDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
