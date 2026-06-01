import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createJob } from '../../../store/slices/jobSlice.js';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar.jsx';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
const LOCATION_TYPES = ['remote', 'onsite', 'hybrid'];
const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive'];

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.jobs);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { locationType: 'onsite', jobType: 'full-time', experienceLevel: 'mid' },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      skills: data.skills?.split(',').map((s) => s.trim()).filter(Boolean) || [],
      requirements: data.requirements?.split('\n').filter(Boolean) || [],
      responsibilities: data.responsibilities?.split('\n').filter(Boolean) || [],
      salary: {
        min: data.salaryMin ? Number(data.salaryMin) : undefined,
        max: data.salaryMax ? Number(data.salaryMax) : undefined,
        currency: 'USD',
        period: 'yearly',
        isVisible: data.salaryVisible === 'true',
      },
    };

    const result = await dispatch(createJob(payload));
    if (createJob.fulfilled.match(result)) {
      toast.success('Job posted successfully!');
      navigate('/dashboard/recruiter/jobs');
    } else {
      toast.error(result.payload || 'Failed to post job');
    }
  };

  const Field = ({ label, error, children, required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0 max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic info */}
            <div className="card space-y-5">
              <h2 className="font-semibold text-gray-900">Job Details</h2>

              <Field label="Job Title" required error={errors.title?.message}>
                <input {...register('title', { required: 'Title is required' })} className="input-field" placeholder="e.g. Senior React Developer" />
              </Field>

              <Field label="Description" required error={errors.description?.message}>
                <textarea {...register('description', { required: 'Description is required' })} rows={5} className="input-field resize-none" placeholder="Describe the role, team, and what you're looking for..." />
              </Field>

              <Field label="Requirements" error={errors.requirements?.message}>
                <textarea {...register('requirements')} rows={4} className="input-field resize-none" placeholder="One requirement per line..." />
              </Field>

              <Field label="Responsibilities" error={errors.responsibilities?.message}>
                <textarea {...register('responsibilities')} rows={4} className="input-field resize-none" placeholder="One responsibility per line..." />
              </Field>

              <Field label="Skills" error={errors.skills?.message}>
                <input {...register('skills')} className="input-field" placeholder="React, TypeScript, Node.js (comma-separated)" />
              </Field>
            </div>

            {/* Job meta */}
            <div className="card space-y-5">
              <h2 className="font-semibold text-gray-900">Job Settings</h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Location" required error={errors.location?.message}>
                  <input {...register('location', { required: 'Location is required' })} className="input-field" placeholder="New York, NY" />
                </Field>

                <Field label="Category" required error={errors.category?.message}>
                  <input {...register('category', { required: 'Category is required' })} className="input-field" placeholder="Engineering" />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Job Type" required>
                  <select {...register('jobType')} className="input-field">
                    {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('-', ' ')}</option>)}
                  </select>
                </Field>

                <Field label="Work Mode" required>
                  <select {...register('locationType')} className="input-field">
                    {LOCATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>

                <Field label="Experience Level" required>
                  <select {...register('experienceLevel')} className="input-field">
                    {EXPERIENCE_LEVELS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Application Deadline">
                <input type="date" {...register('deadline')} className="input-field" />
              </Field>
            </div>

            {/* Salary */}
            <div className="card space-y-4">
              <h2 className="font-semibold text-gray-900">Salary (optional)</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Min Salary (USD/year)">
                  <input type="number" {...register('salaryMin')} className="input-field" placeholder="60000" />
                </Field>
                <Field label="Max Salary (USD/year)">
                  <input type="number" {...register('salaryMax')} className="input-field" placeholder="90000" />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" value="true" {...register('salaryVisible')} defaultChecked className="rounded border-gray-300 text-primary-600" />
                Show salary range to applicants
              </label>
            </div>

            {/* Company */}
            <div className="card space-y-4">
              <h2 className="font-semibold text-gray-900">Company Info</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Company Name" required error={errors['company.name']?.message}>
                  <input {...register('company.name', { required: 'Company name is required' })} className="input-field" />
                </Field>
                <Field label="Company Website">
                  <input {...register('company.website')} className="input-field" placeholder="https://company.com" />
                </Field>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary px-8">
                {loading ? 'Posting...' : 'Post Job'}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
