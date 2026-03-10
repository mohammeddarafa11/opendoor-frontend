import { useRouteError, Link, isRouteErrorResponse } from "react-router-dom";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();

  let status = 500;
  let message = "Something went wrong";
  let description = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.statusText || message;
    description = error.data?.message || description;
  } else if (error instanceof Error) {
    message = error.message;
  }

  if (status === 404) {
    message = "Page Not Found";
    description =
      "The page you're looking for doesn't exist or has been moved.";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="text-6xl font-bold text-gray-300 mb-2">{status}</h1>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{message}</h2>
          <p className="text-gray-600 text-sm mb-6">{description}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
