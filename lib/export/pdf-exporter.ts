/**
 * Export PDF Vectoriel du Board
 * Utilise jsPDF pour générer un PDF vectoriel de haute qualité
 */

interface BoardItem {
  id: string
  type: "text" | "image" | "video" | "file" | "ai-generated"
  x: number
  y: number
  width: number
  height: number
  content: any
  title?: string
}

interface ExportOptions {
  includeWatermark?: boolean
  pageSize?: 'A4' | 'A3' | 'Letter'
  orientation?: 'portrait' | 'landscape'
  quality?: number
}

/**
 * Exporte le board en PDF vectoriel
 */
export async function exportBoardToPDF(
  boardTitle: string,
  items: BoardItem[],
  options: ExportOptions = {}
) {
  const {
    includeWatermark = true,
    pageSize = 'A4',
    orientation = 'landscape',
    quality = 0.95
  } = options

  // Import dynamique de jsPDF pour réduire le bundle
  const { default: jsPDF } = await import('jspdf')

  // Créer le document PDF
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize,
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Page de couverture
  pdf.setFillColor(255, 104, 74) // Orange Elite
  pdf.rect(0, 0, pageWidth, 40, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text(boardTitle, pageWidth / 2, 25, { align: 'center' })

  if (includeWatermark) {
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Créé avec Elite Visuals', pageWidth / 2, 35, { align: 'center' })
  }

  // Date
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(10)
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  pdf.text(date, pageWidth / 2, pageHeight - 10, { align: 'center' })

  // Trier les items par position (de haut en bas, gauche à droite)
  const sortedItems = [...items].sort((a, b) => {
    if (Math.abs(a.y - b.y) < 50) {
      return a.x - b.x
    }
    return a.y - b.y
  })

  // Ajouter chaque item sur une nouvelle page
  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i]
    
    pdf.addPage()

    // Header de page
    pdf.setFillColor(255, 104, 74)
    pdf.rect(0, 0, pageWidth, 15, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(12)
    pdf.text(item.title || `Élément ${i + 1}`, 10, 10)
    
    // Numéro de page
    pdf.setFontSize(10)
    pdf.text(`${i + 1} / ${sortedItems.length}`, pageWidth - 20, 10)

    // Contenu de l'item
    const contentY = 25
    const contentX = 10
    const maxWidth = pageWidth - 20
    const maxHeight = pageHeight - 40

    if (item.type === 'text' || item.type === 'ai-generated') {
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      
      if (item.title) {
        pdf.text(item.title, contentX, contentY)
      }

      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      
      const text = typeof item.content === 'string' 
        ? item.content 
        : JSON.stringify(item.content)
      
      const lines = pdf.splitTextToSize(text, maxWidth)
      pdf.text(lines, contentX, contentY + 10)

      // Badge IA si généré par IA
      if (item.type === 'ai-generated') {
        pdf.setFillColor(255, 104, 74)
        pdf.roundedRect(contentX, contentY + 15 + (lines.length * 5), 30, 6, 2, 2, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(8)
        pdf.text('Généré par IA', contentX + 2, contentY + 19 + (lines.length * 5))
      }
    }

    if (item.type === 'image') {
      try {
        // Calculer les dimensions pour maintenir le ratio
        const imgWidth = Math.min(item.width / 4, maxWidth)
        const imgHeight = Math.min(item.height / 4, maxHeight)
        
        pdf.addImage(
          item.content,
          'JPEG',
          contentX,
          contentY,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        )
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'image:', error)
        pdf.setTextColor(150, 150, 150)
        pdf.text('[Image non disponible]', contentX, contentY)
      }
    }

    if (item.type === 'video') {
      // Pour les vidéos, afficher un placeholder avec lien
      pdf.setFillColor(240, 240, 240)
      pdf.rect(contentX, contentY, maxWidth, 60, 'F')
      
      pdf.setTextColor(100, 100, 100)
      pdf.setFontSize(12)
      pdf.text('🎥 Vidéo', contentX + maxWidth / 2, contentY + 25, { align: 'center' })
      pdf.setFontSize(10)
      pdf.text(item.title || 'Vidéo', contentX + maxWidth / 2, contentY + 35, { align: 'center' })
    }

    // Watermark sur chaque page
    if (includeWatermark) {
      pdf.setTextColor(200, 200, 200)
      pdf.setFontSize(8)
      pdf.text('Elite Visuals', pageWidth - 30, pageHeight - 5)
    }
  }

  // Sauvegarder le PDF
  const fileName = `${boardTitle.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`
  pdf.save(fileName)

  return {
    success: true,
    fileName,
    pageCount: sortedItems.length + 1
  }
}

/**
 * Génère un aperçu du PDF (première page uniquement)
 */
export async function generatePDFPreview(
  boardTitle: string,
  items: BoardItem[]
): Promise<string> {
  const { default: jsPDF } = await import('jspdf')
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'A4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  
  // Page de couverture uniquement
  pdf.setFillColor(255, 104, 74)
  pdf.rect(0, 0, pageWidth, 40, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.text(boardTitle, pageWidth / 2, 25, { align: 'center' })

  // Retourner en base64 pour aperçu
  return pdf.output('dataurlstring')
}
