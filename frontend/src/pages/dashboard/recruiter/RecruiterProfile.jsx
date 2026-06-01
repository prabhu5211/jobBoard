import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../../utils/api.js';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar.jsx';
import useAuth from '../../../hooks/useAuth.js';
import { loadUser } from '../../../store/slices/authSlice.js';
import { useDispatch } from 'react-redux';
import { Building2, Camera, User, Loader2, Upload } from 'lucide-react';

const RecruiterProfile = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const avatarInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      'company.name': user?.company?.name || '',
      'company.website': user?.company?.website || '',
      'company.description': user?.company?.description || '',
    },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await api.put('/users/profile', {
        name: data.name,
        company: {
          name: data['company.name'],
          website: data['company.website'],
          description: data['company.description'],
        },
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
    if (file.size > 2 * 1024 * 1024) { toast.error('Image too large. Max 2 MB.'); return; }
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

  // ── Company logo upload ──────────────────────────────────────────────────────
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image too large. Max 2 MB.'); return; }

    // Upload as avatar first, then save URL into company.logo via profile update
    const formData = new FormData();
    formData.append('avatar', file);
    setLogoUploading(true);
    try {
      // Upload image to Cloudinary via avatar endpoint
      const { data: uploadData } = await api.put('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Save the URL as company logo
      await api.put('/users/profile', {
        company: {
          name: user?.company?.name || '',
          website: user?.company?.website || '',
          description: user?.company?.description || '',
          logo: { url: uploadData.avatar?.url, public_id: uploadData.avatar?.public_id },
        },
      });
      await dispatch(loadUser());
      toast.success('Company logo updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Logo upload failed');
    } finally {
      setLogoUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0 max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Company Profile</h1>

          {/* ── Profile photo + company logo row ── */}
          <div className="card mb-6">
            <div className="flex items-start gap-8">

              {/* Personal avatar */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Your Photo</p>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                    {avatarUploading ? (
                      <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                    ) : user?.avatar?.url ? (
                      <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-7 h-7 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center shadow hover:bg-primary-700 transition-colors"
                    title="Change profile photo"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                  <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} className="sr-only" />
                </div>
                <p className="text-xs text-gray-400">JPG, PNG · 2 MB</p>
              </div>

              {/* Company logo */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company Logo</p>
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                    {logoUploading ? (
                      <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                    ) : user?.company?.logo?.url ? (
                      <img src={user.company.logo.url} alt="Company logo" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Building2 className="w-7 h-7 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    disabled={logoUploading}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center shadow hover:bg-primary-700 transition-colors"
                    title="Upload company logo"
                  >
                    <Upload className="w-3 h-3" />
                  </button>
                  <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} className="sr-only" />
                </div>
                <p className="text-xs text-gray-400">JPG, PNG · 2 MB</p>
              </div>

              {/* Info */}
              <div className="flex-1 pt-1">
                <p className="font-semibold text-gray-900">{user?.company?.name || 'Your Company'}</p>
                <p className="text-sm text-gray-500">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* ── Profile form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
            <h2 className="font-semibold text-gray-900">Account & Company Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input {...register('name', { required: 'Name is required' })} className="input-field" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input {...register('company.name')} className="input-field" placeholder="Acme Corp" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
              <input {...register('company.website')} className="input-field" placeholder="https://acme.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
              <textarea
                {...register('company.description')}
                rows={4}
                className="input-field resize-none"
                placeholder="Tell candidates about your company culture, mission, and values..."
              />
            </div>

            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Saving...</span> : 'Save Changes'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
