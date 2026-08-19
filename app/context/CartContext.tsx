'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type CartItem = {
  id: string
  category: 'handpan' | 'accessory'
  slug: string
  name_en: string
  name_fa: string | null
  image: string | null
  price: number
  price_fa: number | null
  price_installment: number | null
  price_installment_fa: number | null
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'elite-handpan-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      console.error('cart hydrate error', e)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('cart persist error', e)
    }
  }, [items, hydrated])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { ...item, quantity }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(99, Math.max(1, Math.floor(quantity))) } : i))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
