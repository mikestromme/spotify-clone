import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Callback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // The actual OAuth callback processing is done in the SpotifyApiService
    // This component just provides feedback and redirects when complete
    
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      setError(errorParam);
    }
    
    // Give the SpotifyApiService time to process the callback
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">Authentication Error</div>
        <div className="text-sm text-muted-foreground">{error}</div>
        <a href="/" className="mt-6 underline">Return to home</a>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-xl mb-4">Connecting to Spotify...</div>
        <div className="w-16 h-16 border-4 border-t-spotify-green border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to home page after processing
  return <Navigate to="/" replace />;
};

export default Callback;
