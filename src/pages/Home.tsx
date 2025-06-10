import { featuredPlaylists, recentlyPlayed, categories } from "@/data/mockData";
import { Clock, Play } from "lucide-react";

const Home = () => {
  return (
    <div className="pb-8">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Good afternoon</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {recentlyPlayed.map((track) => (
            <div 
              key={track.id} 
              className="bg-spotify-light bg-opacity-40 flex items-center rounded-md overflow-hidden hover:bg-opacity-60 transition-all cursor-pointer group"
            >
              <img 
                src={track.coverUrl} 
                alt={track.album} 
                className="h-16 w-16 object-cover"
              />
              <div className="px-4 truncate">{track.title}</div>
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
                  src={playlist.coverUrl} 
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
          <h2 className="text-2xl font-bold">Recently Played</h2>
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
              {recentlyPlayed.map((track, index) => (
                <tr key={track.id} className="track-hover group">
                  <td className="px-4 py-3 text-spotify-lightest">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img 
                        src={track.coverUrl} 
                        alt={track.album} 
                        className="h-10 w-10 object-cover mr-3 rounded"
                      />
                      <div>
                        <div className="font-medium">{track.title}</div>
                        <div className="text-sm text-spotify-lightest">{track.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-spotify-lightest">{track.album}</td>
                  <td className="px-4 py-3 text-spotify-lightest text-right">{track.duration}</td>
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
