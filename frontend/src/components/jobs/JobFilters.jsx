import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../store/slices/jobSlice.js';
import { SlidersHorizontal, X, MapPin } from 'lucide-react';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
const LOCATION_TYPES = ['remote', 'onsite', 'hybrid'];
const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive'];
const CATEGORIES = [
  'Engineering', 'Design', 'Marketing', 'Sales', 'Finance',
  'HR', 'Operations', 'Customer Support', 'Data Science', 'Product',
];
const SALARY_RANGES = [
  { label: 'Any', min: '', max: '' },
  { label: 'Under $50k', min: '', max: '50000' },
  { label: '$50k – $80k', min: '50000', max: '80000' },
  { label: '$80k – $120k', min: '80000', max: '120000' },
  { label: '$120k – $180k', min: '120000', max: '180000' },
  { label: '$180k+', min: '180000', max: '' },
];
const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Oldest First', value: 'createdAt' },
  { label: 'Highest Salary', value: '-salary.max' },
  { label: 'Lowest Salary', value: 'salary.min' },
];

const JobFilters = ({ onClose }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.jobs.filters);

  const handleChange = (key, value) => {
    dispatch(setFilters({ [key]: filters[key] === value ? '' : value }));
  };

  const handleSalaryRange = (range) => {
    dispatch(setFilters({ minSalary: range.min, maxSalary: range.max }));
  };

  const handleClear = () => dispatch(clearFilters());

  const activeFilterCount = Object.entries(filters).filter(([k, v]) =>
    v && k !== 'keyword' && k !== 'sort'
  ).length;

  const FilterGroup = ({ title, options, filterKey }) => (
    <div className="mb-5">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">{title}</h4>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters[filterKey] === opt}
              onChange={() => handleChange(filterKey, opt)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
            />
            <span className="text-sm text-gray-700 capitalize group-hover:text-gray-900 transition-colors">
              {opt.replace(/-/g, ' ')}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const currentSalaryKey = `${filters.minSalary || ''}-${filters.maxSalary || ''}`;

  return (
    <aside className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-600 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button onClick={handleClear} className="text-xs text-primary-600 hover:underline">
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Location search */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Location</h4>
        <div className="relative">
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="City or country..."
            value={filters.location || ''}
            onChange={(e) => dispatch(setFilters({ location: e.target.value }))}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Sort By</h4>
        <select
          value={filters.sort || '-createdAt'}
          onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-700"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Salary Range */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Salary Range</h4>
        <div className="space-y-1.5">
          {SALARY_RANGES.map((range) => {
            const key = `${range.min}-${range.max}`;
            const isSelected = currentSalaryKey === key;
            return (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="salaryRange"
                  checked={isSelected}
                  onChange={() => handleSalaryRange(range)}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <FilterGroup title="Job Type" options={JOB_TYPES} filterKey="jobType" />
      <FilterGroup title="Work Mode" options={LOCATION_TYPES} filterKey="locationType" />
      <FilterGroup title="Experience Level" options={EXPERIENCE_LEVELS} filterKey="experienceLevel" />
      <FilterGroup title="Category" options={CATEGORIES} filterKey="category" />
    </aside>
  );
};

export default JobFilters;
