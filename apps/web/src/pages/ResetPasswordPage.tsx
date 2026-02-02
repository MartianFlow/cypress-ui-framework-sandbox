import { KeyRound } from 'lucide-react';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div data-testid="reset-password-page" className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <KeyRound className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your new password below</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
