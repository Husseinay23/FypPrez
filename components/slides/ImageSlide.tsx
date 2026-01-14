'use client'

import { Slide } from '@/types/slide'
import Image from 'next/image'

interface ImageSlideProps {
  slide: Slide
  className?: string
  sectionStyle?: React.CSSProperties
  accentBarStyle?: React.CSSProperties
}

export default function ImageSlide({ slide, className, sectionStyle, accentBarStyle }: ImageSlideProps) {
  if (!slide.image) return null

  return (
    <div className={className} style={sectionStyle}>
      {/* Accent Bar */}
      {accentBarStyle && (
        <div className="absolute top-0 left-0 right-0 h-1" style={accentBarStyle} />
      )}

      {slide.title && (
        <h2 className="text-4xl font-bold text-foreground mb-8 text-center relative z-10">
          {slide.title}
        </h2>
      )}
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-6xl w-full relative z-10">
        <div className="relative w-full h-full max-h-[60vh] mb-4 group">
          <div className="relative w-full h-full rounded-lg overflow-hidden border border-foreground/10 hover:border-accent/50 transition-all hover:shadow-xl">
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              fill
              className="object-contain p-4"
              priority
            />
          </div>
        </div>
        
        {slide.image.caption && (
          <p className="text-lg text-foreground/70 text-center mt-4 group-hover:text-foreground transition-colors">
            {slide.image.caption}
          </p>
        )}
      </div>
    </div>
  )
}

