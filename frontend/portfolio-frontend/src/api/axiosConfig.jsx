import axios from 'axios';

// Create a new Axios instance with a base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Your backend's base URL
});

/**
 * Axios Request Interceptor
 * * This is the magic part. Before any request is sent using this `apiClient`,
 * this function runs, gets the token from localStorage, and attaches it to the
 * Authorization header.
 */
apiClient.interceptors.request.use(
  (config) => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // 2. If the token exists, add it to the Authorization header
    if (token) {
      // The backend (Spring Security) expects the header in this "Bearer <token>" format
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle any errors that occur during the request setup
    return Promise.reject(error);
  }
);

export default apiClient;
