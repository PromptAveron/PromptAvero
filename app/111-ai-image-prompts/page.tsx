import type { Metadata } from 'next'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Box,
  BriefcaseBusiness,
  Camera,
  Check,
  CheckCircle2,
  Contrast,
  Gamepad2,
  Lightbulb,
  Palette,
  Shapes,
  Sparkles,
  UserRound,
  Waves,
  Zap,
} from 'lucide-react'
import { ProductPdfViewer } from '@/components/product-pdf-viewer'
import { ProductPurchaseLink } from '@/components/product-purchase-link'
import { btn } from '@/lib/button-styles'
import {
  calculateProductPrice,
  formatProductPrice,
  normalizeProductPromotionSettings,
  productAudiences,
  productBenefits,
  productCategories,
  productFaqs,
} from '@/lib/product-promotion'
import { getPublicSiteSettings } from '@/lib/public-settings'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: '111 AI Image Prompts Pack',
  description: 'Explore 111 curated AI image prompts across 11 creative categories. Preview the sample and open the digital pack on Gumroad.',
  path: '/111-ai-image-prompts/',
})

const categoryIcons = [Sparkles, Gamepad2, Palette, Camera, Shapes, Lightbulb, Box, BriefcaseBusiness, Contrast, Waves, Zap]
const benefitIcons = [BadgeCheck, Shapes, CheckCircle2, Lightbulb, Palette, ArrowRight]

function ProductCover() {
  return (
    <div className="relative mx-auto w-full max-w-[470px]">
      <div className="absolute -left-3 top-8 h-[88%] w-[88%] rotate-[-8deg] rounded-[2rem] bg-accent" aria-hidden="true" />
      <div className="absolute -right-2 bottom-2 h-[88%] w-[88%] rotate-[7deg] rounded-[2rem] bg-primary/15" aria-hidden="true" />
      <div className="relative aspect-[0.86] overflow-hidden rounded-[2rem] border border-border bg-brand-soft p-7 text-foreground shadow-2xl sm:p-9">
        <div className="absolute -right-16 -top-14 size-64 rounded-full border-[34px] border-primary/20" aria-hidden="true" />
        <div className="absolute -bottom-16 -left-12 size-56 rounded-full bg-primary/15" aria-hidden="true" />
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em]">
            <span>PromptAvero</span><span>Visual field guide / 01</span>
          </div>
          <div className="mt-auto">
            <p className="text-[clamp(5rem,12vw,8rem)] font-semibold leading-[0.78] tracking-[-0.1em]">111</p>
            <p className="mt-5 text-2xl font-semibold uppercase leading-[0.94] tracking-[-0.05em] sm:text-3xl">
              AI image<br />prompts
            </p>
            <p className="mt-4 max-w-[14rem] text-xs font-medium leading-5 text-muted-foreground">
              A collection of creative starting points. Choose a direction. Make it yours.
            </p>
          </div>
          <div className="relative mt-8 flex items-end justify-between border-t border-border pt-4 text-[10px] font-bold uppercase tracking-[0.12em]">
            <span>11 categories<br />Digital PDF</span>
            <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground"><ArrowUpRight size={20} /></span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Price({
  cents,
  oldCents,
  discount,
}: {
  cents: number
  oldCents: number
  discount: number
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      {discount > 0 ? (
        <span className="text-base text-muted-foreground line-through">
          {formatProductPrice(oldCents)}
        </span>
      ) : null}
      <span className="text-3xl font-semibold tracking-tight text-foreground">
        {formatProductPrice(cents)}
      </span>
      {discount > 0 ? (
        <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
          {discount}% off
        </span>
      ) : null}
    </div>
  )
}

