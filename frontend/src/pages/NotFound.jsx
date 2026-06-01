import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
    <div className="text-center">
      <p className="text-8xl font-bold text-primary-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex justify-center gap-3">
        <Link to="/" className="btn-primary gap-2">
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link to="/jobs" className="btn-secondary gap-2">
          <Search className="w-4 h-4" />
          Browse Jobs
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
