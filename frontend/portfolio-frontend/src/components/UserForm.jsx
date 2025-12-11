import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import apiClient from "../api/axiosConfig";
import { UserPlus as UserPlusIcon, CheckCircle, XCircle } from "lucide-react";

// Helper component for password strength feedback
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

function UserForm({ setNotification, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  
  // Real-time validation logic
  useEffect(() => {
    const newErrors = {};
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = "Email address is invalid.";
    }
    if (form.password && form.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
    }
    if (form.confirmPassword && form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
  }, [form]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormInvalid) {
        setNotification({ type: 'error', message: 'Please fix the errors before submitting.'});
        return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/api/auth/register", { name: form.name, email: form.email, password: form.password });
      setNotification({ type: "success", message: "Registration successful! Please check your email for a verification code." });
      
      // 3. This line will now work correctly
      setTimeout(() => {
        navigate('/verify', { state: { email: form.email } });
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed.";
      setNotification({ type: "error", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputClasses = "w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors";
  const labelClasses = "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";

  // Check for form validity to enable/disable the submit button
  const isFormInvalid = 
    !form.name || 
    !form.email || 
    !form.password || 
    !form.confirmPassword || 
    Object.values(errors).some(error => error);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClasses}>Name</label>
        <input name="name" placeholder="Enter your name" onChange={handleChange} className={`${inputClasses} border-gray-300 dark:border-gray-600 focus:ring-indigo-500`} required />
      </div>
      <div>
        <label className={labelClasses}>Email</label>
        <div className="relative">
            <input name="email" type="email" placeholder="Enter your email" onChange={handleChange} className={`${inputClasses} ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}`} required />
            {form.email && (errors.email ? <XCircle className="absolute right-3 top-2.5 text-red-500" size={20}/> : <CheckCircle className="absolute right-3 top-2.5 text-green-500" size={20}/>)}
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className={labelClasses}>Password</label>
        <input name="password" type="password" placeholder="Choose a strong password" onChange={handleChange} className={`${inputClasses} ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}`} required />
        <PasswordStrengthIndicator password={form.password} />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>
      <div>
        <label className={labelClasses}>Confirm Password</label>
        <div className="relative">
            <input name="confirmPassword" type="password" placeholder="Confirm your password" onChange={handleChange} className={`${inputClasses} ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}`} required />
            {form.confirmPassword && (errors.confirmPassword ? <XCircle className="absolute right-3 top-2.5 text-red-500" size={20}/> : <CheckCircle className="absolute right-3 top-2.5 text-green-500" size={20}/>)}
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>
      <div className="pt-2">
        <button 
            type="submit" 
            disabled={isLoading || isFormInvalid}
            className="relative w-full inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition-all duration-300 bg-indigo-600 rounded-lg group hover:bg-white hover:text-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 w-0 h-0 transition-all duration-300 ease-out bg-white rounded-lg group-hover:w-full group-hover:h-full opacity-10"></span>
          <span className="relative flex items-center gap-2">
            <UserPlusIcon className="w-5 h-5" />
            {isLoading ? "Registering..." : "Create Account"}
          </span>
        </button>
      </div>
    </form>
  );
}

export default UserForm;

