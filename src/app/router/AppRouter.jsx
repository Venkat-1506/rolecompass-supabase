import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { CandidateLayout } from '../layouts/CandidateLayout.jsx';
import { GuestRoute, ProtectedRoute, OnboardingRoute } from './RouteGuards.jsx';

import { HomePage } from '../../pages/public/HomePage.jsx';
import { LoginPage } from '../../pages/auth/LoginPage.jsx';

const lazyPage = (loader, name) =>
  React.lazy(() => loader().then((module) => ({ default: module[name] })));

const ExplorePage = lazyPage(() => import('../../pages/public/ExplorePage.jsx'), 'ExplorePage');
const JobDetailsPage = lazyPage(
  () => import('../../pages/public/JobDetailsPage.jsx'),
  'JobDetailsPage',
);
const RolesPage = lazyPage(() => import('../../pages/public/RolesPage.jsx'), 'RolesPage');
const RoleDetailsPage = lazyPage(
  () => import('../../pages/public/RoleDetailsPage.jsx'),
  'RoleDetailsPage',
);
const CompaniesPage = lazyPage(
  () => import('../../pages/public/CompaniesPage.jsx'),
  'CompaniesPage',
);
const CompanyDetailsPage = lazyPage(
  () => import('../../pages/public/CompanyDetailsPage.jsx'),
  'CompanyDetailsPage',
);
const AboutPage = lazyPage(() => import('../../pages/public/AboutPage.jsx'), 'AboutPage');
const ContactPage = lazyPage(() => import('../../pages/public/ContactPage.jsx'), 'ContactPage');
const HowItWorksPage = lazyPage(
  () => import('../../pages/public/HowItWorksPage.jsx'),
  'HowItWorksPage',
);

const ChoosePath = lazyPage(() => import('../../pages/onboarding/ChoosePath.jsx'), 'ChoosePath');
const AccountDetails = lazyPage(
  () => import('../../pages/onboarding/AccountDetails.jsx'),
  'AccountDetails',
);
const AccountCreated = lazyPage(
  () => import('../../pages/onboarding/AccountCreated.jsx'),
  'AccountCreated',
);
const ProfileMethod = lazyPage(
  () => import('../../pages/onboarding/ProfileMethod.jsx'),
  'ProfileMethod',
);
const ResumeUpload = lazyPage(
  () => import('../../pages/onboarding/ResumeUpload.jsx'),
  'ResumeUpload',
);
const ResumeProcessing = lazyPage(
  () => import('../../pages/onboarding/ResumeProcessing.jsx'),
  'ResumeProcessing',
);
const ProfileReveal = lazyPage(
  () => import('../../pages/onboarding/ProfileReveal.jsx'),
  'ProfileReveal',
);
const ManualProfile = lazyPage(
  () => import('../../pages/onboarding/ManualProfile.jsx'),
  'ManualProfile',
);
const ProfileComplete = lazyPage(
  () => import('../../pages/onboarding/ProfileComplete.jsx'),
  'ProfileComplete',
);

const CandidateHomePage = lazyPage(
  () => import('../../pages/candidate/CandidateHomePage.jsx'),
  'CandidateHomePage',
);
const CandidateProfilePage = lazyPage(
  () => import('../../pages/candidate/CandidateProfilePage.jsx'),
  'CandidateProfilePage',
);
const CandidatePreferencesPage = lazyPage(
  () => import('../../pages/candidate/CandidatePreferencesPage.jsx'),
  'CandidatePreferencesPage',
);
const CandidateRolesPage = lazyPage(
  () => import('../../pages/candidate/CandidateRolesPage.jsx'),
  'CandidateRolesPage',
);
const LearningHubPage = lazyPage(
  () => import('../../pages/candidate/LearningHubPage.jsx'),
  'LearningHubPage',
);
const SkillDetailsPage = lazyPage(
  () => import('../../pages/candidate/SkillDetailsPage.jsx'),
  'SkillDetailsPage',
);
const ApplicationsTrackerPage = lazyPage(
  () => import('../../pages/candidate/ApplicationsTrackerPage.jsx'),
  'ApplicationsTrackerPage',
);
const ResumePage = lazyPage(() => import('../../pages/candidate/ResumePage.jsx'), 'ResumePage');
const SavedJobsPage = lazyPage(
  () => import('../../pages/candidate/SavedJobsPage.jsx'),
  'SavedJobsPage',
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/jobs" element={<ExplorePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:companyId" element={<CompanyDetailsPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/roles/:roleId" element={<RoleDetailsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<ChoosePath />} />
            <Route path="/register" element={<ChoosePath />} />
            <Route path="/onboarding/path" element={<ChoosePath />} />
            <Route path="/onboarding/account" element={<AccountDetails />} />
          </Route>

          <Route element={<OnboardingRoute />}>
            <Route path="/onboarding/created" element={<AccountCreated />} />
            <Route path="/onboarding/method" element={<ProfileMethod />} />
            <Route path="/onboarding/resume-upload" element={<ResumeUpload />} />
            <Route path="/onboarding/resume-processing" element={<ResumeProcessing />} />
            <Route path="/onboarding/review-profile" element={<ProfileReveal />} />
            <Route path="/onboarding/manual-profile" element={<ManualProfile />} />
            <Route path="/onboarding/complete" element={<ProfileComplete />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/candidate" element={<CandidateLayout />}>
            <Route index element={<CandidateHomePage />} />
            <Route path="profile" element={<CandidateProfilePage />} />
            <Route path="preferences" element={<CandidatePreferencesPage />} />
            <Route path="settings" element={<CandidatePreferencesPage />} />
            <Route path="roles" element={<CandidateRolesPage />} />
            <Route path="roles/:roleId" element={<RoleDetailsPage />} />
            <Route path="learning" element={<LearningHubPage />} />
            <Route path="learning/:skillId" element={<SkillDetailsPage />} />
            <Route path="saved-jobs" element={<SavedJobsPage />} />
            <Route path="applications" element={<ApplicationsTrackerPage />} />
            <Route path="applications/:applicationId" element={<ApplicationsTrackerPage />} />
            <Route path="resume" element={<ResumePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
