import PptxGenJS, { SHAPE_NAME } from "pptxgenjs";
import { Slide } from "@/types/slide";
import { FlowchartData } from "@/types/flowchart";
import { computeDagreLayout, getLayoutDimensions } from "@/lib/flowchart-layout";
import { getSlideSection, SECTION_COLORS } from "@/lib/section-utils";

// PPTX slide dimensions (16:9 aspect ratio)
const SLIDE_WIDTH = 10; // inches
const SLIDE_HEIGHT = 5.625; // inches

// Coordinate conversion: pixels to PPTX EMU (1 inch = 914400 EMU)
function pxToInches(px: number, dpi: number = 96): number {
  return px / dpi;
}

function inchesToEMU(inches: number): number {
  return inches * 914400;
}

// Convert flowchart node position to PPTX coordinates
function flowchartNodeToPPTX(
  node: { position: { x: number; y: number } },
  flowchartWidth: number,
  flowchartHeight: number
) {
  // Assume flowchart is rendered at a certain pixel size, convert to inches
  const scaleX = SLIDE_WIDTH / (flowchartWidth / 96); // Assuming 96 DPI
  const scaleY = SLIDE_HEIGHT / (flowchartHeight / 96);

  const xInches = (node.position.x / 96) * scaleX;
  const yInches = (node.position.y / 96) * scaleY;

  return {
    x: inchesToEMU(xInches),
    y: inchesToEMU(yInches),
  };
}

// Node shape mapping for PPTX
function getNodeShape(nodeType: string): SHAPE_NAME {
  switch (nodeType) {
    case "input":
    case "output":
      return "roundRect" as SHAPE_NAME;
    case "decision":
      return "diamond" as SHAPE_NAME;
    default:
      return "rect" as SHAPE_NAME;
  }
}

// Node color mapping
function getNodeColor(nodeType: string): string {
  switch (nodeType) {
    case "input":
      return "3b82f6";
    case "output":
      return "10b981";
    case "process":
      return "6366f1";
    case "decision":
      return "f59e0b";
    case "data":
      return "8b5cf6";
    default:
      return "6366f1";
  }
}

