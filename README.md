# Arabic Dialect Identification - Presentation Website

A Next.js-based presentation website for the Final Year Project on "Fine-Grained Arabic Dialect Identification Using Deep Learning".

## Features

- **PowerPoint-like Navigation**: One slide at a time, arrow key navigation
- **Dual Output**: Web presentation + downloadable PPTX file
- **Data-Driven Flowcharts**: Deterministic, read-only React Flow diagrams
- **Offline-Safe**: Fully static export, works without server
- **Dark Theme**: Modern academic keynote style

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your PNG images to `/public/images/`:
   - `accuracy-curves.png`
   - `confusion-matrix.png`
   - (other images as needed)

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Export static site:
```bash
npm run export
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main presentation page
│   └── globals.css        # Global styles
├── components/
│   ├── presentation/       # Slide deck components
│   ├── slides/           # Individual slide types
│   ├── flowcharts/       # Flowchart rendering
│   └── export/           # PPTX export button
├── data/
│   ├── slides.json       # All 19 slides (source of truth)
│   └── flowcharts/       # Flowchart definitions
├── lib/
│   ├── slide-context.tsx # Slide state management
│   └── pptx-export.ts    # PPTX generation
└── types/                # TypeScript definitions
```

## Navigation

- **Arrow Keys**: Navigate between slides
- **Page Up/Down**: Navigate between slides
- **Home/End**: Jump to first/last slide
- **On-Screen Buttons**: Previous/Next buttons
- **PPTX Export**: Button in bottom-right corner

## Customization

Edit `/data/slides.json` to modify slide content. Flowcharts are defined in `/data/flowcharts/*.json`.

## Notes

- PPTX export requires images to be properly loaded (currently uses placeholders for images)
- Flowcharts use deterministic positioning from JSON data
- All transitions respect `prefers-reduced-motion`

# FypPrez
