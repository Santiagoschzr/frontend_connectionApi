import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Replace with your backend API URL

const api = axios.create({
    baseURL: API_BASE_URL,
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