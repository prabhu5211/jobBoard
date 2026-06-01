import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, DollarSign, Bookmark, BookmarkCheck, Building2 } from 'lucide-react';
import { timeAgo, formatSalary, jobTypeLabel } from '../../utils/formatters.js';
import { useState } from 'react';
import toast from 'react-hot-toast';

const EXPERIENCE_COLORS = {
  entry: 'bg-green-50 text-green-700',
  mid: 'bg-blue-50 text-blue-700',
  senior: 'bg-purple-50 text-purple-700',
  lead: 'bg-orange-50 text-orange-700',
  executive: 'bg-red-50 text-red-700',
};

const LOCATION_TYPE_COLORS = {
  remote: 'bg-teal-50 text-teal-700',
  onsite: 'bg-gray-100 text-gray-600',
  hybrid: 'bg-indigo-50 text-indigo-700',
};

const JobCard = ({ job }) => {
  const {
    _id, title, company, location, locationType, jobType,
    salary, createdAt, isFeatured, experienceLevel, skills,
  } = job;

  const [saved, setSaved] = useState(() => {
    try {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      return savedJobs.includes(_id);
    } catch { return false; }
  });

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      let updated;
      if (saved) {
        updated = savedJobs.filter((id) => id !== _id);
        toast.success('Job removed from saved');
      } else {
        updated = [...savedJobs, _id];
        // Also save the full job object for the saved jobs page
        const savedJobsData = JSON.parse(localStorage.getItem('savedJobsData') || '[]');
        const exists = savedJobsData.find((j) => j._id === _id);
        if (!exists) {
          localStorage.setItem('savedJobsData', JSON.stringify([...savedJobsData, job]));
        }
        toast.success('Job saved!');
      }
      localStorage.setItem('savedJobs', JSON.stringify(updated));
      setSaved(!saved);
    } catch {
      toast.error('Could not save job');
    }
  };

  return (
    <article
      className={`group bg-white rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 p-5 ${
        isFeatured
          ? 'border-primary-200 shadow-sm shadow-primary-50'
          : 'border-gray-100 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {company?.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-full h-full object-contain p-1"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <Building2 className={`w-6 h-6 text-gray-300 ${company?.logo ? 'hidden' : 'flex'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                to={`/jobs/${_id}`}
                className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 text-base"
              >
                {title}
              </Link>
              <p className="text-sm text-gray-500 mt-0.5 font-medium">{company?.name}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isFeatured && (
                <span className="badge bg-primary-100 text-primary-700 text-xs">Featured</span>
              )}
              <button
                onClick={handleSave}
                className={`p-1.5 rounded-lg transition-colors ${
                  saved
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
                }`}
                title={saved ? 'Remove from saved' : 'Save job'}
                aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
              >
                {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
              {jobTypeLabel(jobType)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {timeAgo(createdAt)}
            </span>
            {salary?.isVisible && salary?.min && (
              <span className="flex items-center gap-1 font-medium text-gray-700">
                <DollarSign className="w-3.5 h-3.5 text-green-500" />
                {formatSalary(salary)}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className={`badge text-xs ${LOCATION_TYPE_COLORS[locationType] || 'bg-gray-100 text-gray-600'}`}>
              {locationType}
            </span>
            <span className={`badge text-xs ${EXPERIENCE_COLORS[experienceLevel] || 'bg-gray-100 text-gray-600'}`}>
              {experienceLevel}
            </span>
            {skills?.slice(0, 3).map((skill) => (
              <span key={skill} className="badge bg-gray-50 text-gray-600 border border-gray-200 text-xs">
                {skill}
              </span>
            ))}
            {skills?.length > 3 && (
              <span className="badge bg-gray-50 text-gray-400 border border-gray-200 text-xs">
                +{skills.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default JobCard;
