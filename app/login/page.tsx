'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/zodSchemas';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosClient from '@/lib/axiosClient';

export default function LoginPage() {
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
      const res = await axiosClient.post('/auth/login', data);
      setToken(res.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered"
                {...register('email')}
              />
              {errors.email && <span className="text-error text-sm">{errors.email.message}</span>}
            </div>
            <div className="form-control">
              <label className="label">Password</label>
              <input
                type="password"
                className="input input-bordered"
                {...register('password')}
              />
              {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          <div className="divider">OR</div>
          <div className="text-center">
            <Link href="/register" className="link">Register</Link>
            <div className="mt-2">
              <Link href="/buyer/login" className="btn btn-xs mr-2">Buyer</Link>
              <Link href="/seller/login" className="btn btn-xs mr-2">Seller</Link>
              <Link href="/supplier/login" className="btn btn-xs">Supplier</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}