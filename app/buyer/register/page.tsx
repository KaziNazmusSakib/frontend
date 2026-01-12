// app/buyer/register/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function BuyerRegister() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setErrors(['All fields are required']);
      return;
    }

    setErrors([]);
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/buyer/register`,
        formData
      );

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('userType', 'buyer');
        router.push('/buyer/dashboard');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Registration failed. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="card w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6 text-primary">Buyer Registration</h2>

          {errors.length > 0 && (
            <div className="alert alert-error mb-4">
              <ul className="list-disc list-inside">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="input input-bordered input-primary w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered input-primary w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter a secure password"
                className="input input-bordered input-primary w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <span className="text-sm text-gray-500 mr-1">Already have an account?</span>
            <a href="/buyer/login" className="link link-primary font-semibold">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
