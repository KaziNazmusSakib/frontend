'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/zodSchemas';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosClient from '@/lib/axiosClient';

type LoginFormData = {
  email: string;
  password: string;
};

export default function BuyerLoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();
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
        role: 'buyer'
      });
      setToken(response.data.access_token);
      router.push('/buyer/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <span className="text-2xl text-white font-bold">B</span>
            </div>
            <h2 className="card-title text-2xl font-bold justify-center">Buyer Login</h2>
            <p className="text-gray-600 mt-2">Sign in to your buyer account</p>
          </div>
          
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
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
                <Link href="/buyer/forgot-password" className="label-text-alt link link-primary">
                  Forgot password?
                </Link>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                {...register('password')}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="cursor-pointer label justify-start">
                <input type="checkbox" className="checkbox checkbox-primary mr-2" />
                <span className="label-text">Remember me</span>
              </label>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In as Buyer'
                )}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <div className="text-center space-y-3">
            <p className="text-gray-600">
              Don't have a buyer account?{' '}
              <Link href="/buyer/register" className="link link-primary font-semibold">
                Register here
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Are you a seller or supplier?{' '}
              <Link href="/seller/login" className="link link-secondary">
                Seller Login
              </Link>{' '}
              |{' '}
              <Link href="/supplier/login" className="link link-secondary">
                Supplier Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}