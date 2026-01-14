'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Slide } from '@/types/slide'

interface SlideState {
  currentSlideIndex: number
  totalSlides: number
  isTransitioning: boolean
  direction: 'forward' | 'back'
}

interface SlideContextType extends SlideState {
  slides: Slide[]
  currentSlide: Slide
  nextSlide: () => void
  previousSlide: () => void
  goToSlide: (index: number) => void
}

const SlideContext = createContext<SlideContextType | undefined>(undefined)

export function SlideProvider({ 
  children, 
  slides 
}: { 
  children: React.ReactNode
  slides: Slide[]
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  const totalSlides = slides.length

  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= totalSlides || isTransitioning) return
    
    setDirection(index > currentSlideIndex ? 'forward' : 'back')
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentSlideIndex(index)
      setIsTransitioning(false)
      // Update URL hash for deep linking
      window.location.hash = slides[index].id
    }, 400)
  }, [currentSlideIndex, totalSlides, isTransitioning, slides])

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      goToSlide(currentSlideIndex + 1)
    }
  }, [currentSlideIndex, totalSlides, goToSlide])

  const previousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1)
    }
  }, [currentSlideIndex, goToSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return
      
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault()
          nextSlide()
          break
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          previousSlide()
          break
        case 'Home':
          e.preventDefault()
          goToSlide(0)
          break
        case 'End':
          e.preventDefault()
          goToSlide(totalSlides - 1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, previousSlide, goToSlide, totalSlides, isTransitioning])

  // Deep linking from URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      const slideIndex = slides.findIndex(s => s.id === hash)
      if (slideIndex !== -1 && slideIndex !== currentSlideIndex) {
        setCurrentSlideIndex(slideIndex)
      }
    }
  }, []) // Only on mount

  const currentSlide = slides[currentSlideIndex]

  return (
    <SlideContext.Provider
      value={{
        slides,
        currentSlide,
        currentSlideIndex,
        totalSlides,
        isTransitioning,
        direction,
        nextSlide,
        previousSlide,
        goToSlide,
      }}
    >
      {children}
    </SlideContext.Provider>
  )
}

export function useSlideContext() {
  const context = useContext(SlideContext)
  if (!context) {
    throw new Error('useSlideContext must be used within SlideProvider')
  }
  return context
}

