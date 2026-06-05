'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Building2 } from 'lucide-react';
import { useLogin, useAuthSession } from '../public';
import { loginSchema, type LoginFormData } from '../validation';

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error: loginError } = useLogin();
  const { isAuthenticated, user } = useAuthSession();
  const next = searchParams?.get('next') ?? null;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(next ?? '/dashboard');
    }
  }, [isAuthenticated, user, next, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login({ email: data.email, password: data.password });
    if (result.success) {
      // Redirect handled via useEffect once auth state updates.
    }
  };

  const displayError = loginError;

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="w-100" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <div className="d-flex justify-content-center mb-3">
            <div className="bg-primary text-white p-3 rounded-3">
              <Building2 size={32} />
            </div>
          </div>
          <h1 className="display-6 mb-2">Welcome to AdSwap</h1>
          <p className="text-muted">Sign in to your business account</p>
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h5 className="card-title mb-1">Sign In</h5>
            <p className="card-text text-muted small mb-4">
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {displayError && (
                <div className="alert alert-danger" role="alert">
                  {displayError}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="business@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password.message}</div>
                )}
              </div>

              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                  />
                  <label className="form-check-label small" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="small text-primary text-decoration-none">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} className="ms-2" />
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="card-footer bg-white text-center border-top">
            <p className="small text-muted mb-0">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary text-decoration-none">
                Register your business
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-muted mt-4" style={{ fontSize: '0.75rem' }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

