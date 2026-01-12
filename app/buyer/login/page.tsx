// app/buyer/login/page.tsx
"use client";
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { authAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function BuyerLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      const response = await authAPI.buyer.login(data)
      
      if (response.data.access_token) {
        login(response.data.access_token, 'buyer', response.data.buyer)
        toast.success('Login successful!')
        router.push('/buyer/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Buyer Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your buyer account
          </p>
        </div>
        
        <div className="card bg-white shadow-2xl rounded-2xl">
          <div className="card-body p-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email address</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {errors.email && (
                  <span className="text-error text-sm mt-1">{errors.email.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                  <Link href="/forgot-password" className="label-text-alt link link-hover">
                    Forgot password?
                  </Link>
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                {errors.password && (
                  <span className="text-error text-sm mt-1">{errors.password.message}</span>
                )}
              </div>

              <div className="form-control">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="divider">OR</div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/buyer/register" className="font-medium text-primary hover:text-primary/80">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}