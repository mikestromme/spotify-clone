
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-dark">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-spotify-green">404</h1>
        <p className="text-xl text-spotify-white mb-6">Page not found</p>
        <p className="text-spotify-lightest mb-8">We couldn't find the page you were looking for.</p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-spotify-green text-black rounded-full font-bold hover:scale-105 transition-transform"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
