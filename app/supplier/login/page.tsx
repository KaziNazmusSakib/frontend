// app/supplier/login/page.tsx
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
 
export default function SupplierLoginPage() {
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
      const response = await authAPI.supplier.login(data)
      if (response.data.access_token) {
        login(response.data.access_token, 'supplier', response.data.supplier)
        toast.success('Login successful!')
        router.push('/supplier/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }
 
  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full space-y-8">
<div className="text-center">
<div className="mx-auto w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6">
<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
</svg>
</div>
<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Supplier Login
</h2>
<p className="mt-2 text-sm text-gray-600">
            Access your supplier dashboard
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
                  placeholder="supplier@company.com"
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
                  className={`btn btn-warning w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
>
                  {loading ? 'Signing in...' : 'Sign in to Supplier Portal'}
</button>
</div>
</form>
 
            <div className="divider">OR</div>
 
            <div className="text-center">
<p className="text-sm text-gray-600">
                New supplier?{' '}
<Link href="/supplier/register" className="font-medium text-warning hover:text-warning/80">
                  Create supplier account
</Link>
</p>
</div>
</div>
</div>
</div>
</div>
  )
}