'use client'

import { Slide } from '@/types/slide'

interface ResultsSummarySlideProps {
  slide: Slide
  className?: string
  sectionStyle?: React.CSSProperties
  accentBarStyle?: React.CSSProperties
}

export default function ResultsSummarySlide({ slide, className, sectionStyle, accentBarStyle }: ResultsSummarySlideProps) {
  if (!slide.table) return null

  return (
    <div className={className} style={sectionStyle}>
      {/* Accent Bar */}
      {accentBarStyle && (
        <div className="absolute top-0 left-0 right-0 h-1" style={accentBarStyle} />
      )}

      {slide.title && (
        <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
          {slide.title}
        </h2>
      )}

      <div className="max-w-6xl w-full">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2" style={{ borderColor: accentBarStyle?.backgroundColor || '#60a5fa' }}>
                {slide.table.headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-8 py-4 text-left text-xl font-bold text-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slide.table.rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`border-b border-foreground/10 hover:bg-foreground/5 transition-colors ${
                    rowIdx === slide.table?.highlightRow
                      ? 'bg-accent/20'
                      : ''
                  }`}
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className={`px-8 py-4 text-lg ${
                        cellIdx === 0 ? 'font-semibold' : ''
                      } text-foreground/90`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {slide.content?.highlight && (
          <div className="mt-8 p-6 bg-accent/10 border-l-4 border-accent rounded hover:bg-accent/15 transition-colors">
            <p className="text-xl text-foreground font-semibold">
              {slide.content.highlight}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