export default async function ProductPage() {
  const publicSettings = await getPublicSiteSettings()
  const settings = publicSettings.product_promotion ?? normalizeProductPromotionSettings()
  const price = calculateProductPrice(settings)

  return (
    <div className="bg-background text-foreground">
      <section className="relative isolate overflow-hidden bg-background text-foreground hero-gradient">
        <div className="absolute -right-40 top-12 -z-10 size-[30rem] rounded-full border border-primary/10" aria-hidden="true" />
        <div className="absolute -right-20 top-32 -z-10 size-[22rem] rounded-full border border-primary/10" aria-hidden="true" />
        <div className="container-page grid min-h-[650px] items-center gap-14 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
          <div className="min-w-0 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-3 py-1.5 text-xs font-medium text-brand-text">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              A visual field guide for your next idea
            </p>
            <h1 className="mt-7 max-w-[12ch] text-5xl font-semibold leading-[0.99] tracking-[-0.065em] sm:text-6xl lg:text-7xl">
              Start with a prompt. <span className="text-brand-text">Make it yours.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              When the blank prompt box slows you down, reach for a new direction. Explore 111 curated starting points across 11 visual styles, then shape each one around your own idea.
            </p>
            <div className="mt-7"><Price cents={price.currentPriceCents} oldCents={price.originalPriceCents} discount={price.discountPercentage} /></div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ProductPurchaseLink
                href={settings.gumroadUrl}
                className="gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                Get the Prompt Pack <ArrowUpRight size={17} aria-hidden="true" />
              </ProductPurchaseLink>
              <a
                href="#sample"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Take a look <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-primary" /> Digital PDF</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-primary" /> Instant download</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-primary" /> One-time payment</span>
            </div>
            <p className="mt-4 max-w-lg text-[11px] leading-5 text-muted-foreground">
              Website pricing is a display offer. Gumroad shows the final checkout price and purchase terms.
            </p>
          </div>
          <ProductCover />
        </div>
      </section>

      <section id="sample" className="scroll-mt-20 bg-muted py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-8 grid gap-4 md:grid-cols-[0.65fr_1.35fr] md:items-end">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-text">01 / Open the sample</p>
            <div>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">See what you’re getting before you decide.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">The sample gives you a real look at the PDF’s layout and prompt style. Browse it using your browser’s built-in PDF controls.</p>
            </div>
          </div>
          <ProductPdfViewer src={settings.samplePdfUrl} />

          <div className="mt-7 grid overflow-hidden rounded-[1.75rem] border border-border bg-card text-card-foreground md:grid-cols-[1fr_0.78fr]">
            <div className="min-w-0 p-6 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-text">Like what you see? Keep creating.</p>
              <h3 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">
                Turn Your Imagination Into Something Extraordinary.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                Imagine opening your next project with a range of specific creative directions to explore. Pick a category, choose a prompt, and personalize the details until the idea feels like yours.
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                {['Explore 11 visual categories', 'Browse 111 curated prompts', 'Copy a starting point and personalize it', 'Keep the collection in a digital PDF'].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={15} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 flex flex-col justify-center border-t border-border bg-background p-6 sm:p-9 md:border-l md:border-t-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Your next creative starting point</p>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-5xl font-semibold tracking-[-0.08em] text-brand-text">111</p>
                <p className="text-xs text-muted-foreground sm:text-sm">prompts · 11 categories · digital PDF</p>
              </div>
              <Price cents={price.currentPriceCents} oldCents={price.originalPriceCents} discount={price.discountPercentage} />
              <ProductPurchaseLink
                href={settings.gumroadUrl}
                className="mt-5 gap-2"
              >
                Get all 111 prompts <ArrowRight size={16} aria-hidden="true" />
              </ProductPurchaseLink>
              <p className="mt-3 text-center text-[10px] leading-4 text-muted-foreground">Gumroad shows the final checkout price and purchase terms.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-9 grid gap-4 md:grid-cols-[0.65fr_1.35fr] md:items-end">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-text">02 / Find your direction</p>
            <div>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Eleven styles. One collection to explore.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Move between visual themes and find a prompt that fits the kind of image you want to make.</p>
            </div>
          </div>
          <div className="grid gap-x-8 sm:grid-cols-2">
            {productCategories.map((category, index) => {
              const Icon = categoryIcons[index]
              return (
                <article key={category.name} className="flex items-center gap-4 border-t border-border py-4">
                  <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-text">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h3 className="min-w-0 flex-1 text-sm font-semibold">{category.name}</h3>
                  <span className="text-xs text-muted-foreground">{category.prompts} prompts</span>
                </article>
              )
            })}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">10 prompts in each category, with one extra prompt in Black &amp; White.</p>
        </div>
      </section>

      <section className="bg-muted py-16 text-foreground sm:py-20">
        <div className="container-page">
          <div className="mb-9 grid gap-4 md:grid-cols-[0.65fr_1.35fr] md:items-end">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-text">03 / Put ideas in motion</p>
            <div>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">A useful prompt is a beginning, not a finished image.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Use the collection to try a new direction, then adjust the details to suit what you have in mind.</p>
            </div>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {productBenefits.map((benefit, index) => {
              const Icon = benefitIcons[index]
              return (
                <article key={benefit.title} className="bg-card p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-full bg-brand-soft text-brand-text"><Icon size={18} aria-hidden="true" /></span>
                    <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="container-page grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-text">04 / Made for curious makers</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Who might use the pack?</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">A handy resource for people who like to experiment with AI-assisted visuals.</p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {productAudiences.map((audience) => (
              <li key={audience} className="flex items-center gap-3 border-b border-border py-3 text-sm">
                <UserRound size={16} className="shrink-0 text-brand-text" aria-hidden="true" />{audience}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 bg-brand-soft py-16 sm:py-20">
        <div className="container-page grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-text">05 / Your next idea starts here</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-5xl">
              Keep 111 creative starting points close at hand.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
              Explore the digital pack on Gumroad, review its checkout details, and decide if it belongs in your creative toolkit.
            </p>
          </div>
          <div className="min-w-0 w-full rounded-2xl border border-border bg-card p-5 text-card-foreground sm:min-w-72 sm:p-6">
            <Price cents={price.currentPriceCents} oldCents={price.originalPriceCents} discount={price.discountPercentage} />
            <p className="mt-2 text-xs text-muted-foreground">111 prompts · downloadable PDF</p>
            <ProductPurchaseLink
              href={settings.gumroadUrl}
              className="mt-5 w-full gap-2"
            >
              Make it yours <ArrowUpRight size={17} aria-hidden="true" />
            </ProductPurchaseLink>
            <p className="mt-3 text-center text-[10px] leading-4 text-muted-foreground">Final price and purchase terms are shown on Gumroad.</p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 sm:py-20">
        <div className="container-page max-w-3xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-text">A few quick answers</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Before you pick a prompt.</h2>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {productFaqs.map(({ question, answer }) => (
              <details key={question} className="group py-4">
                <summary className="flex list-none items-center justify-between gap-4 py-1 text-sm font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                  {question}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-brand-text transition-transform group-open:rotate-180">
                    <ArrowDown size={15} aria-hidden="true" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-2 pr-10 pt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
