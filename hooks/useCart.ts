// hooks/useCart.ts
"use client";
import { useState, useEffect } from 'react'
 
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  imageUrl?: string
}
 
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
 
  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        localStorage.removeItem('cart')
      }
    }
  }, [])
 
  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])
 
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }
 
  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }
 
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    )
  }
 
  const clearCart = () => {
    setItems([])
  }
 
  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }
 
  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
  }
}// hooks/useCart.ts
"use client";
import { useState, useEffect } from 'react'
 
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  imageUrl?: string
}
 
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
 
  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        localStorage.removeItem('cart')
      }
    }
  }, [])
 
  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])
 
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }
 
  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }
 
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    )
  }
 
  const clearCart = () => {
    setItems([])
  }
 
  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }
 
  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
  }
}