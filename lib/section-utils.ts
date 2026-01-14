import { Slide, SlideSection } from '@/types/slide'

export const SECTIONS: SlideSection[] = [
  'introduction',
  'dataset',
  'models',
  'results',
  'analysis',
]

export const SECTION_NAMES: Record<SlideSection, string> = {
  introduction: 'Introduction',
  dataset: 'Dataset',
  models: 'Models',
  results: 'Results',
  analysis: 'Analysis',
}

export const SECTION_COLORS: Record<SlideSection, { 
  bg: string
  accent: string
  gradient: string
}> = {
  introduction: {
    bg: 'rgba(96, 165, 250, 0.05)',
    accent: '#60a5fa',
    gradient: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(96, 165, 250, 0.05) 100%)',
  },
  dataset: {
    bg: 'rgba(139, 92, 246, 0.05)',
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
  },
  models: {
    bg: 'rgba(236, 72, 153, 0.05)',
    accent: '#ec4899',
    gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
  },
  results: {
    bg: 'rgba(34, 197, 94, 0.05)',
    accent: '#22c55e',
    gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
  },
  analysis: {
    bg: 'rgba(251, 146, 60, 0.05)',
    accent: '#fb923c',
    gradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%)',
  },
}

export function getSlideSection(slide: Slide): SlideSection {
  if (slide.section) return slide.section
  
  // Auto-detect based on slide order/content (fallback)
  if (slide.order <= 3) return 'introduction'
  if (slide.order <= 6) return 'dataset'
  if (slide.order <= 10) return 'models'
  if (slide.order <= 14) return 'results'
  return 'analysis'
}

export function getCurrentSection(slides: Slide[], currentIndex: number): SlideSection {
  return getSlideSection(slides[currentIndex])
}

export function getSectionRange(slides: Slide[], section: SlideSection): [number, number] {
  let start = -1
  let end = -1
  
  for (let i = 0; i < slides.length; i++) {
    if (getSlideSection(slides[i]) === section) {
      if (start === -1) start = i
      end = i
    }
  }
  
  return [start, end]
}

