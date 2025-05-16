import axios from 'axios';

const RAILWAY_API =  import.meta.env.VITE_RAILWAY_API

const api = axios.create({
    baseURL: RAILWAY_API,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to set the authorization header with the JWT token
const setAuthHeader = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export { api, setAuthHeader };