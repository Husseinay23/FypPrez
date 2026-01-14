import SlideDeck from '@/components/presentation/SlideDeck'
import slidesData from '@/data/slides.json'
import { Slide } from '@/types/slide'

// Ensure slides are sorted by order
const slides: Slide[] = (slidesData as Slide[]).sort((a, b) => a.order - b.order)

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden">
      <SlideDeck slides={slides} />
    </main>
  )
}

