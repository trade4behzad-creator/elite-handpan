'use server'

import { headers } from 'next/headers'
import { supabaseAdmin } from '../../../lib/supabase-admin'
import { checkRateLimit } from '../../../lib/rateLimit'

const PHONE_RE = /^[0-9+\-\s()]{6,20}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type OrderItemSnapshot = {
  product_id: string
  name_en: string
  name_fa: string | null
  quantity: number
  price_usd: number | null
  price_fa: number | null
}

export async function createOrder(input: {
  customer_name: string
  customer_phone: string
  customer_email: string | null
  items: OrderItemSnapshot[]
  payment_type: 'cash' | 'installment'
  shipping_method: string | null
  locale: string
  total_usd: number | null
  total_fa: number | null
}) {
  const name = input.customer_name.trim().slice(0, 100)
  const phone = input.customer_phone.trim()
  const email = input.customer_email?.trim() || null

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  // Max 5 order submissions per hour per IP
  if (!checkRateLimit(`cart-order:${ip}`, 5, 60 * 60 * 1000)) {
    return { success: false as const, error: 'rate_limited' }
  }

  if (!name) {
    return { success: false as const, error: 'invalid_name' }
  }
  if (!PHONE_RE.test(phone)) {
    return { success: false as const, error: 'invalid_phone' }
  }
  if (email && (!EMAIL_RE.test(email) || email.length > 254)) {
    return { success: false as const, error: 'invalid_email' }
  }
  if (!input.items || input.items.length === 0) {
    return { success: false as const, error: 'empty_cart' }
  }
  if (!['cash', 'installment'].includes(input.payment_type)) {
    return { success: false as const, error: 'invalid_payment_type' }
  }
  if (input.shipping_method && !['chapar', 'tipax', 'baar'].includes(input.shipping_method)) {
    return { success: false as const, error: 'invalid_shipping' }
  }

  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      status: 'pending',
      total_usd: input.total_usd,
      total_fa: input.total_fa,
      payment_type: input.payment_type,
      shipping_method: input.shipping_method,
      locale: input.locale,
    })
    .select('id')
    .single()

  if (orderErr || !order) {
    console.error('[db] createOrder error:', orderErr)
    return { success: false as const, error: 'db' }
  }

  const orderItemsRows = input.items.slice(0, 50).map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name_en: item.name_en?.slice(0, 200) ?? null,
    product_name_fa: item.name_fa?.slice(0, 200) ?? null,
    quantity: Math.min(Math.max(1, Math.floor(item.quantity)), 99),
    price_usd: item.price_usd,
    price_fa: item.price_fa,
  }))

  const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(orderItemsRows)
  if (itemsErr) {
    console.error('[db] createOrder order_items error:', itemsErr)
  }

  return { success: true as const, orderId: order.id as string }
}
