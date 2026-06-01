import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchApplicationsForJob,
  updateApplicationStatus,
} from '../../../store/slices/applicationSlice.js';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar.jsx';
import Spinner from '../../../components/common/Spinner.jsx';
import { statusColor, timeAgo } from '../../../utils/formatters.js';
import toast from 'react-hot-toast';
import { User, FileText, MapPin, ChevronDown, Download } from 'lucide-react';
import { downloadFile } from '../../../utils/cloudinary.js';

const STATUSES = ['pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected'];

const ViewApplications = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { jobApplications, loading } = useSelector((s) => s.applications);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchApplicationsForJob(jobId));
  }, [jobId, dispatch]);

  const handleStatusChange = async (id, status) => {
    const result = await dispatch(updateApplicationStatus({ id, status }));
    if (updateApplicationStatus.fulfilled.match(result)) {
      toast.success(`Status updated to "${status}"`);
    } else {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/dashboard/recruiter/jobs" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Jobs
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Applications</h1>
          <p className="text-gray-500 text-sm mb-6">{jobApplications.length} total applicants</p>

          {loading ? (
            <Spinner size="lg" className="py-20" />
          ) : jobApplications.length === 0 ? (
            <div className="card text-center py-16 text-gray-400">
              No applications received yet.
            </div>
          ) : (
            <div className="space-y-4">
              {jobApplications.map((app) => (
                <div key={app._id} className="card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {app.applicant?.avatar?.url ? (
                          <img src={app.applicant.avatar.url} alt={app.applicant.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{app.applicant?.name}</p>
                        <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                          {app.applicant?.location && (
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.applicant.location}</span>
                          )}
                          {app.applicant?.experience !== undefined && (
                            <span>{app.applicant.experience} yrs exp</span>
                          )}
                          <span>Applied {timeAgo(app.createdAt)}</span>
                        </div>
                        {app.applicant?.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {app.applicant.skills.slice(0, 5).map((s) => (
                              <span key={s} className="badge bg-gray-100 text-gray-600">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Resume link — only show if it's a real URL */}
                      {(() => {
                        const rawUrl =
                          (app.resume?.url && app.resume.url !== 'not_provided' && app.resume.url.startsWith('http'))
                            ? app.resume.url
                            : (app.applicant?.resume?.url && app.applicant.resume.url.startsWith('http'))
                            ? app.applicant.resume.url
                            : null;

                        // Force download with correct filename using blob
                        const resumeUrl = rawUrl || null;

                        return resumeUrl ? (
                          <button
                            onClick={() => downloadFile(
                              resumeUrl,
                              app.resume?.public_id || app.applicant?.resume?.public_id,
                              `${app.applicant?.name || 'applicant'}_resume.pdf`
                            )}
                            className="flex items-center gap-1 text-xs bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download Resume
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg">
                            <FileText className="w-3.5 h-3.5" />
                            No Resume
                          </span>
                        );
                      })()}
                      <span className={`badge ${statusColor(app.status)} capitalize`}>{app.status}</span>
                      <div className="relative">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 pr-6 appearance-none bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {app.coverLetter && (
                    <div className="mt-3">
                      <button
                        onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedId === app._id ? 'rotate-180' : ''}`} />
                        {expandedId === app._id ? 'Hide' : 'View'} cover letter
                      </button>
                      {expandedId === app._id && (
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed bg-gray-50 rounded-lg p-3">
                          {app.coverLetter}
                        </p>
                      )}
                    </div>
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

export default ViewApplications;
