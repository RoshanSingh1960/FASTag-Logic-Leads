import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';

interface Vehicle {
    id: string;
    vehicle_number: string;
    fastag_balance: number;
}

const RechargePage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [rechargeAmount, setRechargeAmount] = useState<number | ''>('');
    const [paymentMethod, setPaymentMethod] = useState('UPI'); // Default payment method
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Payment flow steps
    const [currentStep, setCurrentStep] = useState(1); // 1: Select Vehicle/Amount, 2: Select Payment, 3: Confirmation

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        } else if (user) {
            fetchVehicles();
            const vehicleIdFromUrl = searchParams.get('vehicleId');
            if (vehicleIdFromUrl) {
                setSelectedVehicleId(vehicleIdFromUrl);
            }
        }
    }, [user, authLoading, navigate, searchParams]);

    const fetchVehicles = async () => {
        setLoading(true);
        setError('');
        const { data, error } = await supabase
            .from('vehicles')
            .select('id, vehicle_number, fastag_balance')
            .eq('user_id', user?.id);

        if (error) {
            setError(error.message);
        } else {
            setVehicles(data || []);
            // If only one vehicle, pre-select it
            if (data && data.length === 1) {
                setSelectedVehicleId(data[0].id);
            }
        }
        setLoading(false);
    };

    const handleProceedToPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!selectedVehicleId) {
            setError('Please select a vehicle.');
            return;
        }
        if (!rechargeAmount || rechargeAmount <= 0) {
            setError('Please enter a valid recharge amount.');
            return;
        }
        setCurrentStep(2);
    };

    const handleSimulatePayment = async () => {
        setSubmitting(true);
        setError('');
        setSuccessMessage('');

        if (!user || !selectedVehicleId || !rechargeAmount) {
            setError('Missing necessary information for payment.');
            setSubmitting(false);
            return;
        }

        try {
            // Simulate payment gateway interaction (in a real app, this would be server-side)
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

            // Update vehicle balance
            const { data: updatedVehicle, error: updateError } = await supabase
                .from('vehicles')
                .update({ fastag_balance: (vehicles.find(v => v.id === selectedVehicleId)?.fastag_balance || 0) + rechargeAmount })
                .eq('id', selectedVehicleId)
                .select()
                .single();

            if (updateError) {
                throw new Error(updateError.message);
            }

            // Record transaction
            const { error: transactionError } = await supabase
                .from('transactions')
                .insert({
                    user_id: user.id,
                    vehicle_id: selectedVehicleId,
                    amount: rechargeAmount,
                    status: 'Success',
                    payment_method: paymentMethod,
                });

            if (transactionError) {
                throw new Error(transactionError.message);
            }

            setSuccessMessage('Recharge successful! Your FASTag balance has been updated.');
            setCurrentStep(3); // Go to confirmation step
            fetchVehicles(); // Refresh vehicle list to show updated balance

        } catch (err: any) {
            setError(`Payment failed: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) {
        return <div className="flex justify-center items-center h-[calc(100vh-160px)]"><LoadingSpinner /></div>;
    }

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

    return (
        <div className="container mx-auto p-8 animate-slide-in-up">
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Recharge FASTag</h2>

            <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
                {error && <p className="text-red-600 text-center mb-4 font-medium">{error}</p>}
                {successMessage && <p className="text-green-600 text-center mb-4 font-medium animate-pulse">{successMessage}</p>}

                {/* Progress Indicator */}
                <div className="flex justify-between items-center mb-8">
                    <div className={`flex flex-col items-center flex-1 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
                        <span className="text-sm mt-2">Details</span>
                    </div>
                    <div className={`flex-1 h-1 bg-gray-200 ${currentStep > 1 ? 'bg-blue-600' : ''}`}></div>
                    <div className={`flex flex-col items-center flex-1 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
                        <span className="text-sm mt-2">Payment</span>
                    </div>
                    <div className={`flex-1 h-1 bg-gray-200 ${currentStep > 2 ? 'bg-blue-600' : ''}`}></div>
                    <div className={`flex flex-col items-center flex-1 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
                        <span className="text-sm mt-2">Confirmation</span>
                    </div>
                </div>

                {currentStep === 1 && (
                    <form onSubmit={handleProceedToPayment} className="space-y-6">
                        <div>
                            <label htmlFor="select-vehicle" className="block text-gray-700 text-sm font-bold mb-2">Select Vehicle</label>
                            <select
                                id="select-vehicle"
                                value={selectedVehicleId || ''}
                                onChange={(e) => setSelectedVehicleId(e.target.value)}
                                className="shadow border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                            >
                                <option value="">-- Select a Vehicle --</option>
                                {vehicles.map(vehicle => (
                                    <option key={vehicle.id} value={vehicle.id}>
                                        {vehicle.vehicle_number} (Balance: ₹{vehicle.fastag_balance.toFixed(2)})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedVehicle && (
                            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-blue-800 text-sm animate-fade-in">
                                <p>Current Balance for {selectedVehicle.vehicle_number}: ₹{selectedVehicle.fastag_balance.toFixed(2)}</p>
                            </div>
                        )}
                        <InputField
                            label="Recharge Amount (₹)"
                            type="number"
                            value={rechargeAmount}
                            onChange={(e) => setRechargeAmount(parseFloat(e.target.value) || '')}
                            required
                            min="10"
                            step="10"
                            placeholder="Enter Amount"
                        />
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-lg font-semibold transition-all duration-300">
                            Proceed to Payment
                        </Button>
                    </form>
                )}

                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Choose Payment Method</h3>
                        <div className="flex flex-col space-y-4">
                            <label className="flex items-center cursor-pointer bg-gray-50 p-4 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="UPI"
                                    checked={paymentMethod === 'UPI'}
                                    onChange={() => setPaymentMethod('UPI')}
                                    className="form-radio text-blue-600 h-5 w-5"
                                />
                                <span className="ml-3 text-lg font-medium text-gray-700">UPI (Google Pay, PhonePe, Paytm)</span>
                            </label>
                            <label className="flex items-center cursor-pointer bg-gray-50 p-4 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Netbanking"
                                    checked={paymentMethod === 'Netbanking'}
                                    onChange={() => setPaymentMethod('Netbanking')}
                                    className="form-radio text-blue-600 h-5 w-5"
                                />
                                <span className="ml-3 text-lg font-medium text-gray-700">Netbanking</span>
                            </label>
                            <label className="flex items-center cursor-pointer bg-gray-50 p-4 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Cards"
                                    checked={paymentMethod === 'Cards'}
                                    onChange={() => setPaymentMethod('Cards')}
                                    className="form-radio text-blue-600 h-5 w-5"
                                />
                                <span className="ml-3 text-lg font-medium text-gray-700">Credit/Debit Cards</span>
                            </label>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-yellow-800 text-sm animate-fade-in">
                            <p>You are recharging ₹{rechargeAmount} for {selectedVehicle?.vehicle_number} using {paymentMethod}.</p>
                            <p>This is a simulated payment.</p>
                        </div>
                        <div className="flex justify-between mt-6">
                            <Button onClick={() => setCurrentStep(1)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded-md">
                                Back
                            </Button>
                            <Button onClick={handleSimulatePayment} disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                                {submitting ? <LoadingSpinner /> : 'Pay Now'}
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="text-center py-12">
                        <svg className="w-24 h-24 text-green-500 mx-auto mb-6 animate-bounce-in" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="text-3xl font-bold text-green-700 mb-4 animate-fade-in">Recharge Successful!</h3>
                        <p className="text-xl text-gray-700 mb-6 animate-fade-in animation-delay-200">Your FASTag for {selectedVehicle?.vehicle_number} has been recharged with ₹{rechargeAmount}.</p>
                        <p className="text-gray-600 mb-8 animate-fade-in animation-delay-400">New Balance: ₹{((selectedVehicle?.fastag_balance ?? 0) + (typeof rechargeAmount === 'number' ? rechargeAmount : 0)).toFixed(2)}</p>
                        <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                            Go to Dashboard
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RechargePage;