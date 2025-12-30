import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import CreateCredentialsDialog from './CreateCredentialsDialog';

// Simple login schema (mobile only for checking)
const loginCheckSchema = yup.object({
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
    .required('Mobile number is required'),
  password: yup
    .string()
    .required('Password is required'),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [pendingMobile, setPendingMobile] = useState('');
  
  const navigate = useNavigate();
  const { login, checkUserExists, getUserByCredentials, registerUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(loginCheckSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user exists
      const existingUser = checkUserExists(data.mobile);

      if (!existingUser) {
        // User doesn't exist - show credential creation dialog
        setPendingMobile(data.mobile);
        setShowCreateDialog(true);
        setIsLoading(false);
        return;
      }

      // User exists - verify password
      const user = getUserByCredentials(data.mobile, data.password);

      if (!user) {
        toast.error('Invalid credentials. Please check your password.');
        setIsLoading(false);
        return;
      }

      // Login successful
      const token = 'mock-jwt-token-' + Date.now();
      login(user, token);
      toast.success('Login successful!');
      navigate('/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsCreated = (userData) => {
    // Register the new user
    const newUser = registerUser(userData);
    
    // Auto login
    const token = 'mock-jwt-token-' + Date.now();
    login(newUser, token);
    
    // Close dialog
    setShowCreateDialog(false);
    setPendingMobile('');
    
    // Show success and navigate
    toast.success('Account created successfully!', {
      description: 'Welcome to Ticket Management System',
    });
    
    navigate('/dashboard');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="login-mobile" className="dark:text-gray-200">
            Mobile Number
          </Label>
          <Input
            id="login-mobile"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            {...register('mobile')}
            className={errors.mobile ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
          />
          {errors.mobile && (
            <p className="text-sm text-red-500">{errors.mobile.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="login-password" className="dark:text-gray-200">
            Password
          </Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
              className={errors.password ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        {/* Forgot Password Link */}
<div className="flex justify-end">
  <Link
    to="/forgot-password"
    className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
  >
    Forgot password?
  </Link>
</div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>

      {/* Credential Creation Dialog */}
      <CreateCredentialsDialog
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
          setPendingMobile('');
        }}
        mobile={pendingMobile}
        onSuccess={handleCredentialsCreated}
      />
    </>
  );
}