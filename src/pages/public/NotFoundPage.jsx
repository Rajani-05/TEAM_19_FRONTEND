import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Page Not Found</h1>
      <p className="text-slate-600 mb-8 text-center max-w-md">
        The page you are looking for does not exist, or has been moved to a different URL.
      </p>
      <Link to="/" className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm transition-all">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
