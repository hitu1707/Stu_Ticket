import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Phone, Calendar, Shield, Loader2, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import ThemeToggle from '../layout/ThemeToggle';
import ChangePasswordDialog from '../auth/ChangePasswordDialog';

const profileSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .required('Username is required'),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
    .required('Mobile number is required'),
});

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, users, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      mobile: user?.mobile || '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if mobile is already taken by another user
      const existingUser = users.find((u) => u.mobile === data.mobile && u.id !== user.id);
      if (existingUser) {
        toast.error('Mobile number is already registered to another account');
        setIsLoading(false);
        return;
      }

      // Update user
      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...data };
        useAuthStore.setState({ users: [...users] });
        updateUser({ ...user, ...data });
        
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      username: user?.username,
      mobile: user?.mobile,
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My Profile
                </h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* Profile Information */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="dark:text-white">Profile Information</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    View and update your personal information
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="dark:text-gray-200">
                    Username
                  </Label>
                  <Input
                    id="username"
                    {...register('username')}
                    disabled={!isEditing}
                    className={`${errors.username ? 'border-red-500' : ''} ${!isEditing ? 'bg-gray-50 dark:bg-gray-700/50' : 'dark:bg-gray-700'} dark:text-white dark:border-gray-600`}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="dark:text-gray-200">
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    {...register('mobile')}
                    disabled={!isEditing}
                    className={`${errors.mobile ? 'border-red-500' : ''} ${!isEditing ? 'bg-gray-50 dark:bg-gray-700/50' : 'dark:bg-gray-700'} dark:text-white dark:border-gray-600`}
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-500">{errors.mobile.message}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Account Details</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Information about your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</div>
                  <div className="text-base dark:text-white capitalize">{user?.role || 'User'}</div>
                </div>
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</div>
                  <div className="text-base dark:text-white">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </div>
                </div>
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Account ID</div>
                  <div className="text-base dark:text-white font-mono">#{user?.id?.slice(-8)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Security</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setChangePasswordOpen(true)} variant="outline" className="w-full sm:w-auto">
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Change Password Dialog */}
      <ChangePasswordDialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </div>
  );
}