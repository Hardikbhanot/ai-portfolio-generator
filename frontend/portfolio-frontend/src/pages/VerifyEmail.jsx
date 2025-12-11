import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import Notification from '../components/Notification';
import { motion } from 'framer-motion';
import { KeyRound as KeyIcon } from 'lucide-react';

function VerifyEmailPage() {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; // Get email passed from registration page

    // --- THIS IS THE FIX ---
    // Redirection logic is now safely handled inside a useEffect hook.
    // This ensures the component has mounted before attempting to navigate.
    useEffect(() => {
        if (!email) {
            console.error("No email provided for verification. Redirecting.");
            navigate('/login');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setNotification({ type: 'error', message: 'Please enter a 6-digit code.' });
            return;
        }
        setIsLoading(true);
        try {
            await apiClient.post('/api/auth/verify', { email, code: otp });
            setNotification({ type: 'success', message: 'Verification successful! You can now log in.' });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Invalid OTP or an error occurred.';
            setNotification({ type: 'error', message: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Render nothing if there's no email, while the useEffect handles redirection.
    if (!email) {
        return null;
    }

    return (
        <>
            <Notification notification={notification} setNotification={setNotification} />
            <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Verify Your Email</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            A 6-digit code has been sent to <strong className="text-indigo-600 dark:text-indigo-400">{email}</strong>.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                // This onChange handler now only allows numeric input
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                maxLength="6"
                                className="w-full mt-1 px-4 py-2 text-center text-3xl font-bold tracking-[0.8em] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                                required
                            />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:bg-indigo-400 transition-colors">
                            <span className="flex items-center justify-center gap-2">
                                <KeyIcon size={18} />
                                {isLoading ? 'Verifying...' : 'Verify Account'}
                            </span>
                        </button>
                    </form>
                </motion.div>
            </div>
        </>
    );
}

export default VerifyEmailPage;

