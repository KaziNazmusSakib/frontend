// app/supplier/register/page.tsx
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

const businessTypes = [
  'Manufacturer',
  'Wholesaler',
  'Distributor',
  'Dropshipper',
  'Producer',
  'Other'
]

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  companyName: z.string().min(2, 'Company name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  phone: z.string().optional(),
  businessType: z.string().min(1, 'Business type is required'),
  taxNumber: z.string().optional(),
  address: z.string().optional(),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function SupplierRegisterPage() {
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
      const { confirmPassword, terms, ...registerData } = data
      const response = await authAPI.supplier.register(registerData)
      
      if (response.data.access_token) {
        login(response.data.access_token, 'supplier', response.data.supplier)
        toast.success('Registration successful!')
        router.push('/supplier/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Supplier Registration
          </h1>
          <p className="text-gray-600 text-lg">
            Join our network of trusted suppliers
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left side - Information */}
            <div className="md:w-2/5 bg-gradient-to-b from-orange-500 to-amber-600 p-8 text-white">
              <div className="mb-10">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Benefits for Suppliers</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Access to thousands of buyers
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time inventory management
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Secure payment processing
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Analytics and business insights
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-8 border-t border-white/30">
                <p className="text-sm opacity-90">
                  Already registered?{' '}
                  <Link href="/supplier/login" className="font-semibold underline hover:no-underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Right side - Registration Form */}
            <div className="md:w-3/5 p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Personal Information
                    </h3>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700">Full Name *</span>
                      </label>
                      <input
                        type="text"
                        {...register('name')}
                        className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                        placeholder="John Doe"
                        disabled={loading}
                      />
                      {errors.name && (
                        <span className="text-error text-sm mt-1">{errors.name.message}</span>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700">Email *</span>
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
                        <span className="label-text font-medium text-gray-700">Password *</span>
                      </label>
                      <input
                        type="password"
                        {...register('password')}
                        className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                        placeholder="Minimum 8 characters"
                        disabled={loading}
                      />
                      {errors.password && (
                        <span className="text-error text-sm mt-1">{errors.password.message}</span>
                      )}
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Company Information
                    </h3>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700">Company Name *</span>
                      </label>
                      <input
                        type="text"
                        {...register('companyName')}
                        className={`input input-bordered w-full ${errors.companyName ? 'input-error' : ''}`}
                        placeholder="ABC Suppliers Ltd."
                        disabled={loading}
                      />
                      {errors.companyName && (
                        <span className="text-error text-sm mt-1">{errors.companyName.message}</span>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700">Contact Person *</span>
                      </label>
                      <input
                        type="text"
                        {...register('contactPerson')}
                        className={`input input-bordered w-full ${errors.contactPerson ? 'input-error' : ''}`}
                        placeholder="Jane Smith"
                        disabled={loading}
                      />
                      {errors.contactPerson && (
                        <span className="text-error text-sm mt-1">{errors.contactPerson.message}</span>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700">Phone</span>
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className="input input-bordered w-full"
                        placeholder="+1 (555) 123-4567"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700">Business Type *</span>
                      </label>
                      <select
                        {...register('businessType')}
                        className={`select select-bordered w-full ${errors.businessType ? 'select-error' : ''}`}
                        disabled={loading}
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.businessType && (
                        <span className="text-error text-sm mt-1">{errors.businessType.message}</span>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-gray-700">Tax Number</span>
                      </label>
                      <input
                        type="text"
                        {...register('taxNumber')}
                        className="input input-bordered w-full"
                        placeholder="VAT/Tax ID"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">Business Address</span>
                    </label>
                    <textarea
                      {...register('address')}
                      className="textarea textarea-bordered w-full"
                      placeholder="123 Business St, City, Country"
                      rows={3}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Confirm Password *</span>
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

                {/* Terms and Submit */}
                <div className="pt-6 border-t">
                  <div className="form-control">
                    <label className="cursor-pointer label justify-start">
                      <input 
                        type="checkbox" 
                        {...register('terms')}
                        className="checkbox checkbox-warning mr-3" 
                        disabled={loading}
                      />
                      <span className="label-text text-gray-700">
                        I agree to the{' '}
                        <Link href="/terms" className="text-warning hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-warning hover:underline">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.terms && (
                      <span className="text-error text-sm mt-1">{errors.terms.message}</span>
                    )}
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      className={`btn btn-warning w-full py-3 text-lg font-semibold rounded-lg ${loading ? 'loading' : ''}`}
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Register as Supplier'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}