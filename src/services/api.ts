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

    console.log('🔍 getOffers called with params:', params);
    console.log('🔍 Full endpoint:', endpoint);
    console.log('🔍 Has token:', !!this.token);

    // Cache offers for shorter duration (2 minutes) as they change more frequently
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.getCachedData(cacheKey);
    if (cached && params?.page === 1) {
      console.log('✅ Using cached offers');
      return cached;
    }

    try {
      const data = await this.makeRequest(endpoint);
      console.log('✅ Offers fetched successfully:', data);
      if (params?.page === 1) {
        this.setCachedData(cacheKey, data);
      }
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch offers:', error);
      throw error;
    }
  }

  async getBanners() {
    // Use new live banners API endpoint
    const BANNER_API_URL = 'https://banner-be.offerlabs.in/api/banners/live';

    const cacheKey = this.getCacheKey('/banners/live');
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      console.log('🎯 Using cached live banners');
      return cached;
    }

    try {
      console.log('🎯 Fetching live banners from:', BANNER_API_URL);
      const response = await fetch(BANNER_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch live banners: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Live banners fetched successfully:', result);

      // API returns { data: [...], message: "..." }
      // Transform to format expected by HomeScreen: [{ image, link, description, vendor }]
      const bannerData = result.data ? result.data.map((banner: any) => {
        console.log('🔄 Transforming banner:', banner);
        const transformed = {
          image: banner.imageUrl,
          link: banner.link || '', // Use link if available, empty string otherwise
          description: banner.description,
          vendor: banner.vendor,
          id: banner.id,
          startDate: banner.startDate,
          endDate: banner.endDate,
          status: banner.status
        };
        console.log('✅ Transformed banner:', transformed);
        return transformed;
      }) : [];

      console.log('📦 Final banner data array:', bannerData);
      console.log('📊 Number of banners:', bannerData.length);

      this.setCachedData(cacheKey, bannerData);
      return bannerData;
    } catch (error) {
      console.error('❌ Error fetching live banners:', error);
      throw error;
    }
  }

  async getBusinessesByCategory(params: {
    category: string;
    radius?: number;
    lat?: number;
    lng?: number;
  }) {
    try {
      console.log('🏪 Fetching businesses by category:', params);

      const queryParams = new URLSearchParams();
      // API doesn't accept category parameter - we'll filter on client side
      if (params.radius) queryParams.append('radius', params.radius.toString());
      if (params.lat) queryParams.append('lat', params.lat.toString());
      if (params.lng) queryParams.append('lng', params.lng.toString());

      // Use the correct endpoint for listing businesses
      const response = await this.makeRequest(`/user/listbusiness?${queryParams.toString()}`);
      console.log('✅ Businesses fetched successfully:', response);

      // Handle response data - check multiple possible structures
      let businessList: any[] = [];

      // API returns { message: '...', businesses: Array(30), total: 30 }
      if (response.businesses && Array.isArray(response.businesses)) {
        businessList = response.businesses;
      } else if (response.data?.businesses && Array.isArray(response.data.businesses)) {
        businessList = response.data.businesses;
      } else if (response.data?.businesses1 && Array.isArray(response.data.businesses1)) {
        businessList = response.data.businesses1;
      } else if (Array.isArray(response.data)) {
        businessList = response.data;
      } else if (Array.isArray(response)) {
        businessList = response;
      }

      console.log('📦 Business list extracted:', businessList.length, 'businesses');

      if (businessList.length > 0) {
        // Transform snake_case properties to camelCase
        const transformBusiness = (business: any) => {
          // Extract category name from nested structure
          let categoryName = '';
          if (business.businessCategory && Array.isArray(business.businessCategory) && business.businessCategory.length > 0) {
            categoryName = business.businessCategory[0].categoryName || '';
          } else {
            categoryName = business.category || business.categoryName || '';
          }

          return {
            id: business.id || '',
            businessName: business.business_name || 'Unknown Business',
            ownerName: business.owner_name || 'N/A',
            phone: business.phone || 'N/A',
            email: business.email || 'N/A',
            category: categoryName,
            address: business.address || 'Address not available',
            rating: business.rating || 4.0,
            distance: business.distance || 0,
            openingHours: business.opening_hours || '9 AM - 9 PM',
            offerCount: business.offer_count || 0,
            image: business.panPhotoUrl || business.adharPhotoUrl || business.storePhotoUrl?.[0] || '',
            latitude: parseFloat(business.latitude) || 0,
            longitude: parseFloat(business.longitude) || 0,
          };
        };

        // If category is "All", return all businesses without filtering
        if (params.category.toLowerCase() === 'all') {
          const transformedBusinesses = businessList.map(transformBusiness);
          console.log(`✅ Returning all ${transformedBusinesses.length} businesses (no category filter)`);
          console.log('✅ Transformed businesses:', transformedBusinesses);
          return {
            success: true,
            data: transformedBusinesses
          };
        }

        console.log('🔍 All businesses before filtering:', businessList.map((b: any) => ({
          name: b.business_name || b.businessName || b.name,
          category: b.businessCategory?.[0]?.categoryName || b.category || b.categoryName
        })));

        const filteredBusinesses = businessList.filter((business: any) => {
          // Handle nested category structure: businessCategory[0].categoryName
          let businessCategory = '';

          if (business.businessCategory && Array.isArray(business.businessCategory) && business.businessCategory.length > 0) {
            businessCategory = business.businessCategory[0].categoryName || '';
          } else {
            businessCategory = business.category || business.categoryName || '';
          }

          console.log(`Comparing: "${businessCategory}" with "${params.category}"`);
          return businessCategory.toLowerCase() === params.category.toLowerCase();
        });

        console.log(`✅ Filtered ${filteredBusinesses.length} businesses for category: ${params.category}`);

        // Transform filtered businesses
        const transformedBusinesses = filteredBusinesses.map(transformBusiness);

        return {
          success: true,
          data: transformedBusinesses
        };
      } else {
        // No businesses found
        console.log('⚠️ No businesses found in list');
        return {
          success: true,
          data: []
        };
      }
    } catch (error) {
      console.error('❌ Error fetching businesses:', error);
      throw error;
    }
  }

  async getBusinessDetails(businessId: string) {
    try {
      console.log('🏪 Fetching business details for:', businessId);

      const response = await this.makeRequest(`/businesses/${businessId}`);
      console.log('✅ Business details fetched successfully:', response);

      return response;
    } catch (error) {
      console.error('❌ Error fetching business details:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default ApiService;