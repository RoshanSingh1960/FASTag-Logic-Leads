import React, { useState } from 'react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../context/AuthContext';

interface AddVehicleFormProps {
    onVehicleAdded: () => void;
    onCancel: () => void;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ onVehicleAdded, onCancel }) => {
    const { user } = useAuth();
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleType, setVehicleType] = useState('Car');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!user) {
            setError('You must be logged in to add a vehicle.');
            setLoading(false);
            return;
        }

        const { error: insertError } = await supabase
            .from('vehicles')
            .insert({
                user_id: user.id,
                vehicle_number: vehicleNumber,
                vehicle_type: vehicleType,
                fastag_balance: 0, // Initial balance
            });

        if (insertError) {
            setError(insertError.message);
        } else {
            onVehicleAdded();
            setVehicleNumber('');
            setVehicleType('Car');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl border border-blue-200 animate-slide-in-up">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Add New Vehicle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    label="Vehicle Number"
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    required
                    placeholder="Enter Vehicle Number"
                />
                <div>
                    <label htmlFor="vehicle-type" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Type</label>
                    <select
                        id="vehicle-type"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="shadow border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                        <option value="Car">Car</option>
                        <option value="Truck">Truck</option>
                        <option value="Bus">Bus</option>
                        <option value="Two-Wheeler">Two-Wheeler</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
                <div className="flex justify-end space-x-4">
                    <Button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-5 rounded-md">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-md transition-all duration-300 transform hover:scale-105">
                        {loading ? <LoadingSpinner /> : 'Add Vehicle'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddVehicleForm;