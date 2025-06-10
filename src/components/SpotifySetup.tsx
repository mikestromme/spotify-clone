
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { spotifyApi } from '@/services/spotifyApi';
import { toast } from '@/components/ui/use-toast';

interface SpotifySetupProps {
  onSetupComplete: () => void;
}

const SpotifySetup = ({ onSetupComplete }: SpotifySetupProps) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim() || !clientSecret.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both Client ID and Client Secret",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await spotifyApi.setCredentials({ clientId, clientSecret });
      toast({
        title: "Success!",
        description: "Spotify API configured successfully"
      });
      onSetupComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to configure Spotify API. Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect to Spotify</CardTitle>
          <CardDescription>
            Enter your Spotify API credentials to load real music data
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            <div>
              <label htmlFor="clientSecret" className="block text-sm font-medium mb-1">
                Client Secret
              </label>
              <Input
                id="clientSecret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Your Spotify Client Secret"
              />
            </div>
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
