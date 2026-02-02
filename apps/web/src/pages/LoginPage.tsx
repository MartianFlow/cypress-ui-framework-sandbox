import { Navigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAuthStore } from '../stores/auth';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div data-testid="loading" className="flex items-center justify-center min-h-[50vh]">
        <div data-testid="spinner" className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div data-testid="login-page" className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <ShoppingCart className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
