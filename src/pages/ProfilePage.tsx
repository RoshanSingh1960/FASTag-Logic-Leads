import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabase';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';

interface Profile {
    id: string;
    full_name: string;
    avatar_url: string | null;
}

const ProfilePage: React.FC = () => {
    const { user, loading: authLoading, session } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fullName, setFullName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login'); // Redirect to login if not authenticated
        } else if (user) {
            fetchProfile();
        }
    }, [user, authLoading, navigate]);

    const fetchProfile = async () => {
        setLoading(true);
        setError('');
        if (!user) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', user.id)
            .single();

        if (error) {
            setError(error.message);
            setProfile(null);
        } else {
            setProfile(data);
            setFullName(data.full_name || '');
        }
        setLoading(false);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        if (!user) {
            setError('User not authenticated.');
            setSaving(false);
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName, updated_at: new Date().toISOString() })
            .eq('id', user.id);

        if (error) {
            setError(error.message);
        } else {
            await fetchProfile(); // Re-fetch to update state
            setIsEditing(false);
        }
        setSaving(false);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error.message);
        } else {
            navigate('/login'); // Redirect to login after logout
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-160px)]">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-8 text-center text-red-600">
                <p>Error: {error}</p>
                <Button onClick={fetchProfile} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 max-w-2xl bg-white shadow-lg rounded-lg my-8 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center animate-slide-in-up">Your Profile</h2>

            {profile ? (
                <div className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 mb-4 shadow-md" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-5xl font-bold mb-4 border-4 border-blue-500 shadow-md">
                                {profile.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase() || '?'}
                            </div>
                        )}
                        <p className="text-xl font-semibold text-gray-700">{user?.email}</p>
                    </div>

                    {!isEditing ? (
                        <div className="bg-gray-50 p-6 rounded-md shadow-sm">
                            <p className="text-lg font-medium text-gray-600 mb-2">Full Name:</p>
                            <p className="text-2xl font-bold text-gray-800">{profile.full_name || 'Not set'}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="bg-gray-50 p-6 rounded-md shadow-sm">
                            <InputField
                                label="Full Name"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="mb-4"
                            />
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    disabled={saving}
                                >
                                    {saving ? <LoadingSpinner /> : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="flex justify-center space-x-4 mt-8">
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                                Edit Profile
                            </Button>
                        )}
                        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
                            Logout
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-xl text-gray-600">No profile data found. You might need to create one.</p>
                    <Button onClick={fetchProfile} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                        Reload Profile
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;