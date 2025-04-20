import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="mb-6">You don't have permission to view this page.</p>
        <Link
          to="/signup"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
