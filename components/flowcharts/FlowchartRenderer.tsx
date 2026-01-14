'use client'

import { FlowchartData } from '@/types/flowchart'
import { useMemo } from 'react'
import { computeDagreLayout, getLayoutDimensions } from '@/lib/flowchart-layout'
import { NodeType } from '@/types/flowchart'

interface FlowchartRendererProps {
  data: FlowchartData
}

// Node type styling
const nodeStyles: Record<NodeType, {
  fill: string
  stroke: string
  shape: 'rect' | 'roundRect' | 'diamond'
}> = {
  input: {
    fill: '#3b82f6',
    stroke: '#60a5fa',
    shape: 'roundRect',
  },
  output: {
    fill: '#10b981',
    stroke: '#34d399',
    shape: 'roundRect',
  },
  process: {
    fill: '#6366f1',
    stroke: '#818cf8',
    shape: 'rect',
  },
  decision: {
    fill: '#f59e0b',
    stroke: '#fbbf24',
    shape: 'diamond',
  },
  data: {
    fill: '#8b5cf6',
    stroke: '#a78bfa',
    shape: 'rect',
  },
}

// Node dimensions (must match layout.ts)
const NODE_WIDTH = 220
const NODE_HEIGHT = 70
const NODE_RX = 12 // Border radius for rounded rects

// Fixed SVG dimensions (storyboard grid)
const SVG_WIDTH = 1200
const SVG_HEIGHT = 650

export default function FlowchartRenderer({ data }: FlowchartRendererProps) {
  // Compute layout ONCE - deterministic row-based grid
  const positionedNodes = useMemo(() => {
    return computeDagreLayout(data.nodes, data.edges)
  }, [data.nodes, data.edges])

  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="border border-foreground/10 rounded-lg bg-background/50 w-full h-full max-w-[1200px] max-h-[650px]"
      >
        {/* Define arrow marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="#60a5fa"
            />
          </marker>
        </defs>

        {/* Render edges first (so they appear behind nodes) */}
        {data.edges.map((edge) => {
          const sourceNode = positionedNodes.find(n => n.id === edge.source)
          const targetNode = positionedNodes.find(n => n.id === edge.target)
          
          if (!sourceNode || !targetNode) return null

          // Calculate edge start/end points (center of nodes)
          const sourceX = sourceNode.position.x + NODE_WIDTH / 2
          const sourceY = sourceNode.position.y + NODE_HEIGHT / 2
          const targetX = targetNode.position.x + NODE_WIDTH / 2
          const targetY = targetNode.position.y + NODE_HEIGHT / 2

          // Determine if same row (horizontal) or different row (vertical)
          const sameRow = sourceNode.row === targetNode.row
          
          let pathD: string
          if (sameRow) {
            // Horizontal arrow within row: right edge of source to left edge of target
            pathD = `M ${sourceX + NODE_WIDTH / 2} ${sourceY} L ${targetX - NODE_WIDTH / 2} ${targetY}`
          } else {
            // Vertical arrow between rows: down from source center, horizontal, then down to target center
            const midY = sourceY + 40 // Small offset down from source
            const horizontalY = targetY - 40 // Small offset up from target
            pathD = `M ${sourceX} ${sourceY + NODE_HEIGHT / 2} L ${sourceX} ${midY} L ${targetX} ${horizontalY} L ${targetX} ${targetY - NODE_HEIGHT / 2}`
          }

          return (
            <path
              key={edge.id}
              d={pathD}
              stroke="#60a5fa"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="hover:stroke-accent transition-colors"
            />
          )
        })}

        {/* Render nodes */}
        {positionedNodes.map((node) => {
          const style = nodeStyles[node.type]
          const x = node.position.x
          const y = node.position.y
          const width = NODE_WIDTH
          const height = NODE_HEIGHT
          const rx = NODE_RX

          let shapeElement: JSX.Element

          if (style.shape === 'diamond') {
            // Diamond shape
            const points = [
              `${x + width / 2},${y}`,
              `${x + width},${y + height / 2}`,
              `${x + width / 2},${y + height}`,
              `${x},${y + height / 2}`,
            ].join(' ')

            shapeElement = (
              <polygon
                points={points}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth="3"
                className="hover:opacity-80 transition-opacity"
              />
            )
          } else if (style.shape === 'roundRect') {
            // Rounded rectangle
            shapeElement = (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={rx}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth="3"
                className="hover:opacity-80 transition-opacity"
              />
            )
          } else {
            // Regular rectangle
            shapeElement = (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth="3"
                className="hover:opacity-80 transition-opacity"
              />
            )
          }

          return (
            <g key={node.id}>
              {shapeElement}
              <text
                x={x + width / 2}
                y={y + height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="14"
                fontWeight="600"
                className="pointer-events-none select-none"
              >
                {node.label.split('\n').map((line, i) => (
                  <tspan key={i} x={x + width / 2} dy={i === 0 ? 0 : 16}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
