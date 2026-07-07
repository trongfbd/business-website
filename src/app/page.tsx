import { getSiteConfig } from '@/lib/config'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { DesktopContactHub, MobileContactBar } from '@/components/contact/OmnichannelHub'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import About from '@/components/sections/About'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import CTA from '@/components/sections/CTA'
import { OrganizationSchema, LocalBusinessSchema, WebsiteSchema } from '@/components/ui/JsonLd'

export default async function HomePage() {
  const config = await getSiteConfig()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com'
  return (
    <>
      <OrganizationSchema config={config} baseUrl={baseUrl} />
      <LocalBusinessSchema config={config} baseUrl={baseUrl} />
      <WebsiteSchema config={config} baseUrl={baseUrl} />
      <Header config={config} />
      <main>
        <Hero config={config} />
        <About />
        <Services config={config} />
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
