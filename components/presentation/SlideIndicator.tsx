'use client'

import { useSlideContext } from '@/lib/slide-context'

export default function SlideIndicator() {
  const { currentSlideIndex, totalSlides } = useSlideContext()

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50
                    px-4 py-2 bg-background/80 backdrop-blur-sm
                    rounded-full text-foreground/70 text-sm">
      {currentSlideIndex + 1} / {totalSlides}
    </div>
  )
}

