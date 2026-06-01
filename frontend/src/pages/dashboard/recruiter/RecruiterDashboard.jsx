import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyJobs } from '../../../store/slices/jobSlice.js';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar.jsx';
import Spinner from '../../../components/common/Spinner.jsx';
import useAuth from '../../../hooks/useAuth.js';
import { Briefcase, Users, Eye, PlusCircle } from 'lucide-react';
import { timeAgo } from '../../../utils/formatters.js';

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { myJobs, loading } = useSelector((s) => s.jobs);

  useEffect(() => {
    dispatch(fetchMyJobs());
  }, [dispatch]);

  const totalApplications = myJobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);
  const totalViews = myJobs.reduce((sum, j) => sum + (j.views || 0), 0);
  const activeJobs = myJobs.filter((j) => j.isActive).length;

  const stats = [
    { label: 'Active Jobs', value: activeJobs, icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Applications', value: totalApplications, icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'text-green-600 bg-green-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name?.split(' ')[0]}</p>
            </div>
            <Link to="/dashboard/recruiter/post-job" className="btn-primary gap-2">
              <PlusCircle className="w-4 h-4" />
              Post a Job
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card">
                <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Recent jobs */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Job Postings</h2>
              <Link to="/dashboard/recruiter/jobs" className="text-sm text-primary-600 hover:underline">
                Manage all
              </Link>
            </div>

            {loading ? (
              <Spinner className="py-8" />
            ) : myJobs.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm mb-3">No jobs posted yet.</p>
                <Link to="/dashboard/recruiter/post-job" className="btn-primary text-sm">Post Your First Job</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myJobs.slice(0, 5).map((job) => (
                  <div key={job._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500">{timeAgo(job.createdAt)} · {job.applicationsCount} applicants · {job.views} views</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                      <Link
                        to={`/dashboard/recruiter/jobs/${job._id}/applications`}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        View applicants
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
