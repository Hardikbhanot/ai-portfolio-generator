import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import Notification from '../components/Notification';
import { motion } from 'framer-motion';
import { KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import SEO from '../components/SEO';

// Reusing helper component for password strength
const PasswordStrengthIndicator = ({ password }) => {
    const getStrength = () => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getStrength();
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    const strengthText = ['Weak', 'Fair', 'Good', 'Strong'];

    if (!password) return null;

    return (
        <div className="flex items-center mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                <div
                    className={`h-2 rounded-full ${colors[strength - 1] || ''}`}
                    style={{ width: `${(strength / 4) * 100}%`, transition: 'width 0.3s' }}
                ></div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 w-12">{strengthText[strength - 1] || ''}</span>
        </div>
    );
};

function ResetPasswordPage() {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setNotification({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        if (newPassword.length < 8) {
            setNotification({ type: 'error', message: 'Password must be at least 8 characters.' });
            return;
        }

        setIsLoading(true);
        try {
            await apiClient.post('/api/auth/reset-password', { email, otp, newPassword });
            setNotification({ type: 'success', message: 'Password reset successful! You can now log in.' });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setNotification({ type: 'error', message: err.response?.data?.message || 'Invalid OTP or request.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) return null;

    return (
        <>
            <SEO title="Reset Password" description="Create a new password for your account." />
            <Notification notification={notification} setNotification={setNotification} />
            <div className="flex justify-center items-center min-h-[80vh] p-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-8 w-full max-w-md sm:p-10"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Set New Password</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Enter the code sent to {email}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                maxLength="6"
                                placeholder="000000"
                                className="w-full px-4 py-2 text-center text-2xl font-bold tracking-widest bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition-colors"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <PasswordStrengthIndicator password={newPassword} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition-colors"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <KeyRound size={18} />
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/forgot-password" className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Email Entry
                        </Link>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default ResetPasswordPage;
