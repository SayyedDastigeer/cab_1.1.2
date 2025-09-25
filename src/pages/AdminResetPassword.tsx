import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AdminResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  const { updateUserPassword } = useSupabaseAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const validateResetSession = async () => {
      try {
        // Step 1: Capture access_token & refresh_token from URL
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error('Error setting session:', error);
            toast.error('Invalid or expired reset link.');
            navigate('/admin/forgot-password');
            return;
          }
        }

        // Step 2: Now check if session exists
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          console.error('Session error:', error);
          toast.error('Invalid or expired reset link. Please request a new one.');
          navigate('/admin/forgot-password');
          return;
        }

        toast.success('Reset link validated. You can now set your new password.');
      } catch (error) {
        console.error('Validation error:', error);
        toast.error('Something went wrong. Please try again.');
        navigate('/admin/forgot-password');
      } finally {
        setIsValidating(false);
      }
    };

    validateResetSession();
  }, [navigate, searchParams]);

  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateUserPassword(formData.password);

      if (result.success) {
        setIsSuccess(true);
        toast.success('Password updated successfully!');
        setTimeout(() => navigate('/admin'), 3000);
      } else {
        toast.error(result.error || 'Failed to update password');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Password Updated!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Your password has been successfully updated. You will be redirected to the login page shortly.
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6"
          >
            <Lock className="w-10 h-10 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-300">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Update Password</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminResetPassword;
