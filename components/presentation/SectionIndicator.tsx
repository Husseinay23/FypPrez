'use client'

import { useSlideContext } from '@/lib/slide-context'
import { SECTIONS, SECTION_NAMES, getCurrentSection, getSectionRange } from '@/lib/section-utils'
import { SlideSection } from '@/types/slide'

export default function SectionIndicator() {
  const { slides, currentSlideIndex } = useSlideContext()
  const currentSection = getCurrentSection(slides, currentSlideIndex)

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40
                    flex flex-col gap-3
                    px-4 py-6
                    bg-background/80 backdrop-blur-md
                    rounded-lg border border-foreground/10
                    shadow-lg">
      {SECTIONS.map((section: SlideSection, index) => {
        const [start, end] = getSectionRange(slides, section)
        const isActive = section === currentSection
        const isPast = start !== -1 && currentSlideIndex > end
        const isInRange = start !== -1 && currentSlideIndex >= start && currentSlideIndex <= end

        return (
          <div
            key={section}
            className="relative flex items-center gap-3 group"
            title={SECTION_NAMES[section]}
          >
            {/* Indicator Line */}
            <div className="relative w-1 h-12 bg-foreground/10 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-full transition-all duration-500 ${
                  isActive || isPast
                    ? 'bg-accent'
                    : isInRange
                    ? 'bg-accent/50'
                    : 'bg-foreground/20'
                }`}
                style={{
                  height: isActive || isPast ? '100%' : isInRange ? '50%' : '0%',
                }}
              />
              {/* Active Dot on Line */}
              {isActive && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full animate-pulse border-2 border-background" />
              )}
            </div>

            {/* Section Label */}
            <div
              className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? 'text-accent scale-105 font-semibold'
                  : isPast || isInRange
                  ? 'text-foreground/70'
                  : 'text-foreground/40'
              }`}
            >
              {SECTION_NAMES[section]}
            </div>
          </div>
        )
      })}
    </div>
  )
}

