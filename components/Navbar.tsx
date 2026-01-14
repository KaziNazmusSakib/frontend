'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { token, logout, user } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="navbar bg-base-100 fixed top-0 z-50 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/" className={isActive('/') ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className={isActive('/products') ? 'active' : ''}>
                Products
              </Link>
            </li>
            <li>
              <Link href="/cart" className={isActive('/cart') ? 'active' : ''}>
                Cart
              </Link>
            </li>
            {token && (
              <>
                <li>
                  <Link href="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                    Dashboard
                  </Link>
                </li>
                {user?.role === 'admin' && (
                  <li>
                    <Link href="/admin" className={isActive('/admin') ? 'active' : ''}>
                      Admin
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          🛒 Nexify Store
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" className={isActive('/products') ? 'active' : ''}>
              Products
            </Link>
          </li>
          <li>
            <Link href="/cart" className={isActive('/cart') ? 'active' : ''}>
              Cart
            </Link>
          </li>
          {token && (
            <>
              <li>
                <Link href="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                  Dashboard
                </Link>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <Link href="/admin" className={isActive('/admin') ? 'active' : ''}>
                    Admin
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        {token ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="font-bold">{user?.name?.charAt(0) || 'U'}</span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/dashboard" className="justify-between">
                  Profile
                  <span className="badge badge-primary">New</span>
                </Link>
              </li>
              <li>
                <Link href="/orders">Orders</Link>
              </li>
              <li>
                <button onClick={logout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
            <Link href="/register" className="btn btn-outline">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}