declare module "dagre" {
  namespace graphlib {
    class Graph {
      setDefaultEdgeLabel(cb: () => any): void;
      setGraph(options: {
        rankdir?: "TB" | "BT" | "LR" | "RL";
        nodesep?: number;
        ranksep?: number;
        marginx?: number;
        marginy?: number;
      }): void;
      setNode(id: string, node: { width: number; height: number; label?: string }): void;
      setEdge(source: string, target: string): void;
      node(id: string): { x: number; y: number; width: number; height: number };
    }
  }

  export function layout(g: graphlib.Graph): void;
  export { graphlib };
}

