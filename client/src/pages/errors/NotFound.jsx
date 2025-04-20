import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
        <p className="mb-6 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;