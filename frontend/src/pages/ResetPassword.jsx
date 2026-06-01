import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import AuthForm from '../components/auth/AuthForm.jsx';
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { token: searchParams.get('token') || '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${data.token.trim()}`, {
        password: data.password,
      });
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthForm title="Password Reset" subtitle="Your password has been updated">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600 text-sm">Redirecting you to login...</p>
          <Link to="/login" className="btn-primary w-full block text-center py-2.5">
            Go to Login
          </Link>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Reset Password"
      subtitle="Enter your reset token and choose a new password"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Token field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reset Token
          </label>
          <input
            type="text"
            {...register('token', { required: 'Reset token is required' })}
            className="input-field font-mono text-xs"
            placeholder="Paste your reset token here"
          />
          {errors.token && (
            <p className="text-red-500 text-xs mt-1">{errors.token.message}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Don't have a token?{' '}
            <Link to="/forgot-password" className="text-primary-600 hover:underline">
              Request one here
            </Link>
          </p>
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className="input-field pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === watch('password') || 'Passwords do not match',
              })}
              className="input-field pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <p className="text-center text-sm text-gray-500">
          <Link to="/login" className="flex items-center justify-center gap-1 text-primary-600 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </p>
      </form>
    </AuthForm>
  );
};

export default ResetPassword;
