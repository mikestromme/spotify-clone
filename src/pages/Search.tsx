
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { categories } from "@/data/mockData";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
    </div>
  );
};

export default Search;
