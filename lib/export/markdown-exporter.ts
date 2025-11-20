/**
 * Export Markdown Structuré
 * Génère un document Markdown bien formaté du board
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

interface MarkdownExportOptions {
  includeMetadata?: boolean
  includeTableOfContents?: boolean
  groupByType?: boolean
  includeTimestamp?: boolean
}

/**
 * Exporte le board en Markdown structuré
 */
export function exportBoardToMarkdown(
  boardTitle: string,
  items: BoardItem[],
  options: MarkdownExportOptions = {}
): string {
  const {
    includeMetadata = true,
    includeTableOfContents = true,
    groupByType = false,
    includeTimestamp = true
  } = options

  let markdown = ''

  // Header
  markdown += `# ${boardTitle}\n\n`

  // Metadata
  if (includeMetadata) {
    markdown += `---\n`
    markdown += `**Créé avec:** Elite Visuals\n`
    if (includeTimestamp) {
      markdown += `**Date:** ${new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}\n`
    }
    markdown += `**Nombre d'éléments:** ${items.length}\n`
    markdown += `---\n\n`
  }

  // Table of Contents
  if (includeTableOfContents && items.length > 5) {
    markdown += `## 📑 Table des Matières\n\n`
    items.forEach((item, index) => {
      const title = item.title || `Élément ${index + 1}`
      const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      markdown += `${index + 1}. [${title}](#${anchor})\n`
    })
    markdown += `\n---\n\n`
  }

  // Group items
  let groupedItems: { [key: string]: BoardItem[] } = {}
  
  if (groupByType) {
    items.forEach(item => {
      const type = item.type
      if (!groupedItems[type]) {
        groupedItems[type] = []
      }
      groupedItems[type].push(item)
    })
  } else {
    groupedItems['all'] = items.sort((a, b) => {
      if (Math.abs(a.y - b.y) < 50) {
        return a.x - b.x
      }
      return a.y - b.y
    })
  }

  // Type labels
  const typeLabels: { [key: string]: string } = {
    'text': '📝 Notes',
    'image': '🖼️ Images',
    'video': '🎥 Vidéos',
    'ai-generated': '🤖 Généré par IA',
    'file': '📎 Fichiers',
    'all': 'Contenu'
  }

  // Export each group
  Object.entries(groupedItems).forEach(([type, groupItems]) => {
    if (groupItems.length === 0) return

    if (groupByType && type !== 'all') {
      markdown += `## ${typeLabels[type] || type}\n\n`
    }

    groupItems.forEach((item, index) => {
      const itemNumber = groupByType ? index + 1 : items.indexOf(item) + 1
      const title = item.title || `Élément ${itemNumber}`
      
      markdown += `### ${itemNumber}. ${title}\n\n`

      // Type badge
      const typeBadge = getTypeBadge(item.type)
      markdown += `${typeBadge}\n\n`

      // Content
      if (item.type === 'text') {
        markdown += `${item.content}\n\n`
      }

      if (item.type === 'ai-generated') {
        markdown += `> 🤖 **Généré par IA**\n\n`
        markdown += `${item.content}\n\n`
      }

      if (item.type === 'image') {
        markdown += `![${title}](${item.content})\n\n`
        markdown += `*Image: ${title}*\n\n`
      }

      if (item.type === 'video') {
        markdown += `🎥 **Vidéo:** ${title}\n\n`
        markdown += `[Voir la vidéo](${item.content})\n\n`
      }

      if (item.type === 'file') {
        markdown += `📎 **Fichier:** ${title}\n\n`
      }

      // Metadata
      markdown += `<details>\n`
      markdown += `<summary>Métadonnées</summary>\n\n`
      markdown += `- **Type:** ${item.type}\n`
      markdown += `- **Position:** x: ${Math.round(item.x)}, y: ${Math.round(item.y)}\n`
      markdown += `- **Dimensions:** ${Math.round(item.width)} × ${Math.round(item.height)}\n`
      markdown += `</details>\n\n`

      markdown += `---\n\n`
    })
  })

  // Statistics
  markdown += `## 📊 Statistiques\n\n`
  markdown += `| Type | Nombre |\n`
  markdown += `|------|--------|\n`
  
  const stats = getItemStatistics(items)
  Object.entries(stats).forEach(([type, count]) => {
    markdown += `| ${typeLabels[type] || type} | ${count} |\n`
  })
  markdown += `| **Total** | **${items.length}** |\n\n`

  // Footer
  markdown += `---\n\n`
  markdown += `*Document généré par [Elite Visuals](https://elitevisuals.com)*\n`

  return markdown
}

/**
 * Télécharge le markdown en tant que fichier
 */
export function downloadMarkdown(
  boardTitle: string,
  markdown: string
) {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  
  const fileName = `${boardTitle.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.md`
  link.href = url
  link.download = fileName
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)

  return {
    success: true,
    fileName,
    size: blob.size
  }
}

/**
 * Copie le markdown dans le presse-papier
 */
export async function copyMarkdownToClipboard(markdown: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(markdown)
    return true
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
    return false
  }
}

/**
 * Badge de type pour markdown
 */
function getTypeBadge(type: string): string {
  const badges: { [key: string]: string } = {
    'text': '`📝 Note`',
    'image': '`🖼️ Image`',
    'video': '`🎥 Vidéo`',
    'ai-generated': '`🤖 IA`',
    'file': '`📎 Fichier`'
  }
  return badges[type] || `\`${type}\``
}

/**
 * Statistiques des items par type
 */
function getItemStatistics(items: BoardItem[]): { [key: string]: number } {
  const stats: { [key: string]: number } = {}
  
  items.forEach(item => {
    stats[item.type] = (stats[item.type] || 0) + 1
  })
  
  return stats
}

/**
 * Génère un aperçu du markdown (premiers 500 caractères)
 */
export function generateMarkdownPreview(
  boardTitle: string,
  items: BoardItem[]
): string {
  const fullMarkdown = exportBoardToMarkdown(boardTitle, items, {
    includeMetadata: true,
    includeTableOfContents: false,
    groupByType: false,
    includeTimestamp: true
  })

  const preview = fullMarkdown.substring(0, 500)
  return preview + (fullMarkdown.length > 500 ? '\n\n...' : '')
}
