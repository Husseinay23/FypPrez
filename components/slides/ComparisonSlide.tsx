'use client'

import { Slide } from '@/types/slide'

interface ComparisonSlideProps {
  slide: Slide
  className?: string
  sectionStyle?: React.CSSProperties
  accentBarStyle?: React.CSSProperties
}

export default function ComparisonSlide({ slide, className, sectionStyle, accentBarStyle }: ComparisonSlideProps) {
  return (
    <div className={className} style={sectionStyle}>
      {/* Accent Bar */}
      {accentBarStyle && (
        <div className="absolute top-0 left-0 right-0 h-1" style={accentBarStyle} />
      )}

      {slide.title && (
        <h2 className="text-4xl font-bold text-foreground mb-12 text-center relative z-10">
          {slide.title}
        </h2>
      )}
      
      <div className="max-w-6xl w-full relative z-10">
        {slide.content?.paragraphs && slide.content.paragraphs.map((para, idx) => (
          <p key={idx} className="text-xl text-foreground/90 leading-relaxed mb-6 hover:text-foreground transition-colors">
            {para}
          </p>
        ))}
        
        {slide.content?.bulletPoints && slide.content.bulletPoints.length > 0 && (
          <ul className="list-disc list-inside space-y-3 text-xl text-foreground/90 ml-4">
            {slide.content.bulletPoints.map((point, idx) => (
              <li key={idx} className="hover:text-foreground transition-colors">{point}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

