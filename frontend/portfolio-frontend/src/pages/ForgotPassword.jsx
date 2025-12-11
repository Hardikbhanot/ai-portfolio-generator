import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import Notification from '../components/Notification';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await apiClient.post('/api/auth/forgot-password', { email });
            setNotification({ type: 'success', message: 'If this email exists, a reset code has been sent.' });
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            setNotification({ type: 'error', message: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SEO title="Forgot Password" description="Reset your password to access your Lopsie account." />
            <Notification notification={notification} setNotification={setNotification} />
            <div className="flex justify-center items-center min-h-[80vh] p-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-8 w-full max-w-md sm:p-10"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Reset Password</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your email to receive a reset code</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <Mail size={18} />
                            {isLoading ? "Sending..." : "Send Reset Code"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default ForgotPasswordPage;
