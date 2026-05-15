'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/shared/AuthForm';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, loading, error } = useLogin();
  const { checkAuth } = useAuth();

  const handleSubmit = async (data: Record<string, string>) => {
    const result = await login({
      email: data.email,
      password: data.password,
    });

    if (result.success) {
      await checkAuth();
      router.push('/');
    }
  };

  const fields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      autoComplete: 'email',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      autoComplete: 'current-password',
    },
  ];

  return (
    <AuthForm
      fields={fields}
      onSubmit={handleSubmit}
      submitText="Sign In"
      submitVariant="primary"
      loading={loading}
      error={error || undefined}
    />
  );
};

