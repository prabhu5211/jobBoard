import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar.jsx';
import { Bookmark, MapPin, Briefcase, DollarSign, Trash2, ExternalLink } from 'lucide-react';
import { formatSalary, jobTypeLabel, timeAgo } from '../../../utils/formatters.js';
import toast from 'react-hot-toast';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('savedJobsData') || '[]');
      setSavedJobs(data);
    } catch {
      setSavedJobs([]);
    }
  }, []);

  const handleRemove = (jobId) => {
    try {
      const updatedData = savedJobs.filter((j) => j._id !== jobId);
      const savedIds = JSON.parse(localStorage.getItem('savedJobs') || '[]').filter((id) => id !== jobId);
      localStorage.setItem('savedJobsData', JSON.stringify(updatedData));
      localStorage.setItem('savedJobs', JSON.stringify(savedIds));
      setSavedJobs(updatedData);
      toast.success('Job removed from saved');
    } catch {
      toast.error('Could not remove job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <Bookmark className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
            <span className="badge bg-primary-100 text-primary-700">{savedJobs.length}</span>
          </div>

          {savedJobs.length === 0 ? (
            <div className="card text-center py-16">
              <Bookmark className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
              <p className="text-gray-500 text-sm mb-5">
                Browse jobs and click the bookmark icon to save them for later.
              </p>
              <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div key={job._id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Company logo */}
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {job.company?.logo ? (
                        <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <Briefcase className="w-6 h-6 text-gray-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors flex items-center gap-1.5"
                          >
                            {job.title}
                            <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                          </Link>
                          <p className="text-sm text-gray-500 mt-0.5">{job.company?.name}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(job._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          {jobTypeLabel(job.jobType)}
                        </span>
                        {job.salary?.isVisible && job.salary?.min && (
                          <span className="flex items-center gap-1 text-gray-700 font-medium">
                            <DollarSign className="w-3.5 h-3.5 text-green-500" />
                            {formatSalary(job.salary)}
                          </span>
                        )}
                        <span className="text-gray-400">Saved {timeAgo(job.createdAt)}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="badge bg-gray-100 text-gray-600 text-xs capitalize">{job.locationType}</span>
                        <span className="badge bg-gray-100 text-gray-600 text-xs capitalize">{job.experienceLevel}</span>
                        {job.skills?.slice(0, 3).map((skill) => (
                          <span key={skill} className="badge bg-gray-50 text-gray-600 border border-gray-200 text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex gap-3">
                    <Link to={`/jobs/${job._id}`} className="btn-primary text-sm px-4 py-2">
                      View Job
                    </Link>
                    <button
                      onClick={() => handleRemove(job._id)}
                      className="btn-secondary text-sm px-4 py-2 text-red-500 border-red-200 hover:bg-red-50"
                    >
                      Remove
                    </button>
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

export default SavedJobs;
