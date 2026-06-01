import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import AuthForm from '../components/auth/AuthForm.jsx';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthForm title="Check Your Email" subtitle="A reset link has been sent">
        <div className="space-y-5 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>

          <div>
            <p className="text-gray-700 text-sm font-medium">
              We sent a password reset link to:
            </p>
            <p className="text-primary-600 font-semibold mt-1">{getValues('email')}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-800 font-medium mb-1">What to do next:</p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Open your email inbox</li>
              <li>Click the "Reset Password" button in the email</li>
              <li>Choose a new password</li>
            </ol>
          </div>

          <p className="text-xs text-gray-500">
            Didn't receive it? Check your spam folder or{' '}
            <button
              onClick={() => setSubmitted(false)}
              className="text-primary-600 hover:underline font-medium"
            >
              try again
            </button>
          </p>

          <Link
            to="/login"
            className="flex items-center justify-center gap-1 text-sm text-primary-600 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
              className="input-field pl-9"
              placeholder="you@example.com"
              autoFocus
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p className="text-center text-sm text-gray-500">
          <Link
            to="/login"
            className="flex items-center justify-center gap-1 text-primary-600 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </p>
      </form>
    </AuthForm>
  );
};

export default ForgotPassword;
