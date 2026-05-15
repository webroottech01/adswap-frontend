'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, ArrowRight } from 'lucide-react';
import { useRegister, useAuthSession } from '../public';
import { registerSchema, type RegisterFormData } from '../validation';

/**
 * Registration Page Component
 * 
 * Simplified registration form that collects only essential fields:
 * - Business Name
 * - Email
 * - Password (with confirmation)
 * 
 * All other business details are deferred to post-registration onboarding steps.
 * This design keeps registration frictionless while enabling future profile completion.
 */
export function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error: registerError } = useRegister();
  const { isAuthenticated, user } = useAuthSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerUser(data);

    if (result.success) {
      // Redirect will happen via useEffect when isAuthenticated changes
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="w-100" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <div className="d-flex justify-content-center mb-3">
            <div className="bg-primary text-white p-3 rounded-3">
              <Building2 size={32} />
            </div>
          </div>
          <h1 className="display-6 mb-2">Get Started</h1>
          <p className="text-muted">Join AdSwap and start monetizing your footfall</p>
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h5 className="card-title mb-1">Create Your Account</h5>
            <p className="card-text text-muted small mb-4">
              Enter your details to get started. You can complete your business profile after registration.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {registerError && (
                <div className="alert alert-danger" role="alert">
                  {registerError}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Business Name <span className="text-danger">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter your business name"
                  {...register('name')}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="business@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Create password (min. 8 characters)"
                  {...register('password')}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password_confirmation" className="form-label">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  id="password_confirmation"
                  type="password"
                  className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                  placeholder="Confirm your password"
                  {...register('password_confirmation')}
                />
                {errors.password_confirmation && (
                  <div className="invalid-feedback">{errors.password_confirmation.message}</div>
                )}
              </div>

              <div className="alert alert-info mb-4" role="alert">
                <small>
                  <strong>Note:</strong> You can complete your business profile after registration. 
                  We&apos;ll guide you through the setup process.
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} className="ms-2" />
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="card-footer bg-white text-center border-top">
            <p className="small text-muted mb-0">
              Already have an account?{' '}
              <Link href="/login" className="text-primary text-decoration-none">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-muted mt-4" style={{ fontSize: '0.75rem' }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
