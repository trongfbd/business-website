import { getSiteConfig, getBaseUrl } from '@/lib/config'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { DesktopContactHub, MobileContactBar } from '@/components/contact/OmnichannelHub'
import Hero from '@/components/sections/Hero'
import ProductSlider from '@/components/sections/ProductSlider'
import About from '@/components/sections/About'
import BlogPreview from '@/components/sections/BlogPreview'
import FAQ from '@/components/sections/FAQ'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import CTA from '@/components/sections/CTA'
import { OrganizationSchema, LocalBusinessSchema, WebsiteSchema } from '@/components/ui/JsonLd'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const config = await getSiteConfig()
  const baseUrl = getBaseUrl()
  return (
    <>
      <OrganizationSchema config={config} baseUrl={baseUrl} />
      <LocalBusinessSchema config={config} baseUrl={baseUrl} />
      <WebsiteSchema config={config} baseUrl={baseUrl} />
      <Header config={config} />
      <main>
        <Hero config={config} />
        <About />
        <ProductSlider />
        <BlogPreview />
        <FAQ />
        <Testimonials />
        <CTA config={config} />
        <Contact config={config} />
      </main>
      <Footer config={config} />
      <DesktopContactHub config={config} />
      <MobileContactBar config={config} />
    </>
  )
}
