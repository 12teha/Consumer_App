// Authentication utility for managing user sessions

const AUTH_KEY = 'offerbeez_auth';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

interface AuthData {
  isAuthenticated: boolean;
  loginTimestamp: number;
  phoneNumber: string;
  username: string;
  email?: string;
}

export const authService = {
  // Store authentication data after successful login
  setAuth: (data: { phoneNumber: string; username?: string; email?: string }) => {
    const authData: AuthData = {
      isAuthenticated: true,
      loginTimestamp: Date.now(),
      phoneNumber: data.phoneNumber,
      username: data.username || '',
      email: data.email || '',
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  },

  // Get authentication data
  getAuth: (): AuthData | null => {
    try {
      const authDataStr = localStorage.getItem(AUTH_KEY);
      if (!authDataStr) return null;

      const authData: AuthData = JSON.parse(authDataStr);
      return authData;
    } catch (error) {
      console.error('Error getting auth data:', error);
      return null;
    }
  },

  // Check if user session is still valid (within 30 days)
  isSessionValid: (): boolean => {
    const authData = authService.getAuth();
    if (!authData || !authData.isAuthenticated) return false;

    const currentTime = Date.now();
    const sessionAge = currentTime - authData.loginTimestamp;

    // Check if session is within 30 days
    return sessionAge < SESSION_DURATION;
  },

  // Update user data (username, email) without changing session
  updateUserData: (data: { username?: string; email?: string }) => {
    const authData = authService.getAuth();
    if (!authData) return;

    if (data.username) authData.username = data.username;
    if (data.email) authData.email = data.email;

    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  },

  // Clear authentication (logout)
  clearAuth: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  // Get stored user data
  getUserData: () => {
    const authData = authService.getAuth();
    if (!authData) return null;

    return {
      phoneNumber: authData.phoneNumber,
      username: authData.username,
      email: authData.email,
    };
  },
};
