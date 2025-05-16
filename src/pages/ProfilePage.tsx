import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProfilePageProps {
    user: {
        _id: string;
        username: string;
        name: string;
        createdAt: string;
    } | null;
    onLogout: () => void;
    isLoading: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card>
                    <CardHeader>
                        <CardTitle>Not Logged In</CardTitle>
                        <CardDescription>
                            Please log in to view your profile.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={onLogout}>Go to Login</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const formattedDate = new Date(user.createdAt).toLocaleDateString(
        undefined, // use the user's locale
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }
    );


    return (
        <div className="flex items-center justify-center h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>
                        Welcome, {user.name}!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Username:</h3>
                        <p className="text-gray-500">{user.username}</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Name:</h3>
                        <p className="text-gray-500">{user.name}</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Joined At:</h3>
                        <p className="text-gray-500">{formattedDate}</p>
                    </div>
                    <Button onClick={onLogout} className="w-full">Logout</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;