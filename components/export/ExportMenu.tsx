"use client"

import { useState } from "react"
import { Download, FileText, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportBoardToPDF } from "@/lib/export/pdf-exporter"
import { exportBoardToMarkdown, downloadMarkdown } from "@/lib/export/markdown-exporter"

interface ExportMenuProps {
  boardTitle: string
  items: any[]
}

export default function ExportMenu({ boardTitle, items }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportBoardToPDF(boardTitle, items)
      alert('PDF exporté avec succès!')
    } catch (error) {
      alert('Erreur lors de l\'export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportMarkdown = () => {
    const markdown = exportBoardToMarkdown(boardTitle, items)
    downloadMarkdown(boardTitle, markdown)
    alert('Markdown exporté avec succès!')
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExportPDF}
        disabled={isExporting}
        variant="outline"
        size="sm"
      >
        <File className="h-4 w-4 mr-2" />
        PDF
      </Button>
      <Button
        onClick={handleExportMarkdown}
        variant="outline"
        size="sm"
      >
        <FileText className="h-4 w-4 mr-2" />
        Markdown
      </Button>
    </div>
  )
}
