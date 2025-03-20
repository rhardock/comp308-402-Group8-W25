'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { authApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(response.user, response.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join us today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <Input
            label="Confirm Password"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Sign up
          </Button>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
} 