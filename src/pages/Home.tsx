
import { useState, useEffect } from 'react';
import { Clock, Play } from "lucide-react";
import { spotifyApi, SpotifyTrack, SpotifyPlaylist } from '@/services/spotifyApi';
import SpotifySetup from '@/components/SpotifySetup';
import { toast } from '@/components/ui/use-toast';

const Home = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [featuredPlaylists, setFeaturedPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [newReleases, setNewReleases] = useState<SpotifyTrack[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const configured = spotifyApi.isConfigured();
    setIsConfigured(configured);
    if (configured) {
      loadSpotifyData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadSpotifyData = async () => {
    try {
      setIsLoading(true);
      const [playlists, tracks, cats] = await Promise.all([
        spotifyApi.getFeaturedPlaylists(12),
        spotifyApi.getNewReleases(8),
        spotifyApi.getCategories()
      ]);
      
      setFeaturedPlaylists(playlists);
      setNewReleases(tracks);
      setCategories(cats.slice(0, 11));
    } catch (error) {
      console.error('Error loading Spotify data:', error);
      toast({
        title: "Error",
        description: "Failed to load Spotify data. Please check your API credentials.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setIsConfigured(true);
    loadSpotifyData();
  };

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isConfigured) {
    return <SpotifySetup onSetupComplete={handleSetupComplete} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading Spotify data...</div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Good afternoon</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {newReleases.slice(0, 6).map((track) => (
            <div 
              key={track.id} 
              className="bg-spotify-light bg-opacity-40 flex items-center rounded-md overflow-hidden hover:bg-opacity-60 transition-all cursor-pointer group"
            >
              <img 
                src={track.album.images[0]?.url || '/placeholder.svg'} 
                alt={track.album.name} 
                className="h-16 w-16 object-cover"
              />
              <div className="px-4 truncate">{track.name}</div>
              <div className="ml-auto mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="h-10 w-10 rounded-full bg-spotify-green flex items-center justify-center shadow-lg">
                  <Play className="text-black ml-0.5" size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Playlists</h2>
          <a href="#" className="text-xs font-bold uppercase text-spotify-lightest hover:underline">See all</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {featuredPlaylists.map((playlist) => (
            <div key={playlist.id} className="playlist-card group">
              <div className="relative mb-4">
                <img 
                  src={playlist.images[0]?.url || '/placeholder.svg'} 
                  alt={playlist.name} 
                  className="w-full aspect-square object-cover rounded shadow-lg"
                />
                <button className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-spotify-green flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                  <Play className="text-black ml-0.5" size={20} />
                </button>
              </div>
              <h3 className="font-bold truncate mb-1">{playlist.name}</h3>
              <p className="text-sm text-spotify-lightest truncate-2">{playlist.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Releases</h2>
        </div>
        <div className="bg-spotify-light bg-opacity-20 rounded-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-spotify-light text-spotify-lightest text-sm">
              <tr>
                <th className="px-4 py-2 w-8">#</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Album</th>
                <th className="px-4 py-2 flex justify-end">
                  <Clock size={16} />
                </th>
              </tr>
            </thead>
            <tbody>
              {newReleases.map((track, index) => (
                <tr key={track.id} className="track-hover group">
                  <td className="px-4 py-3 text-spotify-lightest">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img 
                        src={track.album.images[0]?.url || '/placeholder.svg'} 
                        alt={track.album.name} 
                        className="h-10 w-10 object-cover mr-3 rounded"
                      />
                      <div>
                        <div className="font-medium">{track.name}</div>
                        <div className="text-sm text-spotify-lightest">
                          {track.artists.map(artist => artist.name).join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-spotify-lightest">{track.album.name}</td>
                  <td className="px-4 py-3 text-spotify-lightest text-right">
                    {formatDuration(track.duration_ms)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
          <a href="#" className="text-xs font-bold uppercase text-spotify-lightest hover:underline">See all</a>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <a 
              href="#" 
              key={index} 
              className="bg-spotify-light text-spotify-white px-4 py-2 rounded-full text-sm font-medium hover:bg-spotify-green hover:text-black transition-colors"
            >
              {category}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
