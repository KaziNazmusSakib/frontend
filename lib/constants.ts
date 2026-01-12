// lib/constants.ts
export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3001'

export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  SUPPLIER: 'supplier',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super-admin',
} as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
  COMING_SOON: 'coming_soon',
} as const

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
} as const

export const BUSINESS_TYPES = [
  'Manufacturer',
  'Wholesaler',
  'Distributor',
  'Dropshipper',
  'Producer',
  'Other',
]

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Sports',
  'Health & Beauty',
  'Toys',
  'Automotive',
  'Food & Beverage',
  'Other',
]

export const PAGE_SIZE = 12