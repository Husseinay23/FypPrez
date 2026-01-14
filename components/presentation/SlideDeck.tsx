"use client";

import { Slide } from "@/types/slide";
import { SlideProvider, useSlideContext } from "@/lib/slide-context";
import SlideComponent from "./Slide";
import Navigation from "./Navigation";
import SlideIndicator from "./SlideIndicator";
import PPTXExportButton from "@/components/export/PPTXExportButton";
import { getSlideSection, SECTION_COLORS } from "@/lib/section-utils";

interface SlideDeckProps {
  slides: Slide[];
}

function SlideDeckInner() {
  const { slides, currentSlideIndex, isTransitioning, direction } =
    useSlideContext();
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Slide Container - Carousel */}
      <div className="relative w-full h-full">
        {slides.map((slide: Slide, index: number) => (
          <div
            key={slide.id}
            className="absolute inset-0 w-full h-full"
            style={{
              transform: `translateY(${(index - currentSlideIndex) * 100}%)`,
              transition: prefersReducedMotion
                ? "none"
                : isTransitioning
                ? "transform 0.35s ease-in-out, opacity 0.35s ease-in-out"
                : "transform 0.35s ease-in-out, opacity 0.35s ease-in-out",
              opacity: index === currentSlideIndex ? 1 : 0,
              pointerEvents: index === currentSlideIndex ? "auto" : "none",
            }}
          >
            <SlideComponent slide={slide} />
          </div>
        ))}
      </div>

      {/* Navigation */}
      {/* <Navigation /> */}

      {/* Slide Indicator */}
      <SlideIndicator />

      {/* PPTX Export Button */}
      {/* <PPTXExportButton /> */}
    </div>
  );
}

export default function SlideDeck({ slides }: SlideDeckProps) {
  return (
    <SlideProvider slides={slides}>
      <SlideDeckInner />
    </SlideProvider>
  );
}
