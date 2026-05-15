'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/shared/AuthForm';
import { useRegister } from '../hooks/useRegister';
import { useAuth } from '../hooks/useAuth';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register, loading, error } = useRegister();
  const { checkAuth } = useAuth();

  const handleSubmit = async (data: Record<string, string>) => {
    if (data.password !== data.password_confirmation) {
      return;
    }

    const result = await register({
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });

    if (result.success) {
      await checkAuth();
      router.push('/');
    }
  };

  const fields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
      autoComplete: 'name',
    },
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
      placeholder: 'Create a password',
      required: true,
      autoComplete: 'new-password',
    },
    {
      name: 'password_confirmation',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      required: true,
      autoComplete: 'new-password',
    },
  ];

  return (
    <AuthForm
      fields={fields}
      onSubmit={handleSubmit}
      submitText="Sign Up"
      submitVariant="success"
      loading={loading}
      error={error || undefined}
    />
  );
};

