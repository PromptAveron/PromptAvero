export const PRODUCT_PROMOTION_DEFAULTS = {
  originalPriceCents: 1900,
  discountPercentage: 60,
  promotionEnabled: true,
  gumroadUrl: 'https://promptavero.gumroad.com/l/111-ai-image-prompts-pack',
  samplePdfUrl: '/5-sample-prompts.pdf',
  popupEnabled: true,
  popupDelaySeconds: 5,
}

export interface ProductPromotionSettings {
  originalPriceCents: number
  discountPercentage: number
  promotionEnabled: boolean
  gumroadUrl: string
  samplePdfUrl: string
  popupEnabled: boolean
  popupDelaySeconds: number
}

type SettingsRecord = Record<string, unknown>

function isValidPdfUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value) return false
  if (value.startsWith('/') && !value.startsWith('//')) return value.toLowerCase().split(/[?#]/)[0].endsWith('.pdf')
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.pathname.toLowerCase().endsWith('.pdf')
  } catch {
    return false
  }
}

function isValidGumroadUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value) return false
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    return url.protocol === 'https:' && url.pathname !== '/' && (host === 'gumroad.com' || host.endsWith('.gumroad.com'))
  } catch {
    return false
  }
}

export function normalizeProductPromotionSettings(values: SettingsRecord = {}): ProductPromotionSettings {
  const originalPriceCents = values.product_original_price_cents
  const discountPercentage = values.product_discount_percentage
  const popupDelaySeconds = values.product_popup_delay_seconds
  const gumroadUrl = values.product_gumroad_url
  const samplePdfUrl = values.product_sample_pdf_url

  return {
    originalPriceCents:
      typeof originalPriceCents === 'number' && Number.isSafeInteger(originalPriceCents) && originalPriceCents >= 0
        ? originalPriceCents
        : PRODUCT_PROMOTION_DEFAULTS.originalPriceCents,
    discountPercentage:
      typeof discountPercentage === 'number' && Number.isInteger(discountPercentage) && discountPercentage >= 0 && discountPercentage <= 100
        ? discountPercentage
        : PRODUCT_PROMOTION_DEFAULTS.discountPercentage,
    promotionEnabled:
      typeof values.product_promotion_enabled === 'boolean'
        ? values.product_promotion_enabled
        : PRODUCT_PROMOTION_DEFAULTS.promotionEnabled,
    gumroadUrl: isValidGumroadUrl(gumroadUrl) ? gumroadUrl : PRODUCT_PROMOTION_DEFAULTS.gumroadUrl,
    samplePdfUrl: isValidPdfUrl(samplePdfUrl) ? samplePdfUrl : PRODUCT_PROMOTION_DEFAULTS.samplePdfUrl,
    popupEnabled:
      typeof values.product_popup_enabled === 'boolean'
        ? values.product_popup_enabled
        : PRODUCT_PROMOTION_DEFAULTS.popupEnabled,
    popupDelaySeconds:
      typeof popupDelaySeconds === 'number' && Number.isInteger(popupDelaySeconds) && popupDelaySeconds >= 0 && popupDelaySeconds <= 120
        ? popupDelaySeconds
        : PRODUCT_PROMOTION_DEFAULTS.popupDelaySeconds,
  }
}

export function calculateProductPrice(settings: ProductPromotionSettings) {
  const discountPercentage = settings.promotionEnabled ? settings.discountPercentage : 0
  const discountAmountCents = Math.round(settings.originalPriceCents * discountPercentage / 100)
  return {
    originalPriceCents: settings.originalPriceCents,
    discountPercentage,
    discountAmountCents,
    currentPriceCents: settings.originalPriceCents - discountAmountCents,
  }
}

export function formatProductPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export const productCategories = [
  { name: 'Pop AI Art', prompts: 10 },
  { name: 'Gaming', prompts: 10 },
  { name: 'Aesthetic', prompts: 10 },
  { name: 'Closeup Shots', prompts: 10 },
  { name: 'Collage', prompts: 10 },
  { name: 'Imaginary', prompts: 10 },
  { name: '3D Illustration', prompts: 10 },
  { name: 'Business & Professionals', prompts: 10 },
  { name: 'Black & White', prompts: 11 },
  { name: 'Watercolor Portrait', prompts: 10 },
  { name: 'Futuristic', prompts: 10 },
]

export const productBenefits = [
  { title: '111 Curated Prompts', description: 'A considered collection of creative image-generation ideas, organized in one place.' },
  { title: '11 Creative Categories', description: 'Explore a variety of styles and visual concepts to find a fresh direction.' },
  { title: 'Ready to Use', description: 'Copy a prompt into a compatible image generator, then customize it to suit your idea.' },
  { title: 'Creative Inspiration', description: 'Use the collection as a starting point when you want to explore a new visual concept.' },
  { title: 'Multiple Artistic Styles', description: 'Move between portrait, illustration, monochrome, futuristic, and other visual directions.' },
  { title: 'Easy to Follow', description: 'Browse the digital PDF at your own pace and choose prompts that fit your project.' },
]

export const productAudiences = [
  'AI image generation enthusiasts',
  'Digital artists and designers',
  'Content creators',
  'Social media creators',
  'Graphic designers',
  'Creative professionals',
  'Anyone exploring AI-powered creativity',
]

export const productFaqs = [
  {
    question: 'What is included in the 111 AI Image Prompts Pack?',
    answer: 'The digital PDF includes 111 curated prompts organized across 11 creative categories.',
  },
  {
    question: 'How many categories are included?',
    answer: 'There are 11 categories, with 10 prompts in each except Black & White, which has 11.',
  },
  {
    question: 'What format will I receive?',
    answer: 'The product is a downloadable PDF. No physical item will be shipped.',
  },
  {
    question: 'How do I access the prompts after purchasing?',
    answer: 'Gumroad provides access and delivery instructions after checkout.',
  },
  {
    question: 'Which AI image generators can I use these prompts with?',
    answer: 'The prompts can be adapted for compatible AI image generators. Check each tool’s current input requirements.',
  },
  {
    question: 'Are these prompts suitable for beginners?',
    answer: 'Yes. The collection is organized so you can browse categories and adapt prompts at your own pace.',
  },
  {
    question: 'What price will I pay?',
    answer: 'The website shows a configurable offer display. Gumroad shows the final checkout price and applicable purchase terms.',
  },
]
