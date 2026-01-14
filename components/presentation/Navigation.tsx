'use client'

import { useSlideContext } from '@/lib/slide-context'

export default function Navigation() {
  const { currentSlideIndex, totalSlides, nextSlide, previousSlide, isTransitioning } = useSlideContext()

  return (
    <>
      {/* Previous Button (Top) */}
      {currentSlideIndex > 0 && (
        <button
          onClick={previousSlide}
          disabled={isTransitioning}
          className="absolute left-1/2 -translate-x-1/2 top-8 z-50 
                     px-6 py-3 bg-accent/20 hover:bg-accent/30 
                     text-foreground rounded-lg backdrop-blur-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Next Button (Bottom) */}
      {currentSlideIndex < totalSlides - 1 && (
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute left-1/2 -translate-x-1/2 bottom-20 z-50 
                     px-6 py-3 bg-accent/20 hover:bg-accent/30 
                     text-foreground rounded-lg backdrop-blur-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </>
  )
}

