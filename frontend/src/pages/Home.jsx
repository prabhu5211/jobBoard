import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, MapPin, TrendingUp, Users, Briefcase, Code2, Palette,
  BarChart3, DollarSign, Database, Package, Headphones, ShieldCheck,
  ArrowRight, Star, CheckCircle2, Zap,
} from 'lucide-react';

const STATS = [
  { label: 'Jobs Posted', value: '10,000+', icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
  { label: 'Companies', value: '2,500+', icon: Users, color: 'text-purple-600 bg-purple-50' },
  { label: 'Hires Made', value: '50,000+', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
];

const CATEGORIES = [
  { name: 'Engineering', icon: Code2, count: '3,200+', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { name: 'Design', icon: Palette, count: '1,100+', color: 'bg-pink-50 text-pink-600 border-pink-100' },
  { name: 'Marketing', icon: TrendingUp, count: '980+', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { name: 'Finance', icon: DollarSign, count: '760+', color: 'bg-green-50 text-green-600 border-green-100' },
  { name: 'Data Science', icon: BarChart3, count: '1,450+', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { name: 'Product', icon: Package, count: '620+', color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { name: 'Sales', icon: Zap, count: '890+', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  { name: 'Customer Support', icon: Headphones, count: '540+', color: 'bg-teal-50 text-teal-600 border-teal-100' },
];

const FEATURED_COMPANIES = [
  { name: 'Google', color: 'bg-blue-50 text-blue-600' },
  { name: 'Microsoft', color: 'bg-blue-50 text-blue-700' },
  { name: 'Apple', color: 'bg-gray-50 text-gray-700' },
  { name: 'Amazon', color: 'bg-orange-50 text-orange-600' },
  { name: 'Meta', color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Netflix', color: 'bg-red-50 text-red-600' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up and build your professional profile with your skills, experience, and resume.' },
  { step: '02', title: 'Search & Filter Jobs', desc: 'Browse thousands of jobs filtered by location, salary, type, and experience level.' },
  { step: '03', title: 'Apply with One Click', desc: 'Submit your application with a cover letter and your profile resume instantly.' },
];

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span className="text-primary-100">Trusted by 50,000+ professionals</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Find Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Dream Job
            </span>{' '}
            Today
          </h1>
          <p className="text-primary-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Thousands of opportunities from top companies, all in one place. Start your journey to a better career.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-2 flex-1 px-4 py-2">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 text-gray-900 placeholder-gray-400 outline-none text-sm bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 px-4 py-2 border-t sm:border-t-0 sm:border-l border-gray-100">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="City, state, or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 text-gray-900 placeholder-gray-400 outline-none text-sm bg-transparent"
              />
            </div>
            <button type="submit" className="btn-primary px-8 py-3 rounded-xl text-sm font-semibold whitespace-nowrap">
              Search Jobs
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-3 mt-5 text-sm text-primary-300">
            <span>Popular:</span>
            {['React Developer', 'Product Manager', 'Data Analyst', 'UX Designer'].map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(term)}`)}
                className="hover:text-white transition-colors underline underline-offset-2"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-6">
            {STATS.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-4 justify-center">
                <div className={`p-3 rounded-xl ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{value}</div>
                  <div className="text-sm text-gray-500">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
          <p className="text-gray-500">Explore opportunities across all industries and disciplines</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map(({ name, icon: Icon, count, color }) => (
            <button
              key={name}
              onClick={() => navigate(`/jobs?category=${encodeURIComponent(name)}`)}
              className={`group flex flex-col items-center gap-3 p-5 rounded-xl border-2 bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${color}`}
            >
              <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-sm">{name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{count} jobs</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Get hired in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-2xl text-xl font-bold mb-4 shadow-lg shadow-primary-200">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Top Companies Hiring</h2>
          <p className="text-gray-500">Join teams at world-class organizations</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {FEATURED_COMPANIES.map(({ name, color }) => (
            <div
              key={name}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow ${color}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${color}`}>
                {name.charAt(0)}
              </div>
              <span className="text-xs text-gray-500 font-medium">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-primary-200 mb-8 text-lg">
            Join thousands of professionals who found their dream job through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/jobs" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors">
              <Search className="w-4 h-4" />
              Browse All Jobs
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-primary-500 text-white font-semibold px-8 py-3 rounded-xl border border-primary-400 hover:bg-primary-400 transition-colors">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex justify-center gap-6 mt-8 text-sm text-primary-300">
            {['Free to use', 'No hidden fees', 'Instant applications'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
