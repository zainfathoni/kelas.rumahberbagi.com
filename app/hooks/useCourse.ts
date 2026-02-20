import { useRouteLoaderData } from '@remix-run/react'
import type { CourseConfig } from '~/config/course.server'

/**
 * Hook to access course configuration from root loader
 */
export function useCourse(): CourseConfig {
  const rootData = useRouteLoaderData('root') as
    | { course: CourseConfig }
    | undefined

  // Fallback defaults
  return (
    rootData?.course ?? {
      title: 'Welcome',
      subtitle: 'Learning platform',
      description: 'Online courses and workshops',
      videoUrl: null,
      videoPreviewImage: null,
      ctaText: 'Get Started',
      ctaUrl: '/login',
      instagramUrl: '',
      telegramUrl: null,
    }
  )
}
