import React from 'react';
import Button from '../common/Button';

interface VehicleCardProps {
    vehicle: {
        id: string;
        vehicle_number: string;
        vehicle_type: string;
        fastag_balance: number;
    };
    onRecharge: (vehicleId: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onRecharge }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col justify-between border border-gray-200">
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{vehicle.vehicle_number}</h3>
                <p className="text-gray-600 text-lg mb-1">Type: <span className="font-semibold">{vehicle.vehicle_type}</span></p>
                <p className="text-gray-600 text-lg mb-4">Balance: <span className={`font-bold ${vehicle.fastag_balance < 100 ? 'text-red-500' : 'text-green-600'}`}>₹ {vehicle.fastag_balance.toFixed(2)}</span></p>
            </div>
            <Button onClick={() => onRecharge(vehicle.id)} className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-all duration-300">
                Recharge
            </Button>
        </div>
    );
};

export default VehicleCard;