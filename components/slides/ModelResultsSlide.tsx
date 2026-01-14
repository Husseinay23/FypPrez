'use client'

import { Slide } from '@/types/slide'
import Image from 'next/image'

interface ModelResultsSlideProps {
  slide: Slide
  className?: string
  sectionStyle?: React.CSSProperties
  accentBarStyle?: React.CSSProperties
}

export default function ModelResultsSlide({ slide, className, sectionStyle, accentBarStyle }: ModelResultsSlideProps) {
  if (!slide.modelName || !slide.images || slide.images.length < 3) {
    return <div className={className}>Invalid model results slide</div>
  }

  return (
    <div className={className} style={sectionStyle}>
      {/* Accent Bar */}
      {accentBarStyle && (
        <div className="absolute top-0 left-0 right-0 h-1" style={accentBarStyle} />
      )}

      {/* Header */}
      <div className="w-full max-w-7xl mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-4 text-center">
          {slide.title || slide.modelName}
        </h2>
        
        {/* Metrics */}
        {slide.metrics && (
          <div className="flex justify-center gap-8 mb-6">
            {Object.entries(slide.metrics).map(([key, value]) => (
              <div
                key={key}
                className="px-6 py-3 bg-foreground/5 rounded-lg border border-foreground/10 hover:bg-foreground/10 transition-colors"
                title={`${key}: ${value}`}
              >
                <div className="text-sm text-foreground/70 uppercase tracking-wide">{key}</div>
                <div className="text-2xl font-bold text-foreground">{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Three Images Grid */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-7xl mb-6">
        {slide.images.slice(0, 3).map((image, idx) => (
          <div
            key={idx}
            className="relative group flex flex-col items-center"
          >
            <div className="relative w-full bg-foreground/5 rounded-lg overflow-hidden border border-foreground/10 hover:border-accent/50 transition-all hover:shadow-lg inline-block">
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                className="object-contain w-full h-auto"
                priority={idx === 0}
                unoptimized
              />
            </div>
            {image.caption && (
              <p className="text-sm text-foreground/70 text-center mt-2 group-hover:text-foreground transition-colors">
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Explanation */}
      {slide.content?.highlight && (
        <div className="w-full max-w-7xl mt-4">
          <p className="text-lg text-foreground/80 text-center italic border-t border-foreground/10 pt-4">
            {slide.content.highlight}
          </p>
        </div>
      )}
    </div>
  )
}

