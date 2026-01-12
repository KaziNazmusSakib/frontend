// components/AuthProvider.tsx
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: number
  email: string
  name: string
  role: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (token: string, role: string, userData: any) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth data
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('userData')
    const userRole = localStorage.getItem('userRole')

    if (token && userData && userRole) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser({ ...parsedUser, role: userRole })
      } catch (error) {
        logout()
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Protect routes based on authentication
    if (loading) return

    const protectedRoutes = [
      '/buyer/dashboard',
      '/seller/dashboard',
      '/supplier/dashboard',
      '/admin/dashboard',
    ]

    const roleBasedRoutes = {
      '/buyer': 'buyer',
      '/seller': 'seller',
      '/supplier': 'supplier',
      '/admin': ['admin', 'super-admin'],
    }

    const currentRoute = pathname

    // Check if route is protected
    if (protectedRoutes.includes(currentRoute) && !user) {
      router.push('/')
      return
    }

    // Check role-based access
    for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
      if (currentRoute.startsWith(route)) {
        if (!user || !allowedRoles.includes(user.role)) {
          router.push('/')
          return
        }
      }
    }

    // Redirect authenticated users away from login/register pages
    const authPages = [
      '/buyer/login',
      '/buyer/register',
      '/seller/login',
      '/seller/register',
      '/supplier/login',
      '/supplier/register',
      '/admin/login',
    ]

    if (user && authPages.includes(currentRoute)) {
      router.push(`/${user.role}/dashboard`)
    }
  }, [pathname, user, loading, router])

  const login = (token: string, role: string, userData: any) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userRole', role)
    localStorage.setItem('userData', JSON.stringify(userData))
    setUser({ ...userData, role })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
    setUser(null)
    router.push('/')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}