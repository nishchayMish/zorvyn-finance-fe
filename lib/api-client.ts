import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        // Avoid infinite loop if refresh token fails
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/users/refresh")) {
            originalRequest._retry = true;
            try {
                // Ensure users/refresh is used which results in /api/users/refresh
                await axios.get(`${API_BASE_URL}/users/refresh`, {
                    withCredentials: true
                });
                return api(originalRequest);
            } catch (err) {
                console.error("Refresh token error:", err);
                // Clear state or redirect to login if refresh fails
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;