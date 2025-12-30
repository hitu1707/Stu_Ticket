import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import PasswordStrength from '../common/PasswordStrength';

// Validation schema
const credentialSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function CreateCredentialsDialog({ open, onClose, mobile, onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(credentialSchema),
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData = {
        mobile,
        username: data.username,
        password: data.password, // In real app, this should be hashed
      };

      onSuccess(userData);
      reset();
    } catch (error) {
      console.error('Error creating credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-md dark:bg-gray-800" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="dark:text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Create Your Account
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Mobile number <span className="font-semibold">{mobile}</span> is not registered.
            <br />
            Please create your credentials to continue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Alert className="dark:bg-blue-900/20 dark:border-blue-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="dark:text-blue-200">
              This will create your admin account with the mobile number {mobile}
            </AlertDescription>
          </Alert>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="create-username" className="dark:text-gray-200">
              Username <span className="text-red-500">*</span>
            </Label>
            <Input
              id="create-username"
              type="text"
              placeholder="Choose a username"
              autoComplete="off"
              {...register('username')}
              className={errors.username ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="create-password" className="dark:text-gray-200">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="create-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                autoComplete="new-password"
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
            
            {/* Password Strength Indicator */}
            {password && <PasswordStrength password={password} />}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="create-confirm-password" className="dark:text-gray-200">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="create-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                autoComplete="new-password"
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
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}