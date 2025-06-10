
const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

// Allow configuring the redirect URI through localStorage for flexibility
// This helps when dealing with corporate networks or different environments
const getRedirectUri = (): string => {
  const savedRedirectUri = localStorage.getItem('spotify_redirect_uri');
  if (savedRedirectUri) return savedRedirectUri;
  
  // Default to the current origin + /callback
  return window.location.origin + '/callback';
};

// Function to set a custom redirect URI if needed
export const setSpotifyRedirectUri = (uri: string): void => {
  localStorage.setItem('spotify_redirect_uri', uri);
};

// Define the scopes needed for the app
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-top-read',
  'user-read-recently-played'
];

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
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  images: { url: string }[];
  email: string;
}

class SpotifyApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number = 0;
  private clientId: string | null = null;
  private user: SpotifyUser | null = null;

  constructor() {
    // Try to load tokens from localStorage on initialization
    this.loadTokensFromStorage();
    
    // Check if we're on the callback page
    if (window.location.pathname === '/callback') {
      this.handleAuthCallback();
    }
  }

  private loadTokensFromStorage() {
    const tokenData = localStorage.getItem('spotify_auth_tokens');
    if (tokenData) {
      const { accessToken, refreshToken, expiry, clientId } = JSON.parse(tokenData);
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.tokenExpiry = expiry;
      this.clientId = clientId;
    }
  }

  private saveTokensToStorage() {
    if (this.accessToken && this.refreshToken && this.clientId) {
      localStorage.setItem('spotify_auth_tokens', JSON.stringify({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiry: this.tokenExpiry,
        clientId: this.clientId
      }));
    }
  }

  private async handleAuthCallback() {
    // Extract the authorization code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      console.error('Authentication error:', error);
      return;
    }
    
    if (code && this.clientId) {
      try {
        // Exchange code for access token
        const response = await fetch(SPOTIFY_TOKEN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: getRedirectUri(),
            client_id: this.clientId,
          }).toString()
        });
        
        if (!response.ok) {
          throw new Error('Failed to get access token');
        }
        
        const data = await response.json();
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000);
        
        // Save tokens
        this.saveTokensToStorage();
        
        // Redirect back to the main page
        window.history.replaceState({}, document.title, '/');
      } catch (error) {
        console.error('Error exchanging code for token:', error);
      }
    }
  }

  async initiateLogin(credentials: SpotifyApiCredentials) {
    const { clientId } = credentials;
    this.clientId = clientId;
    localStorage.setItem('spotify_credentials', JSON.stringify({ clientId }));
    
    // Generate random state for security
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('spotify_auth_state', state);
    
    // Build the authorization URL
    const authUrl = new URL(SPOTIFY_AUTH_URL);
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', getRedirectUri());
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', SCOPES.join(' '));
    
    // Redirect to Spotify authorization page
    window.location.href = authUrl.toString();
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken || !this.clientId) return false;
    
    try {
      const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: this.clientId,
        }).toString()
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      // If a new refresh token is provided, update it
      if (data.refresh_token) {
        this.refreshToken = data.refresh_token;
      }
      
      this.saveTokensToStorage();
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  private async getAccessToken(): Promise<string | null> {
    // If token is expired or about to expire (within 5 minutes), refresh it
    if (this.accessToken && this.tokenExpiry > Date.now() + 300000) {
      return this.accessToken;
    }
    
    if (this.refreshToken) {
      const success = await this.refreshAccessToken();
      if (success) return this.accessToken;
    }
    
    return null;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const token = await this.getAccessToken();
    if (!token) throw new Error('No access token available');

    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${SPOTIFY_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  }

  async getUserProfile(): Promise<SpotifyUser | null> {
    if (this.user) return this.user;
    
    try {
      const userData = await this.makeRequest('/me');
      this.user = userData;
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async getUserPlaylists(limit: number = 20): Promise<SpotifyPlaylist[]> {
    try {
      const data = await this.makeRequest(`/me/playlists?limit=${limit}`);
      return data.items;
    } catch (error) {
      console.error('Error fetching user playlists:', error);
      return [];
    }
  }
  
  async getFeaturedPlaylists(limit: number = 20): Promise<SpotifyPlaylist[]> {
    try {
      const data = await this.makeRequest(`/browse/featured-playlists?limit=${limit}`);
      return data.playlists.items;
    } catch (error) {
      console.error('Error fetching featured playlists:', error);
      return this.getMockPlaylists(limit);
    }
  }
  
  async getSavedTracks(limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const data = await this.makeRequest(`/me/tracks?limit=${limit}`);
      return data.items.map((item: any) => item.track);
    } catch (error) {
      console.error('Error fetching saved tracks:', error);
      return [];
    }
  }
  
  async getTopTracks(limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const data = await this.makeRequest(`/me/top/tracks?limit=${limit}`);
      return data.items;
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      return [];
    }
  }
  
  getMockPlaylists(limit: number = 20): SpotifyPlaylist[] {
    // Create mock playlists when API fails
    const genres = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical'];
    
    return genres.slice(0, limit).map((genre, index) => ({
      id: `genre-${index}`,
      name: `${genre} Hits`,
      description: `Best ${genre} tracks`,
      images: [{
        url: `https://picsum.photos/id/${(index + 1) * 10}/300/300`
      }],
      tracks: { total: 20 }
    }));
  }

  async getNewReleases(limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const data = await this.makeRequest(`/browse/new-releases?limit=${limit}`);
      
      // For each album, fetch one track to display
      const tracksPromises = data.albums.items.map(async (album: any) => {
        try {
          const albumData = await this.makeRequest(`/albums/${album.id}/tracks?limit=1`);
          return albumData.items.map((track: any) => ({
            id: track.id,
            name: track.name,
            artists: track.artists,
            album: {
              name: album.name,
              images: album.images
            },
            duration_ms: track.duration_ms || 30000,
            preview_url: track.preview_url
          }));
        } catch (error) {
          return [];
        }
      });
      
      const trackArrays = await Promise.all(tracksPromises);
      return trackArrays.flat().slice(0, limit);
    } catch (error) {
      console.error('Error getting new releases:', error);
      return this.getMockTracks(limit);
    }
  }
  
  async getRecentlyPlayed(limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const data = await this.makeRequest(`/me/player/recently-played?limit=${limit}`);
      return data.items.map((item: any) => item.track);
    } catch (error) {
      console.error('Error fetching recently played tracks:', error);
      return [];
    }
  }
  
  getMockTracks(limit: number = 20): SpotifyTrack[] {
    // Create mock tracks when API fails
    const trackNames = [
      'Summer Vibes', 'Midnight Drive', 'Ocean Waves', 'City Lights',
      'Mountain High', 'Desert Wind', 'Rainy Day', 'Starry Night',
      'Morning Coffee', 'Sunset Dreams', 'Urban Jungle', 'Country Roads',
      'Winter Chill', 'Autumn Leaves', 'Spring Bloom', 'Neon Lights',
      'Acoustic Session', 'Electric Feel', 'Jazz Club', 'Classical Morning'
    ];
    
    return trackNames.slice(0, limit).map((name, index) => ({
      id: `mock-${index}`,
      name,
      artists: [{ name: `Artist ${index + 1}` }],
      album: {
        name: `Album ${Math.floor(index / 4) + 1}`,
        images: [{ url: `https://picsum.photos/id/${(index + 1) * 5}/300/300` }]
      },
      duration_ms: 180000 + Math.floor(Math.random() * 120000), // Random duration
      preview_url: null
    }));
  }

  async searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const data = await this.makeRequest(`/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`);
      return data.tracks.items;
    } catch (error) {
      console.error('Error searching tracks:', error);
      // Return filtered mock tracks based on search query
      const mockTracks = this.getMockTracks(limit * 2);
      const lowerQuery = query.toLowerCase();
      
      return mockTracks
        .filter(track => 
          track.name.toLowerCase().includes(lowerQuery) || 
          track.artists.some(artist => artist.name.toLowerCase().includes(lowerQuery)) ||
          track.album.name.toLowerCase().includes(lowerQuery)
        )
        .slice(0, limit);
    }
  }
  
  async searchPlaylists(query: string, limit: number = 20): Promise<SpotifyPlaylist[]> {
    try {
      const data = await this.makeRequest(`/search?q=${encodeURIComponent(query)}&type=playlist&limit=${limit}`);
      return data.playlists.items;
    } catch (error) {
      console.error('Error searching playlists:', error);
      return [];
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const data = await this.makeRequest('/browse/categories?limit=50');
      return data.categories.items.map((cat: any) => cat.name);
    } catch (error) {
      console.error('Error getting categories:', error);
      return ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical', 'R&B', 'Country', 'Indie', 'Metal'];
    }
  }
  
  async getPlaylistTracks(playlistId: string, limit: number = 50): Promise<SpotifyTrack[]> {
    try {
      const data = await this.makeRequest(`/playlists/${playlistId}/tracks?limit=${limit}`);
      return data.items.map((item: any) => item.track);
    } catch (error) {
      console.error(`Error getting tracks for playlist ${playlistId}:`, error);
      return [];
    }
  }

  isConfigured(): boolean {
    return this.accessToken !== null && this.tokenExpiry > Date.now();
  }
  
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = 0;
    this.user = null;
    localStorage.removeItem('spotify_auth_tokens');
    localStorage.removeItem('spotify_credentials');
  }
}

export const spotifyApi = new SpotifyApiService();
