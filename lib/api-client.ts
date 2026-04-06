import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/users/refresh")
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = Cookies.get("refreshToken");

                if (!refreshToken) throw new Error("No refresh token");

                // 🔥 Call refresh API
                const res = await axios.post(`${BASE_URL}/users/refresh`, {
                    refreshToken
                });

                const newAccessToken = res.data.accessToken;

                // ✅ Update cookie
                Cookies.set("accessToken", newAccessToken);

                // ✅ Retry original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (err) {
                console.error("Auth Refresh Failed:", err);

                // ❌ Clear cookies
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                Cookies.remove("role");

                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;