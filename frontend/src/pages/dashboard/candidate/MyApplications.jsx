import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications, withdrawApplication } from '../../../store/slices/applicationSlice.js';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar.jsx';
import Spinner from '../../../components/common/Spinner.jsx';
import { statusColor, timeAgo, jobTypeLabel } from '../../../utils/formatters.js';
import toast from 'react-hot-toast';
import { MapPin, Briefcase, ExternalLink, Trash2 } from 'lucide-react';

const MyApplications = () => {
  const dispatch = useDispatch();
  const { myApplications, loading } = useSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    const result = await dispatch(withdrawApplication(id));
    if (withdrawApplication.fulfilled.match(result)) {
      toast.success('Application withdrawn');
    } else {
      toast.error('Could not withdraw application');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

          {loading ? (
            <Spinner size="lg" className="py-20" />
          ) : myApplications.length === 0 ? (
            <div className="card text-center py-16 text-gray-400">
              <p className="mb-3">You haven't applied to any jobs yet.</p>
              <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map((app) => (
                <div key={app._id} className="card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/jobs/${app.job?._id}`}
                          className="font-semibold text-gray-900 hover:text-primary-600 flex items-center gap-1"
                        >
                          {app.job?.title}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <span className={`badge ${statusColor(app.status)} capitalize`}>{app.status}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{app.job?.company?.name}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        {app.job?.location && (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.job.location}</span>
                        )}
                        {app.job?.jobType && (
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{jobTypeLabel(app.job.jobType)}</span>
                        )}
                        <span>Applied {timeAgo(app.createdAt)}</span>
                      </div>
                    </div>

                    {!['offered', 'rejected', 'withdrawn'].includes(app.status) && (
                      <button
                        onClick={() => handleWithdraw(app._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        title="Withdraw application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {app.coverLetter && (
                    <details className="mt-3">
                      <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">View cover letter</summary>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{app.coverLetter}</p>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
