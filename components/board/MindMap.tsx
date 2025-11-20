"use client"

import { useState, useCallback } from "react"
import { Circle, Line, Text, Group } from "react-konva"
import { Brain, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MindMapNode {
  id: string
  x: number
  y: number
  label: string
  color: string
  parentId?: string
  children: string[]
}

interface MindMapProps {
  onGenerateChildren?: (nodeId: string, nodeLabel: string) => Promise<string[]>
}

export default function MindMap({ onGenerateChildren }: MindMapProps) {
  const [nodes, setNodes] = useState<MindMapNode[]>([
    {
      id: "root",
      x: 400,
      y: 300,
      label: "Idée Centrale",
      color: "#FF684A",
      children: [],
    },
  ])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const addChildNode = useCallback((parentId: string, label: string) => {
    const parent = nodes.find(n => n.id === parentId)
    if (!parent) return

    const childCount = parent.children.length
    const angle = (Math.PI * 2 * childCount) / (parent.children.length + 1)
    const distance = 150

    const newNode: MindMapNode = {
      id: Math.random().toString(36).substr(2, 9),
      x: parent.x + Math.cos(angle) * distance,
      y: parent.y + Math.sin(angle) * distance,
      label,
      color: "#4A90FF",
      parentId,
      children: [],
    }

    setNodes(prev => {
      const updated = prev.map(n => 
        n.id === parentId 
          ? { ...n, children: [...n.children, newNode.id] }
          : n
      )
      return [...updated, newNode]
    })
  }, [nodes])

  const generateAIChildren = async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node || !onGenerateChildren) return

    setIsGenerating(true)
    try {
      const suggestions = await onGenerateChildren(nodeId, node.label)
      suggestions.forEach(suggestion => {
        addChildNode(nodeId, suggestion)
      })
    } catch (error) {
      console.error("Error generating children:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderConnections = () => {
    return nodes
      .filter(node => node.parentId)
      .map(node => {
        const parent = nodes.find(n => n.id === node.parentId)
        if (!parent) return null

        return (
          <Line
            key={`line-${node.id}`}
            points={[parent.x, parent.y, node.x, node.y]}
            stroke="#E5E7EB"
            strokeWidth={2}
            lineCap="round"
          />
        )
      })
  }

  return (
    <>
      {/* Render connections first (behind nodes) */}
      {renderConnections()}

      {/* Render nodes */}
      {nodes.map(node => (
        <Group
          key={node.id}
          x={node.x}
          y={node.y}
          draggable
          onDragEnd={(e) => {
            setNodes(prev => prev.map(n => 
              n.id === node.id 
                ? { ...n, x: e.target.x(), y: e.target.y() }
                : n
            ))
          }}
          onClick={() => setSelectedNode(node.id)}
          onDblClick={() => {
            if (!isGenerating) {
              generateAIChildren(node.id)
            }
          }}
        >
          <Circle
            radius={40}
            fill={node.color}
            stroke={selectedNode === node.id ? "#000" : "transparent"}
            strokeWidth={3}
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={10}
            shadowOffsetY={4}
          />
          <Text
            text={node.label}
            fontSize={12}
            fill="white"
            fontStyle="bold"
            align="center"
            verticalAlign="middle"
            width={80}
            x={-40}
            y={-6}
          />
        </Group>
      ))}
    </>
  )
}

export function MindMapToolbar({ onAddNode, onGenerateAI }: { 
  onAddNode: () => void
  onGenerateAI: () => void 
}) {
  return (
    <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-sm">Mind Map</h3>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          onClick={onAddNode}
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter nœud
        </Button>
        <Button
          onClick={onGenerateAI}
          size="sm"
          variant="outline"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Générer IA
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Double-clic sur un nœud pour générer des enfants
      </p>
    </div>
  )
}
