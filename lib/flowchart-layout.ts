import { FlowchartNode, FlowchartEdge } from "@/types/flowchart";

// Note: Dagre is no longer used - we use deterministic row-based grid layout

// Fixed SVG dimensions
const SVG_WIDTH = 1200;
const SVG_HEIGHT = 650;

// Node dimensions
const NODE_WIDTH = 220;
const NODE_HEIGHT = 70;

// Layout constants
const TOP_MARGIN = 80;
const BOTTOM_MARGIN = 50;
const NODE_HORIZONTAL_GAP = 40; // Gap between nodes in the same row

interface PositionedNode extends FlowchartNode {
  position: { x: number; y: number };
}

/**
 * Computes flowchart layout using row-based storyboard grid
 * No auto-layout engines - pure deterministic positioning
 */
export function computeDagreLayout(
  nodes: FlowchartNode[],
  edges: FlowchartEdge[]
): PositionedNode[] {
  // Group nodes by row
  const nodesByRow = new Map<number, FlowchartNode[]>();
  nodes.forEach((node) => {
    if (!nodesByRow.has(node.row)) {
      nodesByRow.set(node.row, []);
    }
    nodesByRow.get(node.row)!.push(node);
  });

  // Get sorted row indices
  const rowIndices = Array.from(nodesByRow.keys()).sort((a, b) => a - b);
  const maxRow = Math.max(...rowIndices);

  // Calculate dynamic row gap to fit all rows within SVG height
  // Ensure minimum gap of 100px for readability
  const availableHeight = SVG_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN;
  const minRowGap = 100;
  const calculatedGap = maxRow > 0 ? availableHeight / maxRow : minRowGap;
  const ROW_GAP = Math.max(calculatedGap, minRowGap);

  const positionedNodes: PositionedNode[] = [];

  // Process each row
  rowIndices.forEach((rowIndex) => {
    const rowNodes = nodesByRow.get(rowIndex)!;
    const nodeCount = rowNodes.length;

    // Calculate X positions: center the row, evenly distribute nodes
    const totalWidth =
      nodeCount * NODE_WIDTH + (nodeCount - 1) * NODE_HORIZONTAL_GAP;
    const startX = (SVG_WIDTH - totalWidth) / 2;

    // Calculate Y position for this row
    const y = TOP_MARGIN + rowIndex * ROW_GAP;

    // Assign positions to each node in the row
    rowNodes.forEach((node, index) => {
      const x = startX + index * (NODE_WIDTH + NODE_HORIZONTAL_GAP);
      positionedNodes.push({
        ...node,
        position: {
          x: x - NODE_WIDTH / 2, // Center the node on its position
          y: y - NODE_HEIGHT / 2,
        },
      });
    });
  });

  return positionedNodes;
}

/**
 * Get layout dimensions (fixed for storyboard grid)
 */
export function getLayoutDimensions(positionedNodes: PositionedNode[]): {
  width: number;
  height: number;
} {
  // Fixed dimensions for storyboard layout
  return {
    width: SVG_WIDTH,
    height: SVG_HEIGHT,
  };
}
