import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProfilePage from './pages/ProfilePage';
import { Button } from "@/components/ui/button"
import { api, setAuthHeader } from './lib/api';
import { toast } from 'sonner';


const App = () => {
    const [user, setUser] = useState<{ _id: string; username: string; name: string; createdAt: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | undefined>();
    const [registerError, setRegisterError] = useState<string | undefined>();

    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthHeader(token);
            setIsLoading(true);
            api.get('/profile')
                .then(response => {
                    setUser(response.data.user);
                })
                .catch(error => {
                    console.error("Profile fetch error", error)
                    localStorage.removeItem('token');
                    setAuthHeader(null);
                    setUser(null);
                    toast.error("Session expired, please log in")
                    // If fetching profile fails and user is on profile, redirect to login
                    if (window.location.pathname === '/profile') {
                        navigate('/login', { replace: true }); // Use replace
                    }
                })
                .finally(() => setIsLoading(false));
        } else {
            if (window.location.pathname === '/profile') {
                navigate('/login', { replace: true }); // Use replace
            }
        }
    }, [navigate]);


    const handleLogin = async (data: any) => {
        setIsLoading(true);
        setLoginError(undefined);
        try {
            const response = await api.post('/login', data); // Use the correct API endpoint
            const { token, user } = response.data;
            setUser(user);
            localStorage.setItem('token', token); // Store the token
            setAuthHeader(token);        //set the authorization header
            toast.success("Logged in")
            navigate('/profile', { replace: true }); // Use replace: true after login/register
        } catch (error: any) {
            setLoginError(error.response?.data?.message || 'Login failed');
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (data: any) => {
        setIsLoading(true);
        setRegisterError(undefined);
        try {
            const response = await api.post('/register', data); // Use the correct API endpoint
            const { token, user } = response.data;
            setUser(user);
            localStorage.setItem('token', token); // Store the token
            setAuthHeader(token);
            toast.success("Registered")
            navigate('/profile', { replace: true }); // Use replace: true after login/register
        } catch (error: any) {
            setRegisterError(error.response?.data?.message || 'Registration failed');
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        setAuthHeader(null); // Clear the authorization header
        toast.success("Logged out")
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Routes>
                <Route
                    path="/"
                    element={user ? <Navigate to="/profile" replace={true} /> : <Navigate to="/login" replace={true} />}
                />
                <Route
                    path="/login"
                    element={
                        user ? <Navigate to="/profile" replace={true} /> : ( // Use replace here too
                            <div className="flex items-center justify-center h-screen">
                                <div className="w-full max-w-md">
                                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                                    <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={loginError}/>
                                    <div className="mt-4 text-center">
                                        <Button variant="link" asChild>
                                            <a href="/register">Don't have an account? Register</a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                />
                <Route
                    path="/register"
                    element={
                        user ? <Navigate to="/profile" replace={true} /> : ( // Use replace here too
                            <div className="flex items-center justify-center h-screen">
                                <div className="w-full max-w-md">
                                    <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                                    <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={registerError}/>
                                    <div className="mt-4 text-center">
                                        <Button variant="link" asChild>
                                            <a href="/login">Already have an account? Login</a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                />
                <Route
                    path="/profile"
                    element={user ? (
                        <ProfilePage user={user} onLogout={handleLogout} isLoading={isLoading}/>
                    ) : (
                        <Navigate to="/login" replace={true} />
                    )}
                />
            </Routes>
            {/*<Toaster />*/}
        </div>
    );
};

export default App;