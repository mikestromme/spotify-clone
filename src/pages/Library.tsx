
import { useState } from "react";
import { Search, Plus, GridIcon, ListIcon } from "lucide-react";
import { featuredPlaylists } from "@/data/mockData";

const Library = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Library</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 text-spotify-lightest hover:text-spotify-white">
            <Search size={20} />
          </button>
          <button className="p-2 text-spotify-lightest hover:text-spotify-white">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full bg-spotify-light text-sm font-medium">
            Playlists
          </button>
          <button className="px-3 py-1 rounded-full text-sm font-medium text-spotify-lightest hover:text-spotify-white">
            Albums
          </button>
          <button className="px-3 py-1 rounded-full text-sm font-medium text-spotify-lightest hover:text-spotify-white">
            Artists
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className={`p-1 rounded ${viewMode === "grid" ? "text-spotify-white bg-spotify-light" : "text-spotify-lightest"}`}
            onClick={() => setViewMode("grid")}
          >
            <GridIcon size={18} />
          </button>
          <button 
            className={`p-1 rounded ${viewMode === "list" ? "text-spotify-white bg-spotify-light" : "text-spotify-lightest"}`}
            onClick={() => setViewMode("list")}
          >
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {featuredPlaylists.map((playlist) => (
            <div key={playlist.id} className="playlist-card animate-fade-in">
              <div className="relative mb-4">
                <img 
                  src={playlist.coverUrl} 
                  alt={playlist.name} 
                  className="w-full aspect-square object-cover rounded shadow-lg"
                />
              </div>
              <h3 className="font-bold truncate mb-1">{playlist.name}</h3>
              <p className="text-sm text-spotify-lightest">Playlist</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {featuredPlaylists.map((playlist) => (
            <div key={playlist.id} className="flex items-center p-2 rounded-md hover:bg-spotify-light transition-colors animate-fade-in">
              <img 
                src={playlist.coverUrl} 
                alt={playlist.name} 
                className="w-12 h-12 rounded object-cover mr-4"
              />
              <div>
                <h3 className="font-medium">{playlist.name}</h3>
                <p className="text-sm text-spotify-lightest">Playlist • You</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
