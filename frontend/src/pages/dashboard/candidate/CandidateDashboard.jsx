import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications } from '../../../store/slices/applicationSlice.js';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar.jsx';
import Spinner from '../../../components/common/Spinner.jsx';
import { statusColor, timeAgo } from '../../../utils/formatters.js';
import useAuth from '../../../hooks/useAuth.js';
import { FileText, Briefcase, Clock, CheckCircle } from 'lucide-react';

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { myApplications, loading } = useSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const stats = [
    { label: 'Total Applied', value: myApplications.length, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'In Review', value: myApplications.filter((a) => a.status === 'reviewed').length, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Shortlisted', value: myApplications.filter((a) => a.status === 'shortlisted').length, icon: Briefcase, color: 'text-purple-600 bg-purple-50' },
    { label: 'Offers', value: myApplications.filter((a) => a.status === 'offered').length, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-gray-500 text-sm mb-8">Here's a summary of your job search activity.</p>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

          {/* Recent applications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Applications</h2>
              <Link to="/dashboard/candidate/applications" className="text-sm text-primary-600 hover:underline">
                View all
              </Link>
            </div>

            {loading ? (
              <Spinner className="py-8" />
            ) : myApplications.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No applications yet. <Link to="/jobs" className="text-primary-600 hover:underline">Browse jobs</Link></p>
              </div>
            ) : (
              <div className="space-y-3">
                {myApplications.slice(0, 5).map((app) => (
                  <div key={app._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{app.job?.title}</p>
                      <p className="text-xs text-gray-500">{app.job?.company?.name} · {timeAgo(app.createdAt)}</p>
                    </div>
                    <span className={`badge ${statusColor(app.status)} capitalize`}>{app.status}</span>
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

export default CandidateDashboard;
