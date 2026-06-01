import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyJobs, deleteJob } from '../../../store/slices/jobSlice.js';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar.jsx';
import Spinner from '../../../components/common/Spinner.jsx';
import toast from 'react-hot-toast';
import { PlusCircle, Users, Eye, Pencil, Trash2 } from 'lucide-react';
import { timeAgo, jobTypeLabel } from '../../../utils/formatters.js';

const ManageJobs = () => {
  const dispatch = useDispatch();
  const { myJobs, loading } = useSelector((s) => s.jobs);

  useEffect(() => {
    dispatch(fetchMyJobs());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Close this job posting?')) return;
    const result = await dispatch(deleteJob(id));
    if (deleteJob.fulfilled.match(result)) {
      toast.success('Job closed');
    } else {
      toast.error('Failed to close job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
            <Link to="/dashboard/recruiter/post-job" className="btn-primary gap-2">
              <PlusCircle className="w-4 h-4" />
              Post New Job
            </Link>
          </div>

          {loading ? (
            <Spinner size="lg" className="py-20" />
          ) : myJobs.length === 0 ? (
            <div className="card text-center py-16 text-gray-400">
              <p className="mb-3">No jobs posted yet.</p>
              <Link to="/dashboard/recruiter/post-job" className="btn-primary">Post Your First Job</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myJobs.map((job) => (
                <div key={job._id} className="card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <span className={`badge ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {job.isActive ? 'Active' : 'Closed'}
                        </span>
                        {job.isFeatured && <span className="badge bg-primary-100 text-primary-700">Featured</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {job.location} · {jobTypeLabel(job.jobType)} · {job.experienceLevel} · Posted {timeAgo(job.createdAt)}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{job.applicationsCount} applicants</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{job.views} views</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        to={`/dashboard/recruiter/jobs/${job._id}/applications`}
                        className="btn-secondary text-xs px-3 py-1.5 gap-1"
                      >
                        <Users className="w-3.5 h-3.5" />
                        Applicants
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Close job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
