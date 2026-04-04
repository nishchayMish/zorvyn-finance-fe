import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    res => res,
    async error => {
        if (error.response.status === 401) {
            try {
                await axios.get(`${API_BASE_URL}/api/users/refresh`, {
                    withCredentials: true
                })
                return api(error.config)
            } catch (error) {
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)

export default api;