'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProfileFormData } from '../types';
import { Button } from '@/ui/Button';
import { useAuthSession } from '@/features/auth/public';
import { useUpdateProfile } from '../hooks';
import { useAppDispatch } from '@/lib/store';
import { setUser } from '@/features/auth/redux/authSlice';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
});

/**
 * Profile Form Component
 * Form to update user's name
 */
export function ProfileForm() {
  const { user } = useAuthSession();
  const dispatch = useAppDispatch();
  const { updateProfile, loading, error, success } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (user?.name) {
      reset({ name: user.name });
    }
  }, [user?.name, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    const result = await updateProfile({ name: data.name });
    
    if (result.success && result.data) {
      // Update user in auth state
      dispatch(setUser({
        ...user!,
        name: result.data.name,
      }));
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Profile Information</h5>
      </div>
      <div className="card-body">
        {success && (
          <div className="alert alert-success" role="alert">
            Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Enter your full name"
              {...register('name')}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          <Button type="submit" variant="primary" loading={loading}>
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
}

