"use client"

import { useState, useRef, useEffect } from "react"
import { Stage, Layer } from "react-konva"
import FloatingToolbar from "./FloatingToolbar"
import MindMapNode, { MindMapNodeData, MindMapConnection } from "./MindMapNode"
import InteractiveCard, { CardData } from "./InteractiveCard"
import { OptimizedGrid } from "../board/OptimizedGrid"

interface AgentDashboardProps {
  showKanban?: boolean
}

export default function AgentDashboard({ showKanban = true }: AgentDashboardProps) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [activeAction, setActiveAction] = useState<string | undefined>()
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>()
  
  // Mindmap nodes
  const [mindMapNodes, setMindMapNodes] = useState<MindMapNodeData[]>([
    {
      id: 'root-1',
      x: 400,
      y: 300,
      width: 280,
      height: 120,
      title: 'Campagne Orange 2024',
      content: 'Stratégie créative complète',
      type: 'root',
      children: ['branch-1', 'branch-2'],
      aiGenerated: false,
    },
    {
      id: 'branch-1',
      x: 750,
      y: 200,
      width: 240,
      height: 100,
      title: 'Contenu Vidéo',
      content: 'Scripts et moodboards',
      type: 'branch',
      parentId: 'root-1',
      children: ['leaf-1', 'leaf-2'],
      aiGenerated: true,
    },
    {
      id: 'branch-2',
      x: 750,
      y: 380,
      width: 240,
      height: 100,
      title: 'Analyse Marché',
      content: 'Insights et tendances',
      type: 'branch',
      parentId: 'root-1',
      children: [],
      aiGenerated: true,
    },
    {
      id: 'leaf-1',
      x: 1050,
      y: 150,
      width: 200,
      height: 80,
      title: 'Script 30s',
      content: 'Généré par Claude',
      type: 'leaf',
      parentId: 'branch-1',
      children: [],
      aiGenerated: true,
    },
    {
      id: 'leaf-2',
      x: 1050,
      y: 260,
      width: 200,
      height: 80,
      title: 'Moodboard',
      content: 'Créé avec Luma AI',
      type: 'leaf',
      parentId: 'branch-1',
      children: [],
      aiGenerated: true,
    },
  ])

  // Interactive cards
  const [cards, setCards] = useState<CardData[]>([
    {
      id: 'card-1',
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      type: 'text',
      title: 'Brief Client',
      content: 'Campagne pour lancement produit Q1 2024...',
      author: 'Marie D.',
      timestamp: new Date(),
    },
    {
      id: 'card-2',
      x: 100,
      y: 350,
      width: 300,
      height: 250,
      type: 'ai-generated',
      title: 'Script Publicitaire',
      content: 'Voici un script de 30 secondes optimisé pour les réseaux sociaux...',
      author: 'Claude 3.5',
      timestamp: new Date(),
      aiModel: 'Claude 3.5 Sonnet',
    },
  ])

  const stageRef = useRef<any>(null)

  useEffect(() => {
    const updateDimensions = () => {
      const sidebarWidth = showKanban ? 384 : 0
      setDimensions({
        width: window.innerWidth - sidebarWidth - 88,
        height: window.innerHeight - 64,
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [showKanban])

  const handleWheel = (e: any) => {
    e.evt.preventDefault()
    const scaleBy = 1.1
    const stage = stageRef.current
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
    const clampedScale = Math.max(0.1, Math.min(5, newScale))
    setScale(clampedScale)

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    }
    setPosition(newPos)
  }

  const handleNodeDragEnd = (id: string, x: number, y: number) => {
    setMindMapNodes(prev =>
      prev.map(node => (node.id === id ? { ...node, x, y } : node))
    )
  }

  const handleCardDragEnd = (id: string, x: number, y: number) => {
    setCards(prev =>
      prev.map(card => (card.id === id ? { ...card, x, y } : card))
    )
  }

  const handleNodeDoubleClick = (id: string) => {
    console.log('Expand node:', id)
  }

  const handleToolbarAction = (action: string) => {
    setActiveAction(action)
    console.log('Toolbar action:', action)

    switch (action) {
      case 'add-note':
        addTextCard()
        break
      case 'ai-generate':
        generateAIContent()
        break
      case 'create-mindmap':
        createMindMapNode()
        break
    }
  }

  const addTextCard = () => {
    const newCard: CardData = {
      id: `card-${Date.now()}`,
      x: 200 + Math.random() * 300,
      y: 200 + Math.random() * 200,
      width: 300,
      height: 200,
      type: 'text',
      title: 'Nouvelle note',
      content: 'Commencez à écrire...',
      author: 'Vous',
      timestamp: new Date(),
    }
    setCards(prev => [...prev, newCard])
  }

  const generateAIContent = () => {
    const newCard: CardData = {
      id: `card-${Date.now()}`,
      x: 200 + Math.random() * 300,
      y: 200 + Math.random() * 200,
      width: 300,
      height: 250,
      type: 'ai-generated',
      title: 'Contenu IA',
      content: 'Génération en cours...',
      author: 'IA',
      timestamp: new Date(),
      aiModel: 'Claude 3.5',
    }
    setCards(prev => [...prev, newCard])
  }

  const createMindMapNode = () => {
    const newNode: MindMapNodeData = {
      id: `node-${Date.now()}`,
      x: 400 + Math.random() * 400,
      y: 200 + Math.random() * 300,
      width: 240,
      height: 100,
      title: 'Nouveau concept',
      content: 'Description...',
      type: 'branch',
      children: [],
      aiGenerated: false,
    }
    setMindMapNodes(prev => [...prev, newNode])
  }

  const renderConnections = () => {
    const connections: JSX.Element[] = []
    
    mindMapNodes.forEach(node => {
      if (node.parentId) {
        const parent = mindMapNodes.find(n => n.id === node.parentId)
        if (parent) {
          connections.push(
            <MindMapConnection
              key={`conn-${parent.id}-${node.id}`}
              fromX={parent.x}
              fromY={parent.y}
              fromWidth={parent.width}
              fromHeight={parent.height}
              toX={node.x}
              toY={node.y}
              toWidth={node.width}
              toHeight={node.height}
            />
          )
        }
      }
    })

    return connections
  }

  return (
    <div className="relative w-full h-full bg-gray-50">
      <FloatingToolbar 
        onAction={handleToolbarAction}
        activeAction={activeAction}
      />

      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onWheel={handleWheel}
        onDragEnd={(e) => {
          setPosition({ x: e.target.x(), y: e.target.y() })
        }}
        className="cursor-grab active:cursor-grabbing"
      >
        <Layer>
          <OptimizedGrid
            viewport={{ 
              x: -position.x / scale, 
              y: -position.y / scale, 
              width: dimensions.width / scale, 
              height: dimensions.height / scale,
              scale: scale
            }}
            gridSize={50}
            color="#e5e7eb"
          />

          {renderConnections()}

          {mindMapNodes.map(node => (
            <MindMapNode
              key={node.id}
              node={node}
              onDragEnd={handleNodeDragEnd}
              onDoubleClick={handleNodeDoubleClick}
              onSelect={setSelectedNodeId}
              selected={selectedNodeId === node.id}
            />
          ))}

          {cards.map(card => (
            <InteractiveCard
              key={card.id}
              card={card}
              onDragEnd={handleCardDragEnd}
            />
          ))}
        </Layer>
      </Stage>

      <div className="absolute bottom-4 left-20 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          Zoom: {Math.round(scale * 100)}% | Nœuds: {mindMapNodes.length} | Cards: {cards.length}
        </p>
      </div>
    </div>
  )
}
