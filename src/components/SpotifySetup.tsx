
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { spotifyApi, setSpotifyRedirectUri } from '@/services/spotifyApi';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, Settings } from 'lucide-react';

interface SpotifySetupProps {
  onSetupComplete: () => void;
}

const SpotifySetup = ({ onSetupComplete }: SpotifySetupProps) => {
  const [clientId, setClientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [redirectUri, setRedirectUri] = useState('');

  // Available server URLs based on the dev server output
  const availableUrls = [
    'http://localhost:8080/callback',
    'http://10.6.10.111:8080/callback',
    'http://10.6.10.71:8080/callback'
  ];

  // Initialize the redirect URI from localStorage or default
  useEffect(() => {
    const storedUri = localStorage.getItem('spotify_redirect_uri');
    setRedirectUri(storedUri || availableUrls[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Spotify Client ID",
        variant: "destructive"
      });
      return;
    }

    // Save the custom redirect URI if provided
    if (redirectUri && redirectUri !== window.location.origin + '/callback') {
      setSpotifyRedirectUri(redirectUri);
    }

    setIsLoading(true);
    try {
      // Start the OAuth flow
      await spotifyApi.initiateLogin({ clientId });
      // Note: This will redirect the user to Spotify, so we don't need to call onSetupComplete here
      // The callback handling is done in the SpotifyApiService
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate Spotify authentication.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect to Spotify</CardTitle>
          <CardDescription>
            Connect your Spotify account to access your playlists, saved tracks, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-muted">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Important Setup Information</AlertTitle>
            <AlertDescription>
              <p className="mt-2">You'll need to add the following redirect URI to your Spotify app:</p>
              <code className="block p-2 mt-1 mb-2 bg-background rounded text-xs">
                {redirectUri}
              </code>
              <p>This must be added in your <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Spotify Developer Dashboard</a>.</p>
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium mb-1">
                Client ID
              </label>
              <Input
                id="clientId"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Your Spotify Client ID"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-xs"
                onClick={toggleAdvanced}
              >
                <Settings className="h-3 w-3" />
                {showAdvanced ? 'Hide Advanced' : 'Advanced Settings'}
              </Button>
            </div>
            
            {showAdvanced && (
              <div className="p-3 border rounded-md bg-muted/30">
                <div className="mb-4">
                  <label htmlFor="redirectUri" className="block text-sm font-medium mb-1">
                    Custom Redirect URI
                  </label>
                  <Input
                    id="redirectUri"
                    type="text"
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                    placeholder="e.g., https://localhost:8080/callback"
                  />
                  
                  <div className="mt-3">
                    <p className="text-xs font-medium mb-2">Quick Select Available URLs:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableUrls.map((url, index) => (
                        <Button 
                          key={index} 
                          type="button" 
                          variant={redirectUri === url ? "default" : "outline"}
                          size="sm"
                          className="text-xs py-1 h-auto"
                          onClick={() => setRedirectUri(url)}
                        >
                          {url.includes('localhost') ? 'localhost' : url.split('/')[2].split(':')[0]}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-3">
                    <strong>Important:</strong> Add the exact URI above to your Spotify Developer Dashboard.
                  </p>
                </div>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Connect to Spotify'}
            </Button>
          </form>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Don't have API credentials? Create an app at{' '}
              <a 
                href="https://developer.spotify.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
              >
                Spotify Developer Dashboard
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpotifySetup;
