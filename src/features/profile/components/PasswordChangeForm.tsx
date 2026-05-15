'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PasswordChangeFormData } from '../types';
import { Button } from '@/ui/Button';
import { useChangePassword } from '../hooks';

const passwordChangeSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(1, 'New password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

/**
 * Password Change Form Component
 * Form to update user's password
 */
export function PasswordChangeForm() {
  const { changePassword, loading, error, success } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit = async (data: PasswordChangeFormData) => {
    const result = await changePassword({
      current_password: data.current_password,
      new_password: data.new_password,
      new_password_confirmation: data.confirm_password,
    });
    
    if (result.success) {
      reset();
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Change Password</h5>
      </div>
      <div className="card-body">
        {success && (
          <div className="alert alert-success" role="alert">
            Password updated successfully!
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="current_password" className="form-label">
              Current Password <span className="text-danger">*</span>
            </label>
            <input
              id="current_password"
              type="password"
              className={`form-control ${errors.current_password ? 'is-invalid' : ''}`}
              placeholder="Enter current password"
              {...register('current_password')}
            />
            {errors.current_password && (
              <div className="invalid-feedback">{errors.current_password.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="new_password" className="form-label">
              New Password <span className="text-danger">*</span>
            </label>
            <input
              id="new_password"
              type="password"
              className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
              placeholder="Enter new password (min. 8 characters)"
              {...register('new_password')}
            />
            {errors.new_password && (
              <div className="invalid-feedback">{errors.new_password.message}</div>
            )}
            <small className="form-text text-muted">Password must be at least 8 characters long</small>
          </div>

          <div className="mb-3">
            <label htmlFor="confirm_password" className="form-label">
              Confirm New Password <span className="text-danger">*</span>
            </label>
            <input
              id="confirm_password"
              type="password"
              className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
              placeholder="Confirm new password"
              {...register('confirm_password')}
            />
            {errors.confirm_password && (
              <div className="invalid-feedback">{errors.confirm_password.message}</div>
            )}
          </div>

          <Button type="submit" variant="primary" loading={loading}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}



