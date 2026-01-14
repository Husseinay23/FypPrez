'use client'

import { Slide } from '@/types/slide'
import Image from 'next/image'

interface TitleSlideProps {
  slide: Slide
  className?: string
  sectionStyle?: React.CSSProperties
}

export default function TitleSlide({ slide, className, sectionStyle }: TitleSlideProps) {
  return (
    <div className={className} style={sectionStyle}>
      {/* Logo - Top Left */}
      <div className="absolute top-8 left-8 z-10">
        <Image
          src="/images/uni-logo.png"
          alt="University Logo"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      {/* University Info */}
      <div className="text-center mb-8 relative z-10">
        <div className="text-2xl font-semibold text-foreground mb-2">
          Phoenicia University
        </div>
        <div className="text-xl text-foreground/80 mb-1">
          College of Arts and Sciences
        </div>
        <div className="text-xl text-foreground/80">
          Department of Computer Science
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-6 relative z-10">
        <h1 className="text-5xl font-bold text-foreground mb-4 leading-tight">
          Fine-Grained Arabic Dialect Identification (ADI)
        </h1>
        <h2 className="text-3xl font-semibold text-foreground/90 mb-3">
          Using Deep Learning for Dialect-Aware Speech Technologies
        </h2>
        <p className="text-xl text-foreground/70 italic">
          (Arabic Dialect Identification using the ADC Corpus)
        </p>
      </div>

      {/* Subtitle */}
      <div className="text-center mb-12 relative z-10">
        <p className="text-2xl text-foreground/80 font-medium">
          Final Year Project – Final Report
        </p>
      </div>

      {/* Supervisors and Student */}
      <div className="text-center space-y-4 relative z-10">
        <div>
          <p className="text-lg text-foreground/70 mb-2">Supervisors:</p>
          <p className="text-xl text-foreground">Dr. Mageda Sharfeddine & Dr. Abbas Rammal</p>
        </div>
        <div className="mt-8">
          <p className="text-lg text-foreground/70 mb-2">Student:</p>
          <p className="text-xl text-foreground font-semibold">Hussein Ayoub – 202102181</p>
        </div>
      </div>
    </div>
  )
}

