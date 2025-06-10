
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { spotifyApi, SpotifyTrack } from '@/services/spotifyApi';
import { toast } from '@/components/ui/use-toast';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const loadCategories = async () => {
    try {
      const cats = await spotifyApi.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const results = await spotifyApi.searchTracks(query, 50);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching tracks:', error);
      toast({
        title: "Search Error",
        description: "Failed to search tracks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="sticky top-0 z-10 pt-2 pb-4 bg-spotify-dark mb-4">
        <div className="relative">
          <div className="absolute left-3 top-2.5 text-spotify-lightest">
            <SearchIcon size={20} />
          </div>
          <input
            type="text"
            placeholder="What do you want to listen to?"
            className="w-full h-12 pl-10 pr-4 rounded-full text-spotify-white bg-[#242424] focus:outline-none focus:ring-2 focus:ring-spotify-green"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="pb-8">
        {searchQuery && searchResults.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            {isLoading ? (
              <div className="text-center py-8">Searching...</div>
            ) : (
              <div className="bg-spotify-light bg-opacity-20 rounded-md overflow-hidden">
                <div className="grid gap-4 p-4">
                  {searchResults.map((track) => (
                    <div 
                      key={track.id}
                      className="flex items-center p-3 rounded-md hover:bg-spotify-light hover:bg-opacity-20 transition-colors cursor-pointer"
                    >
                      <img 
                        src={track.album.images[0]?.url || '/placeholder.svg'} 
                        alt={track.album.name} 
                        className="h-12 w-12 object-cover mr-4 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{track.name}</div>
                        <div className="text-sm text-spotify-lightest">
                          {track.artists.map(artist => artist.name).join(', ')} • {track.album.name}
                        </div>
                      </div>
                      <div className="text-sm text-spotify-lightest">
                        {formatDuration(track.duration_ms)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">Browse all</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {categories.map((category, index) => (
                <div 
                  key={index}
                  className="aspect-square rounded-lg relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-[1.02] transition-transform cursor-pointer"
                  style={{ 
                    backgroundColor: `hsl(${(index * 36) % 360}, 70%, 60%)`,
                    backgroundImage: `linear-gradient(45deg, hsl(${(index * 36) % 360}, 70%, 50%), hsl(${((index * 36) + 40) % 360}, 70%, 60%))`
                  }}
                >
                  <div className="absolute inset-0 p-4 flex items-end">
                    <h3 className="text-2xl font-bold">{category}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
