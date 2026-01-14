import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['buyer', 'seller', 'supplier']).default('buyer'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  categoryId: z.number().min(1, 'Category is required'),
});

export const orderSchema = z.object({
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  paymentMethod: z.enum(['credit_card', 'paypal', 'cash_on_delivery']),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;