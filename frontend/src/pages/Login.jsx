import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../store/slices/authSlice.js';
import AuthForm from '../components/auth/AuthForm.jsx';
import useAuth from '../hooks/useAuth.js';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();
  const from = location.state?.from?.pathname || '/';
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboard = user.role === 'candidate' ? '/dashboard/candidate' : '/dashboard/recruiter';
      navigate(from === '/' ? dashboard : from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.rejected.match(result)) {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <AuthForm title="Welcome back" subtitle="Sign in to your account to continue">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
            })}
            className="input-field"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              className="input-field pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-primary-600 font-medium hover:underline">
          Create one
        </Link>
      </p>
    </AuthForm>
  );
};

export default Login;
