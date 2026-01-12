// lib/api.ts
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userData')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  buyer: {
    register: (data: any) => api.post('/auth/buyer/register', data),
    login: (data: any) => api.post('/auth/buyer/login', data),
  },
  seller: {
    register: (data: any) => api.post('/auth/seller/register', data),
    login: (data: any) => api.post('/auth/seller/login', data),
  },
  supplier: {
    register: (data: any) => api.post('/auth/supplier/register', data),
    login: (data: any) => api.post('/auth/supplier/login', data),
  },
  admin: {
    register: (data: any) => api.post('/auth/admin/register', data),
    login: (data: any) => api.post('/auth/admin/login', data),
  },
}

export const buyerAPI = {
  getDashboard: () => api.get('/buyer/dashboard'),
  getProfile: () => api.get('/buyer/profile'),
  updateProfile: (data: any) => api.put('/buyer/profile', data),
  getById: (id: number) => api.get(`/buyer/${id}`),
  getRecentOrders: () => api.get('/buyer/orders/recent'),
}

export const sellerAPI = {
  getDashboard: () => api.get('/seller/dashboard'),
  getProfile: () => api.get('/seller/profile'),
  updateProfile: (data: any) => api.put('/seller/profile', data),
  getById: (id: number) => api.get(`/seller/${id}`),
  getProducts: (params?: any) => api.get('/seller/products', { params }),
  addProduct: (data: any) => api.post('/seller/products', data),
  updateProduct: (id: number, data: any) => api.put(`/seller/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/seller/products/${id}`),
  getOrders: () => api.get('/seller/orders'),
}

export const supplierAPI = {
  getDashboard: () => api.get('/supplier/dashboard'),
  getProfile: () => api.get('/supplier/profile'),
  updateProfile: (data: any) => api.put('/supplier/profile', data),
  getById: (id: number) => api.get(`/supplier/${id}`),
  search: (query: string) => api.get(`/supplier/search?q=${encodeURIComponent(query)}`),
  getTopSuppliers: (limit: number = 10) => api.get(`/supplier/top?limit=${limit}`),
  getProducts: () => api.get('/supplier/products'),
  getOrders: () => api.get('/supplier/orders'),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getProfile: () => api.get('/admin/profile'),
  getById: (id: number) => api.get(`/admin/${id}`),
  getUsers: (role?: string) => api.get('/admin/users', { params: { role } }),
  updateUser: (id: number, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
  getProducts: () => api.get('/admin/products'),
  getOrders: () => api.get('/admin/orders'),
  getStatistics: () => api.get('/admin/statistics'),
}

export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/categories'),
  getByCategory: (category: string) => api.get(`/products/category/${category}`),
}

export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: number, data: any) => api.put(`/orders/${id}`, data),
  cancel: (id: number) => api.delete(`/orders/${id}`),
}

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data: any) => api.post('/cart', data),
  updateCart: (id: number, data: any) => api.put(`/cart/${id}`, data),
  removeFromCart: (id: number) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart'),
}

export default api