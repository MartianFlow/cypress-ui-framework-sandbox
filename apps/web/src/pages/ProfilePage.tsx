import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Camera, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/auth';
import { api, ApiError } from '../services/api';
import Breadcrumb from '../components/common/Breadcrumb';
import { toast } from 'sonner';
import type { User as UserType } from '@ecommerce/shared';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    try {
      const response = await api.put<{ user: UserType }>('/auth/me', data);
      updateUser(response.user);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    });
    setIsEditing(false);
  };

  return (
    <div data-testid="profile-page" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Profile' }]} />

      <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-8">My Profile</h1>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            {user?.avatar ? (
              <img
                data-testid="profile-avatar"
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div
                data-testid="profile-avatar"
                className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center"
              >
                <User className="h-12 w-12 text-primary-600" />
              </div>
            )}
            <button
              data-testid="avatar-upload"
              className="absolute bottom-0 right-0 p-2 bg-white border rounded-full shadow-sm hover:bg-gray-50"
            >
              <Camera className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <div>
            <h2 data-testid="profile-name" className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p data-testid="profile-email" className="text-gray-500">{user?.email}</p>
            <p className="text-sm text-gray-400 capitalize">Role: {user?.role}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                data-testid="profile-first-name"
                {...register('firstName')}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  !isEditing ? 'bg-gray-50' : ''
                } ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                data-testid="profile-last-name"
                {...register('lastName')}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  !isEditing ? 'bg-gray-50' : ''
                } ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <input
                type="text"
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  data-testid="profile-cancel"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="profile-save"
                  disabled={isLoading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center"
                >
                  {isLoading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                data-testid="profile-edit"
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
