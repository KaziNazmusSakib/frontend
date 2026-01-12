// components/Navbar.tsx
"use client";
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
 
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
 
  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }
 
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'buyer': return 'badge-primary'
      case 'seller': return 'badge-success'
      case 'supplier': return 'badge-warning'
      case 'admin': return 'badge-neutral'
      case 'super-admin': return 'badge-error'
      default: return 'badge-ghost'
    }
  }
 
  return (
<div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
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
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
</svg>
</div>
<ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
>
<li>
<Link href="/">Home</Link>
</li>
<li>
<Link href="/products">Products</Link>
</li>
<li>
<Link href="/categories">Categories</Link>
</li>
            {isAuthenticated ? (
<>
<li>
<Link href={`/${user?.role}/dashboard`}>Dashboard</Link>
</li>
<li>
<button onClick={handleLogout}>Logout</button>
</li>
</>
            ) : (
<>
<li>
<Link href="/buyer/login">Buyer Login</Link>
</li>
<li>
<Link href="/seller/register">Become Seller</Link>
</li>
<li>
<Link href="/supplier/register">Become Supplier</Link>
</li>
</>
            )}
</ul>
</div>
<Link href="/" className="btn btn-ghost text-xl">
          🛒 ECommerce
</Link>
</div>
 
      <div className="navbar-center hidden lg:flex">
<ul className="menu menu-horizontal px-1">
<li>
<Link href="/">Home</Link>
</li>
<li>
<Link href="/products">Products</Link>
</li>
<li>
<Link href="/categories">Categories</Link>
</li>
          {isAuthenticated && (
<li>
<Link href={`/${user?.role}/dashboard`}>Dashboard</Link>
</li>
          )}
</ul>
</div>
 
      <div className="navbar-end">
        {isAuthenticated ? (
<div className="dropdown dropdown-end">
<div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
>
<div className="w-10 rounded-full">
<div className="avatar placeholder">
<div className="bg-neutral text-neutral-content rounded-full w-10">
<span className="text-lg">{user?.name?.charAt(0)}</span>
</div>
</div>
</div>
</div>
            {isMenuOpen && (
<ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
>
<li className="p-2">
<div className="flex flex-col">
<span className="font-bold">{user?.name}</span>
<span className={`badge ${getRoleColor(user?.role || '')} badge-sm`}>
                      {user?.role}
</span>
</div>
</li>
<div className="divider my-1"></div>
<li>
<Link href={`/${user?.role}/dashboard`}>Dashboard</Link>
</li>
<li>
<Link href={`/${user?.role}/profile`}>Profile</Link>
</li>
<div className="divider my-1"></div>
<li>
<button onClick={handleLogout}>Logout</button>
</li>
</ul>
            )}
</div>
        ) : (
<div className="flex gap-2">
<Link href="/buyer/login" className="btn btn-primary btn-sm">
              Buyer Login
</Link>
<Link href="/seller/register" className="btn btn-success btn-sm">
              Sell
</Link>
<Link href="/supplier/register" className="btn btn-warning btn-sm">
              Supply
</Link>
</div>
        )}
</div>
</div>
  )
}