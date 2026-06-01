import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import MainLayout from './components/layout/MainLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetails from './pages/JobDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// Candidate dashboard pages
import CandidateDashboard from './pages/dashboard/candidate/CandidateDashboard.jsx';
import MyApplications from './pages/dashboard/candidate/MyApplications.jsx';
import SavedJobs from './pages/dashboard/candidate/SavedJobs.jsx';
import CandidateProfile from './pages/dashboard/candidate/CandidateProfile.jsx';

// Recruiter dashboard pages
import RecruiterDashboard from './pages/dashboard/recruiter/RecruiterDashboard.jsx';
import PostJob from './pages/dashboard/recruiter/PostJob.jsx';
import ManageJobs from './pages/dashboard/recruiter/ManageJobs.jsx';
import ViewApplications from './pages/dashboard/recruiter/ViewApplications.jsx';
import RecruiterProfile from './pages/dashboard/recruiter/RecruiterProfile.jsx';

import { loadUser } from './store/slices/authSlice.js';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt to restore session from localStorage token
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Candidate protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
          <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
          <Route path="/dashboard/candidate/applications" element={<MyApplications />} />
          <Route path="/dashboard/candidate/saved" element={<SavedJobs />} />
          <Route path="/dashboard/candidate/profile" element={<CandidateProfile />} />
        </Route>

        {/* Recruiter protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['recruiter', 'admin']} />}>
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
          <Route path="/dashboard/recruiter/post-job" element={<PostJob />} />
          <Route path="/dashboard/recruiter/jobs" element={<ManageJobs />} />
          <Route path="/dashboard/recruiter/jobs/:jobId/applications" element={<ViewApplications />} />
          <Route path="/dashboard/recruiter/profile" element={<RecruiterProfile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
