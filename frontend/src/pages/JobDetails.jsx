import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobById } from '../store/slices/jobSlice.js';
import { applyForJob, fetchMyApplications } from '../store/slices/applicationSlice.js';
import Spinner from '../components/common/Spinner.jsx';
import { MapPin, Briefcase, Clock, DollarSign, Globe, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { timeAgo, formatSalary, jobTypeLabel } from '../utils/formatters.js';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth.js';

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob: job, loading, error } = useSelector((s) => s.jobs);
  const { myApplications } = useSelector((s) => s.applications);
  const { isAuthenticated, isCandidate, user } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    dispatch(fetchJobById(id));
    // Load applications so we can check if already applied
    if (isCandidate) {
      dispatch(fetchMyApplications());
    }
  }, [id, dispatch, isCandidate]);

  // Check if candidate already applied for this job
  const alreadyApplied = myApplications.some(
    (app) => app.job?._id === id || app.job === id
  );

  // Get the application status if already applied
  const existingApplication = myApplications.find(
    (app) => app.job?._id === id || app.job === id
  );

  const hasResume = !!user?.resume?.url;

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }

    const formData = new FormData();
    formData.append('coverLetter', coverLetter);

    setApplying(true);
    const result = await dispatch(applyForJob({ jobId: id, formData }));
    setApplying(false);

    if (applyForJob.fulfilled.match(result)) {
      toast.success('Application submitted successfully!');
      setShowApplyForm(false);
      dispatch(fetchMyApplications()); // refresh to update applied state
    } else {
      toast.error(result.payload || 'Application failed');
    }
  };

  if (loading) return <Spinner size="lg" className="py-32" />;
  if (error || !job) return <div className="text-center py-32 text-red-500">{error || 'Job not found'}</div>;

  const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-purple-100 text-purple-800',
    interview: 'bg-indigo-100 text-indigo-800',
    offered: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-gray-500 mt-1">{job.company?.name}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{jobTypeLabel(job.jobType)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{timeAgo(job.createdAt)}</span>
                  {job.salary?.isVisible && (
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{formatSalary(job.salary)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Job Description</h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements?.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {job.responsibilities?.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-3">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
                {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {/* Apply form */}
          {showApplyForm && isCandidate && !alreadyApplied && (
            <div className="card border-2 border-primary-200">
              <h2 className="font-semibold text-gray-900 mb-4">Submit Application</h2>

              {/* Resume warning */}
              {!hasResume && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    You haven't uploaded a resume yet.{' '}
                    <Link to="/dashboard/candidate/profile" className="font-medium underline">
                      Upload one in your profile
                    </Link>{' '}
                    so recruiters can view it.
                  </p>
                </div>
              )}

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    rows={5}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the employer why you're a great fit..."
                    className="input-field resize-none"
                  />
                </div>
                {hasResume && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    Your resume will be attached automatically.
                  </p>
                )}
                <div className="flex gap-3">
                  <button type="submit" disabled={applying} className="btn-primary">
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button type="button" onClick={() => setShowApplyForm(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card">
            {isCandidate ? (
              alreadyApplied ? (
                /* Already applied — show status */
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">Already Applied</p>
                      <p className="text-xs text-green-600">
                        Applied {existingApplication?.createdAt ? timeAgo(existingApplication.createdAt) : ''}
                      </p>
                    </div>
                  </div>
                  {existingApplication?.status && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className={`badge capitalize ${STATUS_COLORS[existingApplication.status] || 'bg-gray-100 text-gray-600'}`}>
                        {existingApplication.status}
                      </span>
                    </div>
                  )}
                  <Link
                    to="/dashboard/candidate/applications"
                    className="btn-secondary w-full text-center text-sm py-2"
                  >
                    View My Applications
                  </Link>
                </div>
              ) : (
                /* Not applied yet */
                <button
                  onClick={() => setShowApplyForm(!showApplyForm)}
                  className={`w-full py-3 font-medium rounded-lg transition-colors ${
                    showApplyForm
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'btn-primary'
                  }`}
                >
                  {showApplyForm ? 'Cancel' : 'Apply Now'}
                </button>
              )
            ) : !isAuthenticated ? (
              <button onClick={() => navigate('/login')} className="btn-primary w-full py-3">
                Sign in to Apply
              </button>
            ) : null}

            <div className="mt-5 space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Work Mode</span>
                <span className="capitalize font-medium">{job.locationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Experience</span>
                <span className="capitalize font-medium">{job.experienceLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category</span>
                <span className="font-medium">{job.category}</span>
              </div>
              {job.deadline && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Deadline</span>
                  <span className="font-medium">{new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {job.skills?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span key={s} className="badge bg-primary-50 text-primary-700 border border-primary-100">{s}</span>
                ))}
              </div>
            </div>
          )}

          {job.company?.website && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Company</h3>
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-primary-600 hover:underline"
              >
                <Globe className="w-4 h-4" />
                {job.company.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
