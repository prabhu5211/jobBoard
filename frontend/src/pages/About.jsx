import { Link } from 'react-router-dom';
import { Briefcase, Users, Target, Heart } from 'lucide-react';

const VALUES = [
  { icon: Target, title: 'Our Mission', desc: 'To connect talented professionals with companies that value their skills and ambitions.' },
  { icon: Users, title: 'Community First', desc: 'We build tools that empower both job seekers and employers to find the right match.' },
  { icon: Heart, title: 'Transparency', desc: 'Honest job listings, clear salary ranges, and straightforward application processes.' },
];

const About = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="text-center mb-14">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4">
        <Briefcase className="w-7 h-7 text-primary-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">About Job Board</h1>
      <p className="text-gray-500 text-lg max-w-xl mx-auto">
        We're on a mission to make hiring and job searching simpler, faster, and more human.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
      {VALUES.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="card text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-50 rounded-xl mb-3">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>

    <div className="card bg-primary-50 border-primary-100 text-center">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to get started?</h2>
      <p className="text-gray-600 text-sm mb-5">Join thousands of professionals and companies already using Job Board.</p>
      <div className="flex justify-center gap-3">
        <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        <Link to="/register" className="btn-secondary">Create Account</Link>
      </div>
    </div>
  </div>
);

export default About;
