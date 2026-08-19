-- Elite Handpan — migration for: featured products, home special-offer pick,
-- manual display order, and editable footer contact info.
-- Safe to run multiple times. Does NOT touch existing data.

-- 1) Products: featured flag (shown as "featured" on the shop page)
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- 2) Products: the single product chosen to appear as the homepage "Special Offer"
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_home_featured boolean NOT NULL DEFAULT false;

-- 3) Products: manual display order for the homepage Instruments grid
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- Helpful index for ordering queries
CREATE INDEX IF NOT EXISTS products_display_order_idx ON products (display_order);

-- Enforce only one product can be the home-featured one at the DB level too
-- (a partial unique index — allows many `false` rows, at most one `true`)
CREATE UNIQUE INDEX IF NOT EXISTS products_one_home_featured_idx
  ON products (is_home_featured)
  WHERE is_home_featured = true;

-- 4) Site settings — single row holding editable footer contact info
CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  contact_email text,
  contact_phone text,
  contact_address text,
  whatsapp_number text,
  instagram_url text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);

-- Seed the single settings row with current hardcoded values (only if empty)
INSERT INTO site_settings (id, contact_email, contact_phone, contact_address, whatsapp_number, instagram_url)
VALUES (1, 'info@elitehandpan.com', '+989000000000', 'Tehran, Iran', '+989000000000', 'https://www.instagram.com/elite_handpan/')
ON CONFLICT (id) DO NOTHING;

-- 5) Accessories: same "featured" flag as products, used by the shop filter
ALTER TABLE accessories ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- ============================================================
-- Phase 2: cart, checkout, cash/installment payment, orders
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 6) Installment pricing (only used/shown on the Persian site)
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_installment numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_installment_fa bigint;

-- 7) Site settings: payment + legal-text additions
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS card_number text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS card_holder_name text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS cheque_sample_url text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS terms_fa text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS terms_en text;

-- 8) Orders — matches the schema already used by the admin Orders pages.
-- Created only if it doesn't already exist; new columns are added either way.
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text,
  customer_email text,
  customer_phone text,
  status text NOT NULL DEFAULT 'pending',
  total_usd numeric,
  total_fa bigint,
  shipping_address text,
  notes text,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid,
  product_name_en text,
  product_name_fa text,
  quantity integer NOT NULL DEFAULT 1,
  price_usd numeric,
  price_fa bigint,
  created_at timestamptz DEFAULT now()
);

-- New columns needed for the cash/installment + shipping-method checkout flow
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_type text DEFAULT 'cash'; -- 'cash' | 'installment'
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_method text; -- 'chapar' | 'tipax' | 'baar' (fa only)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS locale text DEFAULT 'fa';

CREATE INDEX IF NOT EXISTS orders_phone_idx ON orders (customer_phone);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);

-- ============================================================
-- Phase 3: FAQ admin
-- ============================================================

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_en text NOT NULL,
  question_fa text,
  answer_en text NOT NULL,
  answer_fa text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Seed with the FAQs that were previously hardcoded on the site (English only —
-- add Persian translations from the admin FAQ page whenever convenient)
INSERT INTO faqs (question_en, answer_en, sort_order)
SELECT * FROM (VALUES
  ('What materials are Elite handpans made from?', 'Our handpans are crafted from high-grade stainless steel, carefully selected for its acoustic properties and durability. Each instrument undergoes a precise shaping and tuning process.', 0),
  ('How long does production take?', 'Most models are ready to ship within 1–2 weeks. Custom orders may take 4–8 weeks depending on specifications.', 1),
  ('Do you ship internationally?', 'Yes, we ship worldwide. All instruments are packed in professional hard cases with full tracking and insurance.', 2),
  ('What is included with my handpan?', 'Every Elite handpan comes with a hard protective case, premium maintenance oil, and a handwoven carrying strap.', 3),
  ('Do you offer a warranty?', 'All Elite instruments come with a 2-year warranty covering retuning, minor repairs, and quality assessment.', 4),
  ('How do I care for my handpan?', 'Apply the included maintenance oil regularly, keep the instrument away from humidity and extreme temperatures, and store it in its case when not in use.', 5),
  ('Can I try before I buy?', 'We offer video demonstrations for each instrument. Contact us via WhatsApp or email to arrange a live video call session.', 6),
  ('What payment methods do you accept?', 'We accept bank transfers and online payments. Contact us for details on your preferred payment method.', 7),
  ('Can I return or exchange my handpan?', 'Due to the handcrafted nature of our instruments, we do not accept returns. However, we offer exchanges within 14 days if there is a manufacturing defect.', 8),
  ('How do I place an order?', 'Simply add the instrument to your basket on its product page, or contact us directly via WhatsApp. We''ll guide you through the ordering process.', 9)
) AS seed(question_en, answer_en, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM faqs);

-- ============================================================
-- Phase 4: editable product-page feature blocks, About page content,
-- multiple card/IBAN numbers, admin password change
-- ============================================================

-- Product-detail-page feature blocks (High Quality / Warranty / Shipping, etc.)
-- Shown only if the title+body for the current locale are both filled in.
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature1_title_en text DEFAULT 'High Quality';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature1_title_fa text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature1_body_en text DEFAULT 'Each instrument is crafted with premium materials and rigorous quality control.';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature1_body_fa text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature2_title_en text DEFAULT '2-Year Warranty';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature2_title_fa text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature2_body_en text DEFAULT 'All Elite instruments come with a full two-year warranty including retuning service.';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature2_body_fa text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature3_title_en text DEFAULT 'Worldwide Shipping';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature3_title_fa text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature3_body_en text DEFAULT 'Professional packaging and tracked shipping to anywhere in the world.';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS feature3_body_fa text;

-- About page — editable heading/body text + hero/team images
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_heading_en text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_heading_fa text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_body_en text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_body_fa text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_hero_image_url text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_team_image_url text;

-- Cart/checkout: free-text box for card numbers + IBANs (can hold several of each)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS payment_accounts_text text;

-- Admin panel password (hashed) — separate from Supabase auth, used by the
-- existing admin login/logout flow. NULL means "use the current hardcoded/env password".
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS admin_password_hash text;
