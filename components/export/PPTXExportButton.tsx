"use client";

import { useState } from "react";
import { useSlideContext } from "@/lib/slide-context";
import { exportToPPTX } from "@/lib/pptx-export";
import { FlowchartData } from "@/types/flowchart";

export default function PPTXExportButton() {
  const { slides } = useSlideContext();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Load all flowchart data
      const flowcharts = new Map<string, FlowchartData>();

      for (const slide of slides) {
        if (slide.type === "flowchart" && slide.flowchart) {
          try {
            const flowchartModule = await import(
              `@/data/flowcharts/${slide.flowchart}.json`
            );
            flowcharts.set(
              slide.flowchart,
              flowchartModule.default as FlowchartData
            );
          } catch (err) {
            console.error(`Failed to load flowchart ${slide.flowchart}:`, err);
          }
        }
      }

      await exportToPPTX(slides, flowcharts);
    } catch (error) {
      console.error("PPTX export failed:", error);
      alert("Failed to export PPTX. Please check the console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="fixed bottom-8 right-8 z-50
                 px-6 py-3 bg-accent/20 hover:bg-accent/30 
                 text-foreground rounded-lg
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-accent
                 text-sm font-medium"
      aria-label="Export to PowerPoint"
    >
      {isExporting ? "Exporting..." : "Export PPTX"}
    </button>
  );
}
