
import { Home, Search, Library, Plus, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-60 bg-spotify-black h-full flex flex-col">
      <div className="p-6">
        <div className="text-2xl font-bold mb-8 text-spotify-white">
          <span className="text-spotify-green">Spotifake</span>
        </div>
        <nav className="space-y-6">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-spotify-white flex items-center gap-4 p-2 hover:text-spotify-green transition-colors">
                <Home size={24} />
                <span className="font-medium">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/search" className="text-spotify-lightest flex items-center gap-4 p-2 hover:text-spotify-white transition-colors">
                <Search size={24} />
                <span className="font-medium">Search</span>
              </Link>
            </li>
            <li>
              <Link to="/library" className="text-spotify-lightest flex items-center gap-4 p-2 hover:text-spotify-white transition-colors">
                <Library size={24} />
                <span className="font-medium">Your Library</span>
              </Link>
            </li>
          </ul>
          <div className="pt-5 space-y-2">
            <button className="text-spotify-lightest flex items-center gap-4 p-2 hover:text-spotify-white transition-colors w-full text-left">
              <div className="bg-spotify-lightest rounded-sm p-1">
                <Plus size={18} className="text-spotify-black" />
              </div>
              <span className="font-medium">Create Playlist</span>
            </button>
            <button className="text-spotify-lightest flex items-center gap-4 p-2 hover:text-spotify-white transition-colors w-full text-left">
              <div className="bg-gradient-to-br from-indigo-600 to-spotify-green rounded-sm p-1">
                <Heart size={18} className="text-spotify-white" />
              </div>
              <span className="font-medium">Liked Songs</span>
            </button>
          </div>
        </nav>
      </div>
      <div className="mt-2 px-5">
        <div className="border-t border-spotify-light pt-5 text-xs text-spotify-lightest">
          <div className="flex flex-wrap gap-2 pb-5">
            <a href="#" className="hover:underline">Legal</a>
            <a href="#" className="hover:underline">Privacy Center</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookies</a>
            <a href="#" className="hover:underline">About Ads</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
