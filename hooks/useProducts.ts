// hooks/useProducts.ts
"use client";
import { useState, useEffect } from 'react'
import { productsAPI } from '@/lib/api'
import toast from 'react-hot-toast'
 
interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  category: string
  stock: number
  rating: number
  sellerId: number
  sellerName: string
  createdAt: string
  updatedAt: string
}
 
interface UseProductsProps {
  category?: string
  sellerId?: number
  search?: string
  page?: number
  limit?: number
}
 
export function useProducts({
  category,
  sellerId,
  search,
  page = 1,
  limit = 12,
}: UseProductsProps = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
 
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params: any = { page, limit }
      if (category) params.category = category
      if (sellerId) params.sellerId = sellerId
      if (search) params.search = search
 
      const response = await productsAPI.getAll(params)
      setProducts(response.data.products || [])
      setTotalPages(response.data.totalPages || 1)
      setTotalProducts(response.data.total || 0)
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => {
    fetchProducts()
  }, [category, sellerId, search, page, limit])
 
  const refetch = () => {
    fetchProducts()
  }
 
  return {
    products,
    loading,
    totalPages,
    totalProducts,
    refetch,
  }
}