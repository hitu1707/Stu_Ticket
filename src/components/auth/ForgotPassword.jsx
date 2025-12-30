import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import ThemeToggle from '../layout/ThemeToggle';
import PasswordStrength from '../common/PasswordStrength';

const stepOneSchema = yup.object({
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
    .required('Mobile number is required'),
});

const stepTwoSchema = yup.object({
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

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [verifiedMobile, setVerifiedMobile] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { checkUserExists, users } = useAuthStore();

  // Step 1 form
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm({
    resolver: yupResolver(stepOneSchema),
  });

  // Step 2 form
  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
    watch,
  } = useForm({
    resolver: yupResolver(stepTwoSchema),
  });

  const password = watch('password');

  const onVerifyMobile = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = checkUserExists(data.mobile);
      if (!user) {
        toast.error('Mobile number not found. Please sign up first.');
        setIsLoading(false);
        return;
      }

      setVerifiedMobile(data.mobile);
      setStep(2);
      toast.success('Mobile verified! Now set your new password.');
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update password in store
      const userIndex = users.findIndex((u) => u.mobile === verifiedMobile);
      if (userIndex !== -1) {
        users[userIndex].password = data.password;
        
        // Force update the store (this triggers persistence)
        useAuthStore.setState({ users: [...users] });
        
        toast.success('Password reset successful! You can now login.');
        navigate('/');
      }
    } catch (error) {
      toast.error('Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <Card className="shadow-xl dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => step === 1 ? navigate('/') : setStep(1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="dark:text-white">Forgot Password</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  {step === 1 ? 'Enter your mobile number' : 'Set your new password'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {step === 1 ? (
              // Step 1: Verify Mobile
              <form onSubmit={handleSubmitStep1(onVerifyMobile)} className="space-y-4">
                <Alert className="dark:bg-blue-900/20 dark:border-blue-900">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="dark:text-blue-200">
                    Enter your registered mobile number to reset your password
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="dark:text-gray-200">
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    {...registerStep1('mobile')}
                    className={errorsStep1.mobile ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
                  />
                  {errorsStep1.mobile && (
                    <p className="text-sm text-red-500">{errorsStep1.mobile.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Mobile'
                  )}
                </Button>
              </form>
            ) : (
              // Step 2: Reset Password
              <form onSubmit={handleSubmitStep2(onResetPassword)} className="space-y-4">
                <Alert className="dark:bg-green-900/20 dark:border-green-900">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="dark:text-green-200">
                    Mobile verified: {verifiedMobile}
                  </AlertDescription>
                </Alert>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-gray-200">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      {...registerStep2('password')}
                      className={errorsStep2.password ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errorsStep2.password && (
                    <p className="text-sm text-red-500">{errorsStep2.password.message}</p>
                  )}
                  <PasswordStrength password={password} />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="dark:text-gray-200">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      {...registerStep2('confirmPassword')}
                      className={errorsStep2.confirmPassword ? 'border-red-500' : 'dark:bg-gray-700 dark:text-white dark:border-gray-600'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errorsStep2.confirmPassword && (
                    <p className="text-sm text-red-500">{errorsStep2.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}