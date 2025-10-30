import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabase';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import VehicleCard from '../components/vehicles/VehicleCard';
import AddVehicleForm from '../components/vehicles/AddVehicleForm';
import Button from '../components/common/Button';

interface Vehicle {
    id: string;
    vehicle_number: string;
    vehicle_type: string;
    fastag_balance: number;
}

const DashboardPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        } else if (user) {
            fetchVehicles();
        }
    }, [user, authLoading, navigate]);

    const fetchVehicles = async () => {
        setLoading(true);
        setError('');
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('user_id', user?.id);

        if (error) {
            setError(error.message);
        } else {
            setVehicles(data || []);
        }
        setLoading(false);
    };

    const handleAddVehicle = () => {
        setShowAddVehicleForm(true);
    };

    const handleVehicleAdded = () => {
        setShowAddVehicleForm(false);
        fetchVehicles(); // Refresh the list
    };

    if (authLoading || loading) {
        return <div className="flex justify-center items-center h-[calc(100vh-160px)]"><LoadingSpinner /></div>;
    }

    return (
        <div className="container mx-auto p-8 animate-slide-in-up">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Vehicles</h2>

            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <div className="flex justify-end mb-6">
                <Button onClick={handleAddVehicle} className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                    Add New Vehicle
                </Button>
            </div>

            {showAddVehicleForm && (
                <div className="mb-8">
                    <AddVehicleForm onVehicleAdded={handleVehicleAdded} onCancel={() => setShowAddVehicleForm(false)} />
                </div>
            )}

            {vehicles.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">No vehicles added yet. Add one to get started!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} onRecharge={() => navigate(`/recharge?vehicleId=${vehicle.id}`)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;