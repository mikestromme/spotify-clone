
const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  preview_url: string | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
}

export interface SpotifyApiCredentials {
  clientId: string;
  clientSecret: string;
}

class SpotifyApiService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  async setCredentials(credentials: SpotifyApiCredentials) {
    localStorage.setItem('spotify_credentials', JSON.stringify(credentials));
    await this.getAccessToken();
  }

  private async getAccessToken(): Promise<string | null> {
    const credentials = localStorage.getItem('spotify_credentials');
    if (!credentials) return null;

    const { clientId, clientSecret } = JSON.parse(credentials);

    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      return null;
    }
  }

  private async makeRequest(endpoint: string) {
    const token = await this.getAccessToken();
    if (!token) throw new Error('No access token available');

    const response = await fetch(`${SPOTIFY_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  }

  async getFeaturedPlaylists(limit: number = 20): Promise<SpotifyPlaylist[]> {
    const data = await this.makeRequest(`/browse/featured-playlists?limit=${limit}`);
    return data.playlists.items;
  }

  async getNewReleases(limit: number = 20): Promise<SpotifyTrack[]> {
    const data = await this.makeRequest(`/browse/new-releases?limit=${limit}`);
    return data.albums.items.flatMap((album: any) => 
      album.tracks?.items?.map((track: any) => ({
        ...track,
        album: album
      })) || []
    );
  }

  async searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
    const data = await this.makeRequest(`/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`);
    return data.tracks.items;
  }

  async getCategories(): Promise<string[]> {
    const data = await this.makeRequest('/browse/categories?limit=50');
    return data.categories.items.map((cat: any) => cat.name);
  }

  isConfigured(): boolean {
    return localStorage.getItem('spotify_credentials') !== null;
  }
}

export const spotifyApi = new SpotifyApiService();
