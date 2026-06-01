import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../../utils/api.js';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar.jsx';
import useAuth from '../../../hooks/useAuth.js';
import { loadUser } from '../../../store/slices/authSlice.js';
import { User, Upload, FileText, CheckCircle2, Loader2, X, Download, Trash2, Camera } from 'lucide-react';
import { downloadFile } from '../../../utils/cloudinary.js';

const CandidateProfile = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const avatarInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || '',
      experience: user?.experience || 0,
      skills: user?.skills?.join(', ') || '',
    },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await api.put('/users/profile', {
        ...data,
        skills: data.skills.split(',').map((s) => s.trim()).filter(Boolean),
        experience: Number(data.experience),
      });
      await dispatch(loadUser());
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Avatar upload ────────────────────────────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large. Max 2 MB.');
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    setAvatarUploading(true);
    try {
      await api.put('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await dispatch(loadUser());
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Photo upload failed');
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  // ── Resume upload ────────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5 MB.'); return; }
    setSelectedFile(file);
  };

  const handleResumeUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('resume', selectedFile);
    setResumeUploading(true);
    try {
      await api.put('/users/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await dispatch(loadUser());
      toast.success('Resume uploaded successfully!');
      setSelectedFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleResumeRemove = async () => {
    if (!window.confirm('Remove your uploaded resume?')) return;
    try {
      await api.delete('/users/resume');
      await dispatch(loadUser());
      toast.success('Resume removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove resume');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0 max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

          {/* ── Avatar card ── */}
          <div className="card mb-6 flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                {avatarUploading ? (
                  <Loader2 className="w-7 h-7 text-primary-400 animate-spin" />
                ) : user?.avatar?.url ? (
                  <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-9 h-9 text-primary-400" />
                )}
              </div>
              {/* Camera button overlay */}
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors"
                title="Change profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="sr-only"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 capitalize">
                {user?.role}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Click the camera icon to change your photo · JPG, PNG, WEBP · Max 2 MB
              </p>
            </div>
          </div>

          {/* ── Profile form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 mb-6">
            <h2 className="font-semibold text-gray-900">Personal Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input {...register('name', { required: 'Name is required' })} className="input-field" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea {...register('bio')} rows={3} className="input-field resize-none" placeholder="Tell employers about yourself..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input {...register('location')} className="input-field" placeholder="City, Country" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input type="number" min={0} {...register('experience')} className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills <span className="text-gray-400">(comma-separated)</span>
              </label>
              <input {...register('skills')} className="input-field" placeholder="React, Node.js, TypeScript..." />
            </div>

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Saving...</span> : 'Save Changes'}
            </button>
          </form>

          {/* ── Resume upload ── */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Resume</h2>

            {user?.resume?.url && (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800">Resume uploaded</p>
                  <p className="text-xs text-green-600">Stored on Cloudinary</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => downloadFile(user.resume.url, user.resume.public_id, `${user.name}_resume.pdf`)}
                    className="flex items-center gap-1 text-xs text-primary-600 hover:underline font-medium"
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                  <span className="text-gray-300">|</span>
                  <button onClick={handleResumeRemove} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            )}

            {!user?.resume?.url && !selectedFile && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">No resume uploaded yet. Upload one so recruiters can view it when you apply.</p>
              </div>
            )}

            {selectedFile && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="btn-secondary cursor-pointer flex items-center gap-2 text-sm">
                <Upload className="w-4 h-4" />
                {selectedFile ? 'Change File' : 'Choose File'}
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} className="sr-only" disabled={resumeUploading} />
              </label>
              {selectedFile && (
                <button onClick={handleResumeUpload} disabled={resumeUploading} className="btn-primary flex items-center gap-2 text-sm">
                  {resumeUploading ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</> : <><Upload className="w-4 h-4" />Upload Now</>}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">Accepted: PDF, DOC, DOCX — Max 5 MB</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
