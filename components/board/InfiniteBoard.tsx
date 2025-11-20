"use client"

import { useState, useRef, useCallback } from "react"
import { Stage, Layer, Rect, Text, Image as KonvaImage } from "react-konva"
import { Plus, Upload, Wand2, Video, FileText, Image as ImageIcon, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDropzone } from "react-dropzone"
import BoardCard from "./BoardCard"
import SmartCluster from "./SmartCluster"
import { useVirtualizedItems } from "@/hooks/useVirtualizedItems"
import { OptimizedGrid } from "./OptimizedGrid"

interface BoardItem {
  id: string
  type: "text" | "image" | "video" | "file" | "ai-generated"
  x: number
  y: number
  width: number
  height: number
  content: any
  title?: string
  clusterId?: string
}

interface Cluster {
  id: string
  name: string
  itemIds: string[]
  color: string
}

export default function InfiniteBoard() {
  const [items, setItems] = useState<BoardItem[]>([])
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [showSmartCluster, setShowSmartCluster] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const stageRef = useRef<any>(null)

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth - 384, // Largeur - sidebar
        height: window.innerHeight - 64  // Hauteur - header
      })
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Hook de virtualisation pour ne rendre que les éléments visibles
  const { visibleItems, viewport, updateVisibleItems } = useVirtualizedItems(
    items,
    stageRef,
    500 // buffer de 500px autour du viewport
  )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const newItem: BoardItem = {
          id: Math.random().toString(36).substr(2, 9),
          type: file.type.startsWith("image") ? "image" : "file",
          x: Math.random() * 800,
          y: Math.random() * 600,
          width: 200,
          height: 200,
          content: reader.result,
          title: file.name,
        }
        setItems((prev) => [...prev, newItem])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  })

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
    setScale(newScale)

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    }
    setPosition(newPos)
    
    // Mettre à jour les éléments visibles après le zoom
    updateVisibleItems()
  }

  const addTextCard = () => {
    const newItem: BoardItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: "text",
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 300,
      width: 250,
      height: 150,
      content: "Nouvelle note...",
      title: "Note",
    }
    setItems((prev) => [...prev, newItem])
  }

  const generateAIContent = () => {
    const newItem: BoardItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: "ai-generated",
      x: 150 + Math.random() * 400,
      y: 150 + Math.random() * 300,
      width: 300,
      height: 200,
      content: "Génération IA en cours...",
      title: "IA Génération",
    }
    setItems((prev) => [...prev, newItem])
  }

  const handleCluster = (clusterName: string, itemIds: string[]) => {
    const newCluster: Cluster = {
      id: Math.random().toString(36).substr(2, 9),
      name: clusterName,
      itemIds,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    }
    setClusters((prev) => [...prev, newCluster])
    
    // Update items with cluster ID
    setItems((prev) => prev.map(item => 
      itemIds.includes(item.id) ? { ...item, clusterId: newCluster.id } : item
    ))
  }

  const exportToMarkdown = () => {
    let markdown = `# Elite Visuals Board Export\n\n`
    markdown += `**Date:** ${new Date().toLocaleDateString()}\n\n`
    markdown += `**Total Items:** ${items.length}\n\n`
    
    clusters.forEach(cluster => {
      markdown += `## ${cluster.name}\n\n`
      const clusterItems = items.filter(item => item.clusterId === cluster.id)
      clusterItems.forEach(item => {
        markdown += `- **${item.title || item.type}**: ${item.content}\n`
      })
      markdown += `\n`
    })
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `elite-visuals-board-${Date.now()}.md`
    a.click()
  }

  const exportToPDF = async () => {
    // TODO: Implement PDF export with jsPDF
    alert('Export PDF en cours de développement')
  }

  return (
    <div {...getRootProps()} className="w-full h-full relative infinite-board bg-gray-50">
      <input {...getInputProps()} />
      
      {/* Floating Action Buttons */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          onClick={addTextCard}
          className="bg-primary hover:bg-primary/90 glow-orange shadow-lg"
          size="icon"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          onClick={generateAIContent}
          className="bg-primary hover:bg-primary/90 glow-orange shadow-lg"
          size="icon"
        >
          <Wand2 className="h-5 w-5" />
        </Button>
        <Button
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-lg"
          size="icon"
        >
          <Upload className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-lg"
          size="icon"
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>

      {/* Export Menu */}
      {showExportMenu && (
        <div className="absolute top-4 left-20 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]">
          <h3 className="font-semibold text-sm mb-2">Exporter le Board</h3>
          <div className="flex flex-col gap-2">
            <Button
              onClick={exportToMarkdown}
              variant="ghost"
              size="sm"
              className="justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Markdown
            </Button>
            <Button
              onClick={exportToPDF}
              variant="ghost"
              size="sm"
              className="justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      )}

      {/* Drag Active Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-20 bg-primary/10 border-4 border-dashed border-primary flex items-center justify-center">
          <div className="text-center">
            <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-xl font-semibold text-primary">
              Déposez vos fichiers ici
            </p>
          </div>
        </div>
      )}

      {/* Konva Stage */}
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
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e) => {
          setIsDragging(false)
          setPosition({ x: e.target.x(), y: e.target.y() })
          // Mettre à jour les éléments visibles après le pan
          updateVisibleItems()
        }}
        style={{ pointerEvents: 'auto' }}
      >
        <Layer>
          {/* Grille optimisée - ne rend que les lignes visibles */}
          <OptimizedGrid viewport={viewport} gridSize={100} color="#e5e7eb" />

          {/* Board Items - seulement les éléments visibles */}
          {visibleItems.map((item) => (
            <BoardCard key={item.id} item={item} />
          ))}
        </Layer>
      </Stage>

      {/* Info Bar */}
      <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          Zoom: {Math.round(scale * 100)}% | Items: {items.length} ({visibleItems.length} visibles) | Clusters: {clusters.length}
        </p>
      </div>

      {/* Smart Cluster */}
      {showSmartCluster && (
        <SmartCluster 
          items={items} 
          onCluster={handleCluster}
        />
      )}
    </div>
  )
}
