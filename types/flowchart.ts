export type NodeType = "input" | "process" | "decision" | "output" | "data";

export interface FlowchartNode {
  id: string;
  type: NodeType;
  label: string;
  row: number; // Row number (0-based, top to bottom) for storyboard grid layout
  // Position is computed by layout engine, not stored in JSON
  position?: { x: number; y: number };
  style?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: "straight" | "smooth" | "step";
}

export interface FlowchartData {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  layout?: "vertical" | "horizontal" | "serpentine"; // Layout hint (serpentine is default)
  dimensions?: { width: number; height: number }; // Computed, not required in JSON
}
