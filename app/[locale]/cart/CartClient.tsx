'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useCart } from '../../context/CartContext'
import { createOrder, type OrderItemSnapshot } from './actions'

const GOLD = '#3F3E7A'

type Settings = {
  payment_accounts_text: string | null
  cheque_sample_url: string | null
  whatsapp_number: string | null
  terms_fa: string | null
  terms_en: string | null
}

type Step = 'cart' | 'info' | 'confirmation'
type PaymentType = 'cash' | 'installment'
type ShippingMethod = 'chapar' | 'tipax' | 'baar'

function getChequeCount(totalToman: number): number {
  if (totalToman <= 50_000_000) return 2
  if (totalToman <= 100_000_000) return 3
  return 4
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function CartClient({ locale, settings }: { locale: string; settings: Settings }) {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const isFa = locale === 'fa'

  const [step, setStep] = useState<Step>('cart')
  const [acceptedRules, setAcceptedRules] = useState(false)
  const [shipping, setShipping] = useState<ShippingMethod>('chapar')
  const [paymentType, setPaymentType] = useState<PaymentType>('cash')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<'none' | 'generic' | 'rate_limited'>('none')
  const [orderId, setOrderId] = useState<string | null>(null)

  const currency: 'toman' | 'usd' = isFa ? 'toman' : 'usd'

  const unitPrice = (item: (typeof items)[number]) => {
    if (isFa) {
      if (paymentType === 'installment' && item.price_installment_fa) return item.price_installment_fa
      return item.price_fa ?? item.price
    }
    return item.price
  }

  const total = useMemo(
    () => items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0),
    [items, paymentType, isFa]
  )

  const formatPrice = (amount: number) =>
    isFa ? `${amount.toLocaleString('en-US')} تومان` : `$${amount.toLocaleString()}`

  const chequeCount = isFa && paymentType === 'installment' ? getChequeCount(total) : 0

  // Deposit = 50% of handpan (instrument) prices + 100% of accessory prices.
  // Only relevant for the fa-site installment flow.
  const installmentDeposit = useMemo(() => {
    if (!isFa || paymentType !== 'installment') return 0
    return items.reduce((sum, item) => {
      const line = unitPrice(item) * item.quantity
      return sum + (item.category === 'handpan' ? line * 0.5 : line)
    }, 0)
  }, [items, paymentType, isFa])

  const installmentRemaining = Math.max(0, total - installmentDeposit)

  const rulesText = isFa ? settings.terms_fa : settings.terms_en
  const whatsappNumber = (settings.whatsapp_number ?? '').replace(/[^0-9]/g, '')

  const PHONE_RE = /^[0-9+\-\s()]{6,20}$/

  async function handleSubmitInfo() {
    if (!name.trim() || !PHONE_RE.test(phone.trim())) return
    setSubmitting(true)
    setSubmitError('none')

    const orderItems: OrderItemSnapshot[] = items.map((item) => ({
      product_id: item.id,
      name_en: item.name_en,
      name_fa: item.name_fa,
      quantity: item.quantity,
      price_usd: isFa ? null : unitPrice(item),
      price_fa: isFa ? unitPrice(item) : null,
    }))

    const result = await createOrder({
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim() || null,
      items: orderItems,
      payment_type: paymentType,
      shipping_method: isFa ? shipping : null,
      locale,
      total_usd: isFa ? null : total,
      total_fa: isFa ? total : null,
    })

    setSubmitting(false)
    if (!result.success) {
      setSubmitError(result.error === 'rate_limited' ? 'rate_limited' : 'generic')
      return
    }

    setOrderId(result.orderId)
    clearCart()
    setStep('confirmation')
  }

  function buildWhatsAppMessage() {
    const lines = [
      isFa ? `سفارش جدید (${orderId?.slice(0, 8)})` : `New order (${orderId?.slice(0, 8)})`,
      `${isFa ? 'نام' : 'Name'}: ${name}`,
      `${isFa ? 'تلفن' : 'Phone'}: ${phone}`,
      `${isFa ? 'مبلغ' : 'Amount'}: ${
        isFa && paymentType === 'installment' ? formatPrice(installmentDeposit) : formatPrice(total)
      }`,
    ]
    return encodeURIComponent(lines.join('\n'))
  }

  if (items.length === 0 && step === 'cart') {
    return (
      <main className="min-h-screen bg-white pt-32 pb-24 px-8 text-center">
        <p className="text-2xl text-gray-400 mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
          {isFa ? 'سبد خرید شما خالی است' : 'Your cart is empty'}
        </p>
        <Link
          href={`/${locale}/shop`}
          className="inline-block border px-8 py-3 text-sm tracking-widest uppercase"
          style={{ borderColor: GOLD, color: GOLD }}
        >
          {isFa ? 'مشاهده فروشگاه' : 'Browse Shop'}
        </Link>
      </main>
    )
  }

  if (step === 'cart') {
    return (
      <main className="min-h-screen bg-white pt-32 pb-24 px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-light mb-10" style={{ fontFamily: 'var(--font-cormorant)' }}>
            {isFa ? 'سبد خرید' : 'Your Cart'}
          </h1>

          <div className="flex flex-col gap-4 mb-10">
            {items.map((item) => {
              const itemName = isFa && item.name_fa ? item.name_fa : item.name_en
              return (
                <div key={item.id} className="flex items-center gap-4 border border-gray-100 rounded-sm p-4">
                  <div className="w-20 h-20 bg-[#f5f5f5] rounded-sm flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={itemName} className="w-full h-full object-contain mix-blend-multiply" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-[#111]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {itemName}
                    </p>
                    <p className="text-xs text-gray-400 uppercase">{item.category}</p>
                    <p className="text-sm mt-1" style={{ color: GOLD }}>
                      {formatPrice(unitPrice(item))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 border border-gray-200 rounded text-sm"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 border border-gray-200 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 text-xs ml-2"
                  >
                    {isFa ? 'حذف' : 'Remove'}
                  </button>
                </div>
              )
            })}
          </div>

          {isFa && (
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-3">روش ارسال</p>
              <div className="flex gap-4 flex-wrap">
                {(['chapar', 'tipax', 'baar'] as ShippingMethod[]).map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="shipping" checked={shipping === m} onChange={() => setShipping(m)} />
                    {m === 'chapar' ? 'چاپار' : m === 'tipax' ? 'تیپاکس' : 'باربری'}
                  </label>
                ))}
              </div>
            </div>
          )}

          {isFa && (
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-3">نحوه پرداخت</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="paymentType"
                    checked={paymentType === 'cash'}
                    onChange={() => setPaymentType('cash')}
                  />
                  نقدی
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="paymentType"
                    checked={paymentType === 'installment'}
                    onChange={() => setPaymentType('installment')}
                  />
                  قسطی
                </label>
              </div>
            </div>
          )}

          {rulesText && (
            <div className="mb-8 border border-gray-100 rounded-sm p-4 bg-gray-50">
              <p className="text-sm text-gray-500 mb-2 font-medium">{isFa ? 'قوانین خرید' : 'Purchase Terms'}</p>
              <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line mb-3">{rulesText}</p>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={acceptedRules} onChange={(e) => setAcceptedRules(e.target.checked)} />
                {isFa ? 'قوانین بالا را می‌پذیرم' : 'I accept the terms above'}
              </label>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-6 mb-8">
            <span className="text-lg" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {isFa ? 'جمع کل' : 'Total'}
            </span>
            <span className="text-2xl font-medium" style={{ color: GOLD, fontFamily: 'var(--font-cormorant)' }}>
              {formatPrice(total)}
            </span>
          </div>

          <button
            type="button"
            disabled={rulesText ? !acceptedRules : false}
            onClick={() => setStep('info')}
            className="w-full text-white text-sm tracking-widest uppercase py-4"
            style={{
              background: rulesText && !acceptedRules ? '#ccc' : GOLD,
              cursor: rulesText && !acceptedRules ? 'not-allowed' : 'pointer',
            }}
          >
            {isFa ? 'ادامه' : 'Continue'}
          </button>
        </div>
      </main>
    )
  }

  if (step === 'info') {
    return (
      <main className="min-h-screen bg-white pt-32 pb-24 px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-light mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>
            {isFa ? 'مشخصات مشتری' : 'Your Details'}
          </h1>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">{isFa ? 'نام (اجباری)' : 'Name (required)'}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                {isFa ? 'شماره تماس (اجباری)' : 'Phone (required)'}
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\-\s()]/g, ''))}
                type="tel"
                pattern="[0-9+\-\s()]{6,20}"
                maxLength={20}
                style={{ ...inputStyle, direction: 'ltr' }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">{isFa ? 'ایمیل (اختیاری)' : 'Email (optional)'}</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                maxLength={254}
                style={{ ...inputStyle, direction: 'ltr' }}
              />
            </div>

            {submitError === 'generic' && (
              <p className="text-sm text-red-500">
                {isFa ? 'خطایی رخ داد، دوباره تلاش کنید' : 'Something went wrong, try again'}
              </p>
            )}
            {submitError === 'rate_limited' && (
              <p className="text-sm text-red-500">
                {isFa
                  ? 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.'
                  : 'Too many attempts. Please try again in a little while.'}
              </p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="flex-1 border border-gray-200 text-gray-500 text-sm py-3"
              >
                {isFa ? 'بازگشت' : 'Back'}
              </button>
              <button
                type="button"
                disabled={!name.trim() || !PHONE_RE.test(phone.trim()) || submitting}
                onClick={handleSubmitInfo}
                className="flex-1 text-white text-sm py-3"
                style={{ background: !name.trim() || !PHONE_RE.test(phone.trim()) || submitting ? '#ccc' : GOLD }}
              >
                {submitting ? (isFa ? 'در حال ثبت...' : 'Submitting...') : isFa ? 'ثبت سفارش' : 'Submit Order'}
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-8">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-3xl mb-2" style={{ color: GOLD }}>
          ✓
        </p>
        <h1 className="text-3xl font-light mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
          {isFa ? 'مشخصات شما ثبت شد' : 'Your details were submitted'}
        </h1>

        {isFa && paymentType === 'cash' && (
          <div className="text-right border border-gray-100 rounded-sm p-6 mb-6">
            <p className="text-sm text-gray-600 mb-4">
              مشخصات شما ثبت شد. لطفاً مبلغ <strong style={{ color: GOLD }}>{formatPrice(total)}</strong> را به شماره
              کارت یا شبای زیر واریز نموده و رسید واریز را به شماره واتساپ زیر ارسال نمایید.
            </p>
            {settings.payment_accounts_text && (
              <pre
                className="text-sm mb-2 whitespace-pre-wrap"
                style={{ direction: 'ltr', color: GOLD, fontFamily: 'var(--font-inter)' }}
              >
                {settings.payment_accounts_text}
              </pre>
            )}
          </div>
        )}

        {isFa && paymentType === 'installment' && (
          <div className="text-right border border-gray-100 rounded-sm p-6 mb-6">
            <p className="text-sm text-gray-600 mb-4">
              مشخصات شما ثبت شد. لطفاً مبلغ{' '}
              <strong style={{ color: GOLD }}>{formatPrice(Math.round(installmentDeposit))}</strong> را به شماره کارت
              یا شبای زیر واریز نموده و رسید واریز را به همراه تصویر چک‌ها طبق نمونه، به شماره واتساپ زیر ارسال
              نمایید.
            </p>
            {settings.payment_accounts_text && (
              <pre
                className="text-sm mb-4 whitespace-pre-wrap"
                style={{ direction: 'ltr', color: GOLD, fontFamily: 'var(--font-inter)' }}
              >
                {settings.payment_accounts_text}
              </pre>
            )}
            <p className="text-sm text-gray-600 mb-4">
              مابقی مبلغ به‌صورت <strong>{chequeCount} فقره چک</strong> با فاصله یک‌ماهه دریافت می‌شود. مبلغ چک‌ها
              باید معادل <strong style={{ color: GOLD }}>{formatPrice(Math.round(installmentRemaining))}</strong> باشد.
            </p>
            {settings.cheque_sample_url && (
              <>
                <p className="text-xs text-gray-500 mb-2">نمونه چک قابل قبول:</p>
                <img src={settings.cheque_sample_url} alt="Cheque sample" className="w-full rounded-sm border border-gray-100" />
              </>
            )}
          </div>
        )}

        {!isFa && (
          <div className="border border-gray-100 rounded-sm p-6 mb-6">
            <p className="text-sm text-gray-600">
              To confirm your purchase, please message us on WhatsApp and our team will guide you through payment and
              confirmation.
            </p>
          </div>
        )}

        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-white text-sm tracking-widest uppercase py-4"
            style={{ background: '#25D366' }}
          >
            {isFa ? 'ارسال رسید در واتساپ' : 'Send Receipt on WhatsApp'}
          </a>
        )}

        <Link href={`/${locale}/shop`} className="block mt-6 text-sm text-gray-400 hover:text-[#3F3E7A]">
          {isFa ? 'بازگشت به فروشگاه' : 'Back to Shop'}
        </Link>
      </div>
    </main>
  )
}
