import axios from "axios";

// Create axios instance for backend API
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL , // Backend server URL from env
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout for file uploads
});

// Request interceptor for logging and auth
axiosInstance.interceptors.request.use((config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    
    // Add Authorization header if token exists
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    }
    
    return config;
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.config?.url, error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;