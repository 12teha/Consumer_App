import { config } from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

class ApiService {
  private token: string | null = null;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.token = localStorage.getItem('token');
    // Re-set cookie if token exists in localStorage
    if (this.token) {
      document.cookie = `token=${this.token}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}:${JSON.stringify(params || {})}`;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Send token in both Cookie (for same-domain) and Authorization header (for cross-domain)
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      console.log('Making API request:', {
        url,
        method: options.method || 'GET',
        hasToken: !!this.token,
        credentials: 'include'
      });

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      console.log('API response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);

        if (response.status === 401) {
          this.clearToken();
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
    // Also set as a cookie for API requests
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    // Clear the cookie
    document.cookie = 'token=; path=/; max-age=0';
    this.cache.clear(); // Clear cache on logout
  }

  clearOffersCache() {
    // Clear only offers cache when location changes
    for (const [key] of this.cache) {
      if (key.includes('/user/offer')) {
        this.cache.delete(key);
      }
    }
  }

  async getOTP(phone: string) {
    return this.makeRequest('/user/auth/getotp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOTP(phone: string, otpCode: string) {
    console.log('Verifying OTP for phone:', phone);
    const response = await this.makeRequest('/user/auth/verifyotp', {
      method: 'POST',
      body: JSON.stringify({ phone, otpCode }),
    });

    console.log('OTP verification response:', response);

    if (response.token) {
      console.log('Token received, saving...');
      this.setToken(response.token);
      console.log('Token saved successfully');
    } else {
      console.warn('No token in response!');
    }

    return response;
  }

  async getAllCategories() {
    const cacheKey = this.getCacheKey('/details/business/allcategories');
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    const data = await this.makeRequest('/details/business/allcategories');
    this.setCachedData(cacheKey, data);
    return data;
  }

  async setUserLocation(latitude: number, longitude: number, address: string) {
    console.log('Adding user location:', { latitude, longitude, address });
    console.log('Current token:', this.token ? 'Token exists' : 'No token');
    // Clear location cache
    for (const [key] of this.cache) {
      if (key.includes('/user/location')) {
        this.cache.delete(key);
      }
    }
    try {
      const result = await this.makeRequest('/user/location/addlocation', {
        method: 'POST',
        body: JSON.stringify({ latitude, longitude, address }),
      });
      console.log('Location saved successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to save location:', error);
      throw error;
    }
  }

  async getUserLocation() {
    const cacheKey = this.getCacheKey('/user/location');
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    const data = await this.makeRequest('/user/location/');
    this.setCachedData(cacheKey, data);
    return data;
  }

  async getOffers(params?: { radius?: number; page?: number; limit?: number; category?: string }) {
    const queryParams = new URLSearchParams();

    if (params?.radius) queryParams.append('radius', params.radius.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category && params.category !== 'All') queryParams.append('category', params.category);

    const queryString = queryParams.toString();
    const endpoint = `/user/offer${queryString ? `?${queryString}` : ''}`;

    // Cache offers for shorter duration (2 minutes) as they change more frequently
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.getCachedData(cacheKey);
    if (cached && params?.page === 1) {
      return cached;
    }

    const data = await this.makeRequest(endpoint);
    if (params?.page === 1) {
      this.setCachedData(cacheKey, data);
    }
    return data;
  }
}

export const apiService = new ApiService();
export default ApiService;