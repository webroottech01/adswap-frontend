'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EmailChangeFormData } from '../types';
import { Button } from '@/ui/Button';
import { useAuthSession } from '@/features/auth/public';
import { useChangeEmail } from '../hooks';
import { useAppDispatch } from '@/lib/store';
import { setUser } from '@/features/auth/redux/authSlice';

const emailChangeSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    confirm_email: z.string().min(1, 'Please confirm your email'),
    current_password: z.string().min(1, 'Current password is required'),
  })
  .refine((data) => data.email === data.confirm_email, {
    message: 'Emails do not match',
    path: ['confirm_email'],
  });

/**
 * Email Change Form Component
 * Form to update user's email address
 */
export function EmailChangeForm() {
  const { user } = useAuthSession();
  const dispatch = useAppDispatch();
  const { changeEmail, loading, error, success } = useChangeEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      email: user?.email || '',
      confirm_email: user?.email || '',
      current_password: '',
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (user?.email) {
      reset({
        email: user.email,
        confirm_email: user.email,
        current_password: '',
      });
    }
  }, [user?.email, reset]);

  const onSubmit = async (data: EmailChangeFormData) => {
    const result = await changeEmail({
      email: data.email,
      current_password: data.current_password,
    });
    
    if (result.success && result.data) {
      // Update user in auth state
      dispatch(setUser({
        ...user!,
        email: result.data.email,
      }));
      // Reset password field
      reset({
        email: result.data.email,
        confirm_email: result.data.email,
        current_password: '',
      });
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Change Email Address</h5>
      </div>
      <div className="card-body">
        {success && (
          <div className="alert alert-success" role="alert">
            Email address updated successfully!
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="current_email" className="form-label">
              Current Email
            </label>
            <input
              id="current_email"
              type="email"
              className="form-control"
              value={user?.email || ''}
              disabled
            />
            <small className="form-text text-muted">Your current email address</small>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              New Email Address <span className="text-danger">*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Enter new email address"
              {...register('email')}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="confirm_email" className="form-label">
              Confirm New Email <span className="text-danger">*</span>
            </label>
            <input
              id="confirm_email"
              type="email"
              className={`form-control ${errors.confirm_email ? 'is-invalid' : ''}`}
              placeholder="Confirm new email address"
              {...register('confirm_email')}
            />
            {errors.confirm_email && (
              <div className="invalid-feedback">{errors.confirm_email.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="current_password" className="form-label">
              Current Password <span className="text-danger">*</span>
            </label>
            <input
              id="current_password"
              type="password"
              className={`form-control ${errors.current_password ? 'is-invalid' : ''}`}
              placeholder="Enter your current password"
              {...register('current_password')}
            />
            {errors.current_password && (
              <div className="invalid-feedback">{errors.current_password.message}</div>
            )}
            <small className="form-text text-muted">Enter your current password to confirm email change</small>
          </div>

          <Button type="submit" variant="primary" loading={loading}>
            Update Email
          </Button>
        </form>
      </div>
    </div>
  );
}



