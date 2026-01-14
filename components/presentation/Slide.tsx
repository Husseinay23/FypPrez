'use client'

import { Slide as SlideType } from '@/types/slide'
import { getSlideSection, SECTION_COLORS } from '@/lib/section-utils'
import TitleSlide from '../slides/TitleSlide'
import ContentSlide from '../slides/ContentSlide'
import ImageSlide from '../slides/ImageSlide'
import FlowchartSlide from '../slides/FlowchartSlide'
import TableSlide from '../slides/TableSlide'
import ComparisonSlide from '../slides/ComparisonSlide'
import ModelResultsSlide from '../slides/ModelResultsSlide'
import ResultsSummarySlide from '../slides/ResultsSummarySlide'

interface SlideProps {
  slide: SlideType
}

export default function Slide({ slide }: SlideProps) {
  const section = getSlideSection(slide)
  const sectionColor = SECTION_COLORS[section]
  
  const slideClasses = "w-full h-full flex flex-col items-center justify-center p-16 relative"
  const sectionStyle = {
    background: sectionColor.gradient,
  }

  // Add accent bar at top
  const accentBarStyle = {
    backgroundColor: sectionColor.accent,
  }

  switch (slide.type) {
    case 'title':
      return <TitleSlide slide={slide} className={slideClasses} sectionStyle={sectionStyle} />
    case 'content':
      return <ContentSlide slide={slide} className={slideClasses} sectionStyle={sectionStyle} accentBarStyle={accentBarStyle} />
    case 'image':
      return <ImageSlide slide={slide} className={slideClasses} sectionStyle={sectionStyle} accentBarStyle={accentBarStyle} />
    case 'flowchart':
      return <FlowchartSlide slide={slide} className={slideClasses} sectionStyle={sectionStyle} accentBarStyle={accentBarStyle} />
    case 'table':
      return <TableSlide slide={slide} className={slideClasses} sectionStyle={sectionStyle} accentBarStyle={accentBarStyle} />
    case 'comparison':
      return <ComparisonSlide slide={slide} className={slideClasses} sectionStyle={sectionStyle} accentBarStyle={accentBarStyle} />
    case 'model-results':
      return <ModelResultsSlide slide={slide} className={slideClasses} sectionStyle={sectionStyle} accentBarStyle={accentBarStyle} />
    case 'results-summary':
      return <ResultsSummarySlide slide={slide} className={slideClasses} sectionStyle={sectionStyle} accentBarStyle={accentBarStyle} />
    default:
      return <div className={slideClasses}>Unknown slide type</div>
  }
}

