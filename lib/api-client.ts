import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/users/refresh")) {
            originalRequest._retry = true;
            try {
                // Manually call the refresh endpoint to get a new access token (cookie)
                await axios.get(`${BASE_URL}/users/refresh`, {
                    withCredentials: true
                });
                
                // Retry the original request
                return api(originalRequest);
            } catch (err) {
                console.error("Auth Refresh Failed:", err);
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;