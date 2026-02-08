/**
 * Course content configuration
 * Different content per deployment (Rumah Berbagi vs Pejuang Kode)
 */

import { branding } from './branding.server'

export interface CourseConfig {
  title: string
  subtitle: string
  description: string
  videoUrl: string | null
  videoPreviewImage: string | null
  ctaText: string
  ctaUrl: string
  instagramUrl: string
  telegramUrl: string | null
}

// Course configurations by site
const courses: Record<string, CourseConfig> = {
  'Rumah Berbagi': {
    title: 'Tahun Prasekolahku',
    subtitle: 'Membangun fondasi pendidikan prasekolah (0-6 tahun), menguatkan akar masa depan.',
    description: 'Kelas untuk orang tua yang ingin mendidik anak usia prasekolah dengan lembut, bahagia, dan cinta.',
    videoUrl: 'https://rbagi.id/video-tahun-prasekolahku',
    videoPreviewImage: '/images/tahun-prasekolahku-video-preview.jpeg',
    ctaText: 'Gabung Kelas',
    ctaUrl: '/login',
    instagramUrl: 'https://instagram.com/vika.riandini',
    telegramUrl: null,
  },
  'Pejuang Kode': {
    title: 'Ngabuburit Bareng Pejuang Kode',
    subtitle: 'Workshop coding sore hari untuk developer Indonesia.',
    description: 'Belajar coding bareng di sore hari sebelum berbuka puasa. Santai, fun, dan penuh insight!',
    videoUrl: null,
    videoPreviewImage: null,
    ctaText: 'Daftar Sekarang',
    ctaUrl: '/login',
    instagramUrl: 'https://instagram.com/pejuangkode',
    telegramUrl: 'https://t.me/pejuangkode',
  },
}

// Default fallback
const defaultCourse: CourseConfig = courses['Rumah Berbagi']

export function getCourse(): CourseConfig {
  return courses[branding.siteName] ?? defaultCourse
}

export const course = getCourse()
