import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Briefcase className="w-6 h-6 text-primary-400" />
              JobBoard
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Connecting talented professionals with great companies. Find your next opportunity or hire top talent.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">For Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/dashboard/candidate" className="hover:text-white transition-colors">My Applications</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard/recruiter/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/dashboard/recruiter" className="hover:text-white transition-colors">Recruiter Dashboard</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center">
          © {new Date().getFullYear()} JobBoard. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
