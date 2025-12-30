import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from '@/schemas/authSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, checkUserExists, registerUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if user already exists
      const existingUser = checkUserExists(data.mobile);
      if (existingUser) {
        toast.error('Mobile number already registered. Please login.');
        setIsLoading(false);
        return;
      }

      // Register new user
      const newUser = registerUser({
        mobile: data.mobile,
        username: data.username,
        password: data.password,
      });

      const token = 'mock-jwt-token-' + Date.now();

      // Auto login
      login(newUser, token);

      toast.success('Account created successfully!');
      navigate('/dashboard');

    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Mobile Number */}
      <div className="space-y-2">
        <Label htmlFor="signup-mobile" className="dark:text-gray-200">
          Mobile Number
        </Label>
        <Input
          id="signup-mobile"
          type="tel"
          placeholder="Enter 10-digit mobile number"
          {...register('mobile')}
          className={errors.mobile ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
        />
        {errors.mobile && (
          <p className="text-sm text-red-500">{errors.mobile.message}</p>
        )}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="signup-username" className="dark:text-gray-200">
          Username
        </Label>
        <Input
          id="signup-username"
          type="text"
          placeholder="Choose a username"
          {...register('username')}
          className={errors.username ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="dark:text-gray-200">
          Password
        </Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
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

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password" className="dark:text-gray-200">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="signup-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter your password"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Sign Up'
        )}
      </Button>
    </form>
  );
}