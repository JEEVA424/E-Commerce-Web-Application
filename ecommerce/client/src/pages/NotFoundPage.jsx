// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-extrabold text-gray-200 dark:text-gray-700 mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <FiHome /> Go Home
      </Link>
    </div>
  );
}
