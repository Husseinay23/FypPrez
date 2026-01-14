'use client'

import { Slide } from '@/types/slide'

interface TableSlideProps {
  slide: Slide
  className?: string
  sectionStyle?: React.CSSProperties
  accentBarStyle?: React.CSSProperties
}

export default function TableSlide({ slide, className, sectionStyle, accentBarStyle }: TableSlideProps) {
  if (!slide.table) return null

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
      
      <div className="max-w-5xl w-full overflow-x-auto relative z-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2" style={{ borderColor: accentBarStyle?.backgroundColor || '#60a5fa' }}>
              {slide.table.headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-left text-xl font-bold text-foreground"
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
                className={`border-b border-foreground/10 transition-colors ${
                  rowIdx === slide.table?.highlightRow
                    ? 'bg-accent/20'
                    : 'hover:bg-foreground/5'
                }`}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-6 py-4 text-lg text-foreground/90"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

