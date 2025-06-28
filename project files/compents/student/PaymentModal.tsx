
import React, { useState } from 'react';
import { Course } from '../../types';
import Spinner from '../common/Spinner';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Course;
    onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, course, onPaymentSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 1500));
        setLoading(false);
        onPaymentSuccess();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Payment for {course.title} Course</h2>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>
                <div className="space-y-4">
                    <p><span className="font-semibold">Educator:</span> {course.educator}</p>
                    <p><span className="font-semibold">Price:</span> Rs. {course.price}</p>
                    
                    <div>
                        <label className="block text-sm font-medium">Cardholder's Name</label>
                        <input type="text" className="w-full p-2 border rounded" placeholder="Card Holder Name" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Card Number</label>
                        <input type="text" className="w-full p-2 border rounded" placeholder="1234 5678 9012 3457" />
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium">Expiration</label>
                            <input type="text" className="w-full p-2 border rounded" placeholder="MM/YYYY" />
                        </div>
                        <div className="w-1/2">
                             <label className="block text-sm font-medium">CVV</label>
                            <input type="text" className="w-full p-2 border rounded" placeholder="***" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400">
                        Close
                    </button>
                    <button onClick={handlePay} disabled={loading} className="bg-brand-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">
                        {loading ? <Spinner/> : 'Pay Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