// Convert image URL to base64 for PPTX
async function imageToBase64(imagePath: string): Promise<string | null> {
  try {
    // For Next.js public folder, images are served from root
    const fullPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    const response = await fetch(fullPath);
    if (!response.ok) {
      console.warn(`Failed to load image: ${fullPath}`);
      return null;
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix if present
        const base64 = base64String.includes(',') 
          ? base64String.split(',')[1] 
          : base64String;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Error converting image to base64: ${imagePath}`, error);
    return null;
  }
}

export async function exportToPPTX(
  slides: Slide[],
  flowcharts: Map<string, FlowchartData>
): Promise<void> {
  const pptx = new PptxGenJS();

  // Set slide dimensions (16:9)
  pptx.layout = "LAYOUT_WIDE";
  pptx.defineLayout({
    name: "CUSTOM",
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
  });
  pptx.layout = "CUSTOM";

  // Set default font
  pptx.defineSlideMaster({
    title: "MASTER_SLIDE",
    background: { color: "0a0a0a" }, // Dark background
  });

  for (const slide of slides) {
    const pptxSlide = pptx.addSlide();

    // Get section for this slide
    const section = getSlideSection(slide);
    const sectionColor = SECTION_COLORS[section];

    // Convert gradient to solid color for PPTX (use accent color with transparency)
    // Extract RGB from hex color
    const accentHex = sectionColor.accent.replace('#', '');
    const r = parseInt(accentHex.substring(0, 2), 16);
    const g = parseInt(accentHex.substring(2, 4), 16);
    const b = parseInt(accentHex.substring(4, 6), 16);
    
    // Create a dark background with section accent tint
    const bgColor = `0a0a0a`; // Keep dark base
    pptxSlide.background = { color: bgColor };

    // Add accent bar at top (like web version)
    pptxSlide.addShape("rect" as SHAPE_NAME, {
      x: 0,
      y: 0,
      w: SLIDE_WIDTH,
      h: 0.05,
      fill: { color: accentHex },
      line: { type: "none" },
    });

    // Handle different slide types
    switch (slide.type) {
      case "title":
        // University logo (if exists)
        const logoBase64 = await imageToBase64("/images/uni-logo.png");
        if (logoBase64) {
          pptxSlide.addImage({
            data: logoBase64,
            x: 0.5,
            y: 0.3,
            w: 1.0,
            h: 1.0,
          });
        }
        
        // University info
        pptxSlide.addText("Phoenicia University", {
          x: logoBase64 ? 1.6 : 0.5,
          y: 0.3,
          w: logoBase64 ? 8 : 9,
          h: 0.3,
          fontSize: 20,
          fontFace: "Arial",
          color: "f5f5f5",
          align: logoBase64 ? "left" : "center",
          bold: true,
        });
        pptxSlide.addText("College of Arts and Sciences\nDepartment of Computer Science", {
          x: 0.5,
          y: 1.1,
          w: 9,
          h: 0.4,
          fontSize: 16,
          fontFace: "Arial",
          color: "f5f5f5",
          align: "center",
        });

        // Main title
        if (slide.title) {
          pptxSlide.addText(slide.title, {
            x: 0.5,
            y: 1.8,
            w: 9,
            h: 0.5,
            fontSize: 28,
            fontFace: "Arial",
            color: "f5f5f5",
            align: "center",
            bold: true,
          });
        }
        pptxSlide.addText("Using Deep Learning for Dialect-Aware Speech Technologies\n(Arabic Dialect Identification using the ADC Corpus)", {
          x: 0.5,
          y: 2.4,
          w: 9,
          h: 0.5,
          fontSize: 18,
          fontFace: "Arial",
          color: "f5f5f5",
          align: "center",
        });

        // Subtitle
        pptxSlide.addText("Final Year Project – Final Report", {
          x: 0.5,
          y: 3.2,
          w: 9,
          h: 0.3,
          fontSize: 20,
          fontFace: "Arial",
          color: "f5f5f5",
          align: "center",
        });

        // Supervisors and Student
        pptxSlide.addText("Supervisors:\nDr. Mageda Sharfeddine & Dr. Abbas Rammal", {
          x: 0.5,
          y: 3.8,
          w: 9,
          h: 0.4,
          fontSize: 16,
          fontFace: "Arial",
          color: "f5f5f5",
          align: "center",
        });
        pptxSlide.addText("Student:\nHussein Ayoub – 202102181", {
          x: 0.5,
          y: 4.5,
          w: 9,
          h: 0.4,
          fontSize: 16,
          fontFace: "Arial",
          color: "f5f5f5",
          align: "center",
          bold: true,
        });
        break;

      case "content":
        // Add title if present (for content slides)
        if (slide.title) {
          pptxSlide.addText(slide.title, {
            x: 0.5,
            y: 0.7,
            w: 9,
            h: 0.8,
            fontSize: 36,
            fontFace: "Arial",
            color: "f5f5f5",
            bold: true,
            align: "center",
          });
        }
        let yPos = slide.title ? 1.8 : 0.5;

        if (slide.content?.paragraphs) {
          for (const para of slide.content.paragraphs) {
            pptxSlide.addText(para, {
              x: 0.5,
              y: yPos,
              w: 9,
              h: 0.5,
              fontSize: 18,
              fontFace: "Arial",
              color: "f5f5f5",
            });
            yPos += 0.6;
          }
        }

        if (slide.content?.bulletPoints) {
          const bulletText = slide.content.bulletPoints
            .map((p) => `• ${p}`)
            .join("\n");
          pptxSlide.addText(bulletText, {
            x: 0.8,
            y: yPos,
            w: 8.5,
            h: slide.content.bulletPoints.length * 0.4,
            fontSize: 18,
            fontFace: "Arial",
            color: "f5f5f5",
          });
        }

        if (slide.content?.highlight) {
          pptxSlide.addShape("rect" as SHAPE_NAME, {
            x: 0.5,
            y: 4.5,
            w: 9,
            h: 0.6,
            fill: { color: "60a5fa", transparency: 90 },
            line: { color: "60a5fa", width: 2 },
          });
          pptxSlide.addText(slide.content.highlight, {
            x: 0.7,
            y: 4.6,
            w: 8.6,
            h: 0.4,
            fontSize: 18,
            fontFace: "Arial",
            color: "f5f5f5",
            bold: true,
          });
        }
        break;

      case "image":
        if (slide.image) {
          const imageBase64 = await imageToBase64(slide.image.src);
          if (imageBase64) {
            pptxSlide.addImage({
              data: imageBase64,
              x: 0.5,
              y: slide.title ? 1.5 : 0.8,
              w: 9,
              h: 3.5,
            });
          } else {
            // Fallback placeholder
            pptxSlide.addText(`[Image: ${slide.image.alt}]`, {
              x: 0.5,
              y: 2.5,
              w: 9,
              h: 2,
              fontSize: 16,
              fontFace: "Arial",
              color: "60a5fa",
              align: "center",
              italic: true,
            });
          }

          if (slide.image.caption) {
            pptxSlide.addText(slide.image.caption, {
              x: 0.5,
              y: 4.8,
              w: 9,
              h: 0.3,
              fontSize: 14,
              fontFace: "Arial",
              color: "999999",
              align: "center",
            });
          }
        }
        break;

      case "table":
      case "results-summary":
        if (slide.table) {
          const tableData: any = [
            slide.table.headers,
            ...slide.table.rows.map((row) => row.map((cell) => String(cell))),
          ];

          pptxSlide.addTable(tableData, {
            x: 0.5,
            y: slide.title ? 2 : 1,
            w: 9,
            h: Math.min((slide.table.rows.length + 1) * 0.35, 3.5),
            fontSize: 12,
            fontFace: "Arial",
            color: "f5f5f5",
            border: { type: "solid", color: "60a5fa", pt: 1 },
            fill: { color: "1a1a1a" },
            align: "left",
          });

          if (slide.content?.highlight) {
            pptxSlide.addText(slide.content.highlight, {
              x: 0.5,
              y: 4.8,
              w: 9,
              h: 0.4,
              fontSize: 14,
              fontFace: "Arial",
              color: "60a5fa",
              align: "center",
              italic: true,
            });
          }
        }
        break;

      case "flowchart":
        if (slide.flowchart && flowcharts.has(slide.flowchart)) {
          const flowchart = flowcharts.get(slide.flowchart)!;
          
          // Compute layout using row-based grid (deterministic)
          const positionedNodes = computeDagreLayout(flowchart.nodes, flowchart.edges);
          const layoutDimensions = getLayoutDimensions(positionedNodes);

          // Render nodes as shapes
          for (const positionedNode of positionedNodes) {
            const pos = flowchartNodeToPPTX(
              positionedNode,
              layoutDimensions.width,
              layoutDimensions.height
            );
            const shapeType = getNodeShape(positionedNode.type);
            const color = getNodeColor(positionedNode.type);

            // Convert EMU back to inches for PPTX API
            const xInches = pos.x / 914400;
            const yInches = pos.y / 914400;

            // Get stroke color based on node type (match web version)
            const strokeColors: Record<string, string> = {
              input: "60a5fa",
              output: "34d399",
              process: "818cf8",
              decision: "fbbf24",
              data: "a78bfa",
            };
            const strokeColor = strokeColors[positionedNode.type] || "60a5fa";

            pptxSlide.addShape(shapeType, {
              x: xInches,
              y: yInches,
              w: 1.2,
              h: 0.6,
              fill: { color },
              line: { color: strokeColor, width: 2 },
            });

            pptxSlide.addText(positionedNode.label, {
              x: xInches + 0.1,
              y: yInches + 0.15,
              w: 1,
              h: 0.3,
              fontSize: 12,
              fontFace: "Arial",
              color: "ffffff",
              align: "center",
              valign: "middle",
            });
          }

          // Render edges as connectors
          for (const edge of flowchart.edges) {
            const sourceNode = positionedNodes.find(
              (n) => n.id === edge.source
            )!;
            const targetNode = positionedNodes.find(
              (n) => n.id === edge.target
            )!;

            const sourcePos = flowchartNodeToPPTX(
              sourceNode,
              layoutDimensions.width,
              layoutDimensions.height
            );
            const targetPos = flowchartNodeToPPTX(
              targetNode,
              layoutDimensions.width,
              layoutDimensions.height
            );

            // Convert to inches
            const sx = sourcePos.x / 914400;
            const sy = sourcePos.y / 914400;
            const tx = targetPos.x / 914400;
            const ty = targetPos.y / 914400;

            // Add connector line (use section accent color)
            pptxSlide.addShape("line" as SHAPE_NAME, {
              x: sx + 0.6,
              y: sy + 0.3,
              w: tx - sx,
              h: ty - sy,
              line: { color: accentHex, width: 2 },
            });
          }
        }
        break;

      case "model-results":
        // Model results slide with metrics and images
        let metricsY = slide.title ? 1.8 : 0.5;
        
        // Add metrics
        if (slide.metrics) {
          const metricsText = Object.entries(slide.metrics)
            .map(([key, value]) => `${key}: ${value}`)
            .join("  |  ");
          pptxSlide.addText(metricsText, {
            x: 0.5,
            y: metricsY,
            w: 9,
            h: 0.4,
            fontSize: 12,
            fontFace: "Arial",
            color: "f5f5f5",
            align: "center",
          });
          metricsY += 0.5;
        }

        // Add images (3 images in a row)
        if (slide.images && slide.images.length >= 3) {
          const imageWidth = 2.8;
          const imageHeight = 2.0;
          const startX = 0.5;
          const imageY = metricsY + 0.2;

          for (let idx = 0; idx < 3; idx++) {
            const image = slide.images[idx];
            const imageX = startX + idx * (imageWidth + 0.2);
            const imageBase64 = await imageToBase64(image.src);
            
            if (imageBase64) {
              pptxSlide.addImage({
                data: imageBase64,
                x: imageX,
                y: imageY,
                w: imageWidth,
                h: imageHeight,
              });
              
              // Add caption below image
              if (image.caption) {
                pptxSlide.addText(image.caption, {
                  x: imageX,
                  y: imageY + imageHeight + 0.1,
                  w: imageWidth,
                  h: 0.2,
                  fontSize: 10,
                  fontFace: "Arial",
                  color: "999999",
                  align: "center",
                });
              }
            } else {
              // Fallback placeholder
              pptxSlide.addText(`[${image.caption || 'Image'}]`, {
                x: imageX,
                y: imageY,
                w: imageWidth,
                h: imageHeight,
                fontSize: 10,
                fontFace: "Arial",
                color: "60a5fa",
                align: "center",
                valign: "middle",
                italic: true,
              });
            }
          }
        }

        // Add bottom explanation
        if (slide.content?.highlight) {
          pptxSlide.addText(slide.content.highlight, {
            x: 0.5,
            y: 4.8,
            w: 9,
            h: 0.3,
            fontSize: 12,
            fontFace: "Arial",
            color: "999999",
            align: "center",
            italic: true,
          });
        }
        break;

      case "comparison":
        // Similar to content slide
        if (slide.content) {
          let yPos = slide.title ? 1.8 : 0.5;

          if (slide.content.paragraphs) {
            for (const para of slide.content.paragraphs) {
              pptxSlide.addText(para, {
                x: 0.5,
                y: yPos,
                w: 9,
                h: 0.5,
                fontSize: 18,
                fontFace: "Arial",
                color: "f5f5f5",
              });
              yPos += 0.6;
            }
          }
        }
        break;
    }
  }

  // Generate and download
  await pptx.writeFile({ fileName: "arabic-dialect-presentation.pptx" });
}
