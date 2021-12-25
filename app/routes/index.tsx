import type { MetaFunction } from 'remix'
import { HeroSection } from '~/components/hero-section'
import { BenefitSection } from '~/components/benefit-section'

export const meta: MetaFunction = () => {
  return {
    title: 'Kelas Rumah Berbagi',
    description: 'Tahun Prasekolahku',
  }
}

export default function HomePage() {
  return (
    <div>
      <main>
        <HeroSection />
        <BenefitSection title="Mendidik anak usia Prasekolah dengan lembut, bahagia, dan cinta"></BenefitSection>
      </main>
    </div>
  )
}
