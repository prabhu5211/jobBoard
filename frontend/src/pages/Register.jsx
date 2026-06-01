import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { registerUser } from '../store/slices/authSlice.js';
import AuthForm from '../components/auth/AuthForm.jsx';
import useAuth from '../hooks/useAuth.js';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'candidate' } });

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboard = user.role === 'candidate' ? '/dashboard/candidate' : '/dashboard/recruiter';
      navigate(dashboard, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.rejected.match(result)) {
      toast.error(result.payload || 'Registration failed');
    } else {
      toast.success('Account created successfully!');
    }
  };

  return (
    <AuthForm title="Create your account" subtitle="Join thousands of professionals on Job Board">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3">
          {['candidate', 'recruiter'].map((role) => (
            <label
              key={role}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                watch('role') === role
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <input type="radio" value={role} {...register('role')} className="sr-only" />
              <span className="text-sm font-medium capitalize">{role}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
            className="input-field"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            className="input-field"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </AuthForm>
  );
};

export default Register;
