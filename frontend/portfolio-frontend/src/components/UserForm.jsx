import { useState } from "react";
import axios from "axios"; // Assuming you have a configured axios instance
import { UserPlus as UserPlusIcon } from "lucide-react";

// The UserForm now accepts two new props: `setNotification` and `onSuccess`.
function UserForm({ setNotification, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Use your actual API endpoint for registration
      await axios.post("http://localhost:8080/api/auth/register", form);
      
      // Show success notification via the parent component's state
      setNotification({
        type: "success",
        message: "Account created successfully! Please log in to continue.",
      });

      // Call the onSuccess callback to switch the view to 'login'
      setTimeout(() => {
        onSuccess();
        setNotification(null); // Close notification after switching
      }, 2000); // Wait 2 seconds so the user can read the message

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error creating user. The email might already be in use.";
      // Show error notification
      setNotification({ type: "error", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors";
  const labelClasses = "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClasses}>Name</label>
        <input name="name" placeholder="Enter your name" onChange={handleChange} className={inputClasses} required />
      </div>
      <div>
        <label className={labelClasses}>Email</label>
        <input name="email" type="email" placeholder="Enter your email" onChange={handleChange} className={inputClasses} required />
      </div>
      <div>
        <label className={labelClasses}>Password</label>
        <input name="password" type="password" placeholder="Choose a password" onChange={handleChange} className={inputClasses} required />
      </div>
      <div className="flex justify-center pt-2">
        <button type="submit" disabled={isLoading} className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition-all duration-300 bg-indigo-600 rounded-lg group hover:bg-white hover:text-indigo-600 disabled:bg-indigo-400 w-full">
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