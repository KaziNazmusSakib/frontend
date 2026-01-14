'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const navLinks = [
    { href: '/', label: '🏠 Home' },
    { href: '/products', label: '🛍️ Products' },
    { href: '/category', label: '📂 Categories' },
    { href: '/orders', label: '📦 Orders' },
    { href: '/cart', label: '🛒 Cart' },
  ];

  const userLinks = [
    { href: '/dashboard', label: '📊 Dashboard' },
    { href: '/profile', label: '👤 Profile' },
    { href: '/notifications', label: '🔔 Notifications' },
  ];

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✖️' : '☰'}
          </div>
          {isMenuOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => setIsMenuOpen(false)}
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          🛒 Nexify Store
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end space-x-2">
        <div className="hidden md:flex">
          <div className="join">
            <input
              type="text"
              placeholder="Search..."
              className="input input-bordered join-item"
            />
            <button className="btn join-item">
              🔍
            </button>
          </div>
        </div>

        <Link href="/cart" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <span className="text-xl">🛒</span>
            <span className="badge badge-sm indicator-item">3</span>
          </div>
        </Link>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
              {user ? (
                <span className="text-lg">{user.name.charAt(0)}</span>
              ) : (
                <span className="text-xl">👤</span>
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {user ? (
              <>
                <li className="menu-title">
                  <span>Hi, {user.name}</span>
                </li>
                {userLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
                <li>
                  <button onClick={() => logout()}>🚪 Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login">🔑 Login</Link>
                </li>
                <li>
                  <Link href="/auth/register">📝 Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}