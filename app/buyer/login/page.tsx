'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/zodSchemas';
import axiosClient from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LoginFormData = {
  email: string;
  password: string;
};

export default function BuyerLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axiosClient.post('/auth/login', {
        ...data,
        role: 'buyer',
      });
      
      if (response.data.user.role === 'buyer') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/buyer/dashboard');
      } else {
        setError('Please login as a buyer');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">
            👤 Buyer Login
          </h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="buyer@example.com"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                {...register('email')}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login as Buyer'}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <div className="text-center space-y-3">
            <p>Don&apos;t have a buyer account?</p>
            <Link href="/buyer/register" className="btn btn-outline btn-block">
              Register as Buyer
            </Link>
            <Link href="/auth/register" className="btn btn-ghost btn-block">
              Register as Other Role
            </Link>
          </div>

          <div className="text-center mt-4">
            <Link href="/" className="link link-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}