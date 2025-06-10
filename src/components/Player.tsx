
import { useState } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, 
  Repeat, Shuffle, ListMusic
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);

  return (
    <div className="h-20 bg-spotify-black border-t border-spotify-light px-4 flex items-center justify-between">
      <div className="flex items-center w-1/4">
        <div className="h-14 w-14 bg-spotify-light rounded mr-3 flex-shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=100&h=100" 
            alt="Album cover" 
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="mr-4">
          <h4 className="text-sm font-medium">Synthwave Dreams</h4>
          <p className="text-xs text-spotify-lightest">Electronic Artist</p>
        </div>
        <button className="text-spotify-lightest hover:text-spotify-white">
          <Heart size={16} />
        </button>
      </div>

      <div className="flex flex-col items-center max-w-2xl w-2/4">
        <div className="flex items-center gap-4 mb-2">
          <button className="text-spotify-lightest hover:text-spotify-white">
            <Shuffle size={18} />
          </button>
          <button className="text-spotify-lightest hover:text-spotify-white">
            <SkipBack size={18} />
          </button>
          <button 
            className="h-8 w-8 rounded-full bg-spotify-white flex items-center justify-center hover:scale-105 transition-transform"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={18} className="text-black" /> : <Play size={18} className="text-black ml-0.5" />}
          </button>
          <button className="text-spotify-lightest hover:text-spotify-white">
            <SkipForward size={18} />
          </button>
          <button className="text-spotify-lightest hover:text-spotify-white">
            <Repeat size={18} />
          </button>
        </div>
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-spotify-lightest">1:26</span>
          <div className="flex-1">
            <Slider
              defaultValue={[33]}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>
          <span className="text-xs text-spotify-lightest">3:45</span>
        </div>
      </div>

      <div className="flex items-center justify-end w-1/4 gap-3">
        <button className="text-spotify-lightest hover:text-spotify-white">
          <ListMusic size={18} />
        </button>
        <button className="text-spotify-lightest hover:text-spotify-white">
          <Volume2 size={18} />
        </button>
        <div className="w-24">
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="cursor-pointer"
          />
        </div>
        <button className="text-spotify-lightest hover:text-spotify-white">
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default Player;
