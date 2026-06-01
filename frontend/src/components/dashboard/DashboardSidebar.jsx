import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, User, PlusCircle, Briefcase, Users, Bookmark } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';

const candidateLinks = [
  { to: '/dashboard/candidate', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/candidate/applications', label: 'My Applications', icon: FileText },
  { to: '/dashboard/candidate/saved', label: 'Saved Jobs', icon: Bookmark },
  { to: '/dashboard/candidate/profile', label: 'Profile', icon: User },
];

const recruiterLinks = [
  { to: '/dashboard/recruiter', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/recruiter/post-job', label: 'Post a Job', icon: PlusCircle },
  { to: '/dashboard/recruiter/jobs', label: 'Manage Jobs', icon: Briefcase },
  { to: '/dashboard/recruiter/profile', label: 'Company Profile', icon: Users },
];

const DashboardSidebar = () => {
  const { isCandidate } = useAuth();
  const links = isCandidate ? candidateLinks : recruiterLinks;

  return (
    <aside className="w-56 flex-shrink-0 hidden md:block">
      <nav className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 space-y-0.5 sticky top-20">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
