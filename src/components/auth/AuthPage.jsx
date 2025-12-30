import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ThemeToggle from '../layout/ThemeToggle';
import { Ticket } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-full mb-4 transition-colors">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
            Ticket Management System
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">
            Manage your support tickets efficiently
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl dark:bg-gray-800 dark:border-gray-700 transition-colors">
          <CardHeader>
            <CardTitle className="dark:text-white">Welcome</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Login to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6 transition-colors">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}