import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { CandidateLayout } from '../layouts/CandidateLayout.jsx';
import { EmployerLayout } from '../layouts/EmployerLayout.jsx';

// Public Pages
import { HomePage } from '../../pages/public/HomePage.jsx';
import { ExplorePage } from '../../pages/public/ExplorePage.jsx';
import { JobDetailsPage } from '../../pages/public/JobDetailsPage.jsx';
import { RolesPage } from '../../pages/public/RolesPage.jsx';
import { RoleDetailsPage } from '../../pages/public/RoleDetailsPage.jsx';
import { CompaniesPage } from '../../pages/public/CompaniesPage.jsx';
import { CompanyDetailsPage } from '../../pages/public/CompanyDetailsPage.jsx';
import { AboutPage } from '../../pages/public/AboutPage.jsx';
import { ContactPage } from '../../pages/public/ContactPage.jsx';
import { HowItWorksPage } from '../../pages/public/HowItWorksPage.jsx';

// Auth Pages
import { LoginPage } from '../../pages/auth/LoginPage.jsx';

// Dev Pages
import { FoundationDemoPage } from '../../pages/FoundationDemoPage.jsx';
import { AssetPreviewPage } from '../../pages/AssetPreviewPage.jsx';

// Onboarding Pages
import { ChoosePath } from '../../pages/onboarding/ChoosePath.jsx';
import { AccountDetails } from '../../pages/onboarding/AccountDetails.jsx';
import { AccountCreated } from '../../pages/onboarding/AccountCreated.jsx';
import { ProfileMethod } from '../../pages/onboarding/ProfileMethod.jsx';
import { ResumeUpload } from '../../pages/onboarding/ResumeUpload.jsx';
import { ResumeProcessing } from '../../pages/onboarding/ResumeProcessing.jsx';
import { ProfileReveal } from '../../pages/onboarding/ProfileReveal.jsx';
import { ManualProfile } from '../../pages/onboarding/ManualProfile.jsx';
import { ProfileComplete } from '../../pages/onboarding/ProfileComplete.jsx';

// Candidate Pages
import { CandidateHomePage } from '../../pages/candidate/CandidateHomePage.jsx';
import { CandidateProfilePage } from '../../pages/candidate/CandidateProfilePage.jsx';
import { CandidatePreferencesPage } from '../../pages/candidate/CandidatePreferencesPage.jsx';
import { CandidateRolesPage } from '../../pages/candidate/CandidateRolesPage.jsx';
import { LearningHubPage } from '../../pages/candidate/LearningHubPage.jsx';
import { SkillDetailsPage } from '../../pages/candidate/SkillDetailsPage.jsx';
import { ApplicationsTrackerPage } from '../../pages/candidate/ApplicationsTrackerPage.jsx';
import { ResumePage } from '../../pages/candidate/ResumePage.jsx';

// Employer Pages
import { EmployerOverviewPage } from '../../pages/employer/EmployerOverviewPage.jsx';
import { CompanySetupPage } from '../../pages/employer/CompanySetupPage.jsx';
import { EmployerJobsPage } from '../../pages/employer/EmployerJobsPage.jsx';
import { CreateRoleWizardPage } from '../../pages/employer/CreateRoleWizardPage.jsx';
import { EmployerCandidatesPage } from '../../pages/employer/EmployerCandidatesPage.jsx';
import { HiringPipelinePage } from '../../pages/employer/HiringPipelinePage.jsx';

// Route Guards
import { GuestRoute, ProtectedRoute, OnboardingRoute } from './RouteGuards.jsx';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTE GROUP */}
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

          {/* GUEST ROUTES (Sign In & Register for unauthenticated visitors) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<ChoosePath />} />
            <Route path="/register" element={<ChoosePath />} />
            <Route path="/onboarding/path" element={<ChoosePath />} />
            <Route path="/onboarding/account" element={<AccountDetails />} />
          </Route>

          {/* ONBOARDING ROUTES (Authenticated candidate profile setup flow) */}
          <Route element={<OnboardingRoute />}>
            <Route path="/onboarding/created" element={<AccountCreated />} />
            <Route path="/onboarding/method" element={<ProfileMethod />} />
            <Route path="/onboarding/resume-upload" element={<ResumeUpload />} />
            <Route path="/onboarding/resume-processing" element={<ResumeProcessing />} />
            <Route path="/onboarding/review-profile" element={<ProfileReveal />} />
            <Route path="/onboarding/manual-profile" element={<ManualProfile />} />
            <Route path="/onboarding/complete" element={<ProfileComplete />} />
          </Route>

          {/* DEV PREVIEW BENCH */}
          <Route path="/foundation-test" element={<FoundationDemoPage />} />
          <Route path="/assets-preview" element={<AssetPreviewPage />} />
        </Route>

        {/* CANDIDATE PROTECTED ROUTE GROUP */}
        <Route element={<ProtectedRoute allowedRole="candidate" />}>
          <Route path="/candidate" element={<CandidateLayout />}>
            <Route index element={<CandidateHomePage />} />
            <Route path="profile" element={<CandidateProfilePage />} />
            <Route path="preferences" element={<CandidatePreferencesPage />} />
            <Route path="roles" element={<CandidateRolesPage />} />
            <Route path="roles/:roleId" element={<RoleDetailsPage />} />
            <Route path="learning" element={<LearningHubPage />} />
            <Route path="learning/:skillId" element={<SkillDetailsPage />} />
            <Route path="applications" element={<ApplicationsTrackerPage />} />
            <Route path="applications/:applicationId" element={<ApplicationsTrackerPage />} />
            <Route path="resume" element={<ResumePage />} />
          </Route>
        </Route>

        {/* EMPLOYER PROTECTED ROUTE GROUP */}
        <Route element={<ProtectedRoute allowedRole="employer" />}>
          <Route path="/employer" element={<EmployerLayout />}>
            <Route index element={<EmployerOverviewPage />} />
            <Route path="company" element={<CompanySetupPage />} />
            <Route path="jobs" element={<EmployerJobsPage />} />
            <Route path="jobs/create" element={<CreateRoleWizardPage />} />
            <Route path="jobs/:jobId" element={<JobDetailsPage />} />
            <Route path="candidates" element={<EmployerCandidatesPage />} />
            <Route path="candidates/:candidateId" element={<EmployerCandidatesPage />} />
            <Route path="pipeline" element={<HiringPipelinePage />} />
          </Route>
        </Route>

        {/* CATCH-ALL REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
