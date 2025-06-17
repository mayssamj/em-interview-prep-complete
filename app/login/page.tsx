
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            EM Interview Prep
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Master your Engineering Manager interviews
          </p>
          
          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Demo Accounts
            </h3>
            <div className="space-y-2 text-xs text-blue-800 dark:text-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-medium">Regular User:</span>
                <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">
                  demo / demo123
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Admin User:</span>
                <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">
                  admin / admin123
                </span>
              </div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
              Click the demo buttons below for quick access
            </p>
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
