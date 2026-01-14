'use client'

import { Slide } from '@/types/slide'
import FlowchartRenderer from '../flowcharts/FlowchartRenderer'
import { useState, useEffect } from 'react'

interface FlowchartSlideProps {
  slide: Slide
  className?: string
  sectionStyle?: React.CSSProperties
  accentBarStyle?: React.CSSProperties
}

export default function FlowchartSlide({ slide, className, sectionStyle, accentBarStyle }: FlowchartSlideProps) {
  const [flowchartData, setFlowchartData] = useState<any>(null)

  useEffect(() => {
    if (slide.flowchart) {
      import(`@/data/flowcharts/${slide.flowchart}.json`)
        .then((data) => setFlowchartData(data.default))
        .catch((err) => console.error('Failed to load flowchart:', err))
    }
  }, [slide.flowchart])

  if (!slide.flowchart || !flowchartData) {
    return (
      <div className={className} style={sectionStyle}>
        <p className="text-foreground/70">Loading flowchart...</p>
      </div>
    )
  }

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
      
      <div className="flex-1 w-full flex items-center justify-center relative z-10 overflow-hidden">
        <div className="w-full max-w-[1200px] flex items-center justify-center">
          <FlowchartRenderer data={flowchartData} />
        </div>
      </div>
    </div>
  )
}

