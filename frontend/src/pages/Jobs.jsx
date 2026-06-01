import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchJobs, setFilters } from '../store/slices/jobSlice.js';
import JobCard from '../components/jobs/JobCard.jsx';
import JobFilters from '../components/jobs/JobFilters.jsx';
import Pagination from '../components/common/Pagination.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { Search, SlidersHorizontal } from 'lucide-react';
import useDebounce from '../hooks/useDebounce.js';

const Jobs = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { jobs, loading, error, total, totalPages, currentPage, filters } = useSelector((s) => s.jobs);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [showFilters, setShowFilters] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 400);
  const page = Number(searchParams.get('page')) || 1;

  // Sync URL params into Redux filters on mount
  useEffect(() => {
    const params = {};
    ['keyword', 'location', 'jobType', 'locationType', 'experienceLevel', 'category'].forEach((k) => {
      if (searchParams.get(k)) params[k] = searchParams.get(k);
    });
    if (Object.keys(params).length) dispatch(setFilters(params));
  }, []); // eslint-disable-line

  // Fetch whenever filters or page changes
  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const { sort, ...restFilters } = filters;
    dispatch(fetchJobs({ ...restFilters, keyword: debouncedKeyword, page, sort: sort || '-createdAt' }));
  }, [filters, debouncedKeyword, searchParams.get('page')]); // eslint-disable-line

  const handlePageChange = (page) => {
    setSearchParams((prev) => { prev.set('page', page); return prev; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search bar */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs by title, skill, or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary gap-2 md:hidden"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters — desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <JobFilters />
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setShowFilters(false)}>
            <div className="absolute right-0 top-0 h-full w-72 bg-white p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <JobFilters onClose={() => setShowFilters(false)} />
            </div>
          </div>
        )}

        {/* Job list */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {loading ? 'Searching...' : `${total} job${total !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {loading ? (
            <Spinner size="lg" className="py-20" />
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg font-medium">No jobs found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Jobs;
