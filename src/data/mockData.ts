
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
}

export const featuredPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Today's Top Hits",
    description: "The hottest tracks right now",
    coverUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=300",
    tracks: []
  },
  {
    id: "2",
    name: "Chill Vibes",
    description: "Relaxing music to unwind",
    coverUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=300&h=300",
    tracks: []
  },
  {
    id: "3",
    name: "Workout Energy",
    description: "Power your fitness routine",
    coverUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=300&h=300",
    tracks: []
  },
  {
    id: "4",
    name: "Indie Mix",
    description: "Fresh indie tracks you'll love",
    coverUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=300",
    tracks: []
  },
  {
    id: "5",
    name: "Focus Flow",
    description: "Tune out distractions and get in the zone",
    coverUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=300&h=300",
    tracks: []
  },
  {
    id: "6",
    name: "Throwback Classics",
    description: "Hits from the past decades",
    coverUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=300&h=300",
    tracks: []
  }
];

export const recentlyPlayed: Track[] = [
  {
    id: "101",
    title: "Synthwave Dreams",
    artist: "Electronic Artist",
    album: "Neon Nights",
    duration: "3:45",
    coverUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "102",
    title: "Midnight Drive",
    artist: "Night Cruiser",
    album: "Urban Lights",
    duration: "4:20",
    coverUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "103",
    title: "Summer Memories",
    artist: "Sunshine Band",
    album: "Golden Days",
    duration: "3:15",
    coverUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=300&h=300"
  },
  {
    id: "104",
    title: "Urban Flow",
    artist: "City Sounds",
    album: "Metropolitan",
    duration: "2:55",
    coverUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=300"
  }
];

export const categories = [
  "Pop", "Hip-Hop", "Rock", "Electronic", "Latin", "Indie", "R&B", "K-pop", "Metal", "Jazz", "Classical"
];
