import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="max-w-md w-full shadow-xl dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* 404 Illustration */}
            <div className="relative">
              <h1 className="text-9xl font-bold text-indigo-600 dark:text-indigo-400 opacity-20">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-24 h-24 text-gray-400 dark:text-gray-600" />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Page Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Oops! The page you're looking for doesn't exist.
                <br />
                It might have been moved or deleted.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}