// app/seller/register/page.tsx
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
 
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  companyName: z.string().min(2, 'Company name is required'),
  businessAddress: z.string().optional(),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
 
type RegisterFormData = z.infer<typeof registerSchema>
 
export default function SellerRegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })
 
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    try {
      const { confirmPassword, ...registerData } = data
      const response = await authAPI.seller.register(registerData)
      if (response.data.access_token) {
        login(response.data.access_token, 'seller', response.data.seller)
        toast.success('Registration successful!')
        router.push('/seller/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }
 
  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-2xl w-full space-y-8">
<div className="text-center">
<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Seller Registration
</h2>
<p className="mt-2 text-sm text-gray-600">
            Start selling on our platform
</p>
</div>
<div className="card bg-white shadow-2xl rounded-2xl">
<div className="card-body p-8">
<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="form-control">
<label className="label">
<span className="label-text font-semibold">Full Name *</span>
</label>
<input
                    type="text"
                    {...register('name')}
                    className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                    placeholder="Your full name"
                    disabled={loading}
                  />
                  {errors.name && (
<span className="text-error text-sm mt-1">{errors.name.message}</span>
                  )}
</div>
 
                <div className="form-control">
<label className="label">
<span className="label-text font-semibold">Company Name *</span>
</label>
<input
                    type="text"
                    {...register('companyName')}
                    className={`input input-bordered w-full ${errors.companyName ? 'input-error' : ''}`}
                    placeholder="Your company name"
                    disabled={loading}
                  />
                  {errors.companyName && (
<span className="text-error text-sm mt-1">{errors.companyName.message}</span>
                  )}
</div>
</div>
 
              <div className="form-control">
<label className="label">
<span className="label-text font-semibold">Email Address *</span>
</label>
<input
                  type="email"
                  {...register('email')}
                  className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                  placeholder="seller@company.com"
                  disabled={loading}
                />
                {errors.email && (
<span className="text-error text-sm mt-1">{errors.email.message}</span>
                )}
</div>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="form-control">
<label className="label">
<span className="label-text font-semibold">Password *</span>
</label>
<input
                    type="password"
                    {...register('password')}
                    className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                    placeholder="Create strong password"
                    disabled={loading}
                  />
                  {errors.password && (
<span className="text-error text-sm mt-1">{errors.password.message}</span>
                  )}
</div>
 
                <div className="form-control">
<label className="label">
<span className="label-text font-semibold">Confirm Password *</span>
</label>
<input
                    type="password"
                    {...register('confirmPassword')}
                    className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
<span className="text-error text-sm mt-1">{errors.confirmPassword.message}</span>
                  )}
</div>
</div>
 
              <div className="form-control">
<label className="label">
<span className="label-text font-semibold">Business Address</span>
</label>
<textarea
                  {...register('businessAddress')}
                  className={`textarea textarea-bordered w-full ${errors.businessAddress ? 'textarea-error' : ''}`}
                  placeholder="Optional: Your business address"
                  rows={3}
                  disabled={loading}
                />
</div>
 
              <div className="form-control">
<label className="cursor-pointer label justify-start">
<input 
                    type="checkbox" 
                    className="checkbox checkbox-success mr-3" 
                    required 
                    disabled={loading}
                  />
<span className="label-text text-gray-700">
                    I agree to the{' '}
<Link href="/terms" className="text-success hover:underline">
                      Terms of Service
</Link>{' '}
                    and{' '}
<Link href="/privacy" className="text-success hover:underline">
                      Privacy Policy
</Link>
</span>
</label>
</div>
 
              <div className="form-control">
<button
                  type="submit"
                  className={`btn btn-success w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
>
                  {loading ? 'Creating account...' : 'Register as Seller'}
</button>
</div>
</form>
 
            <div className="divider">OR</div>
 
            <div className="text-center">
<p className="text-sm text-gray-600">
                Already have an account?{' '}
<Link href="/seller/login" className="font-medium text-success hover:text-success/80">
                  Sign in here
</Link>
</p>
</div>
</div>
</div>
</div>
</div>
  )
}