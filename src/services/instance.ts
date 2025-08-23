import axios from "axios";


const isMock = true

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(async (config): Promise<any> => {
    if (isMock) {
        return Promise.resolve();
    }
    return config;
})

export default axiosInstance;