import { useState, useEffect, useCallback } from 'react';

interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

interface Item {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useCanvasVirtualization(items: Item[], viewport: Viewport) {
  const [visibleItems, setVisibleItems] = useState<Item[]>([]);

  const checkVisibility = useCallback(() => {
    // Marge de sécurité pour précharger les éléments juste en dehors de l'écran
    const buffer = 200; 
    
    // Calculer les limites du viewport dans les coordonnées du monde (zoom inverse)
    const viewX = -viewport.x / viewport.scale;
    const viewY = -viewport.y / viewport.scale;
    const viewWidth = viewport.width / viewport.scale;
    const viewHeight = viewport.height / viewport.scale;

    const visible = items.filter(item => {
      return (
        item.x + item.width > viewX - buffer &&
        item.x < viewX + viewWidth + buffer &&
        item.y + item.height > viewY - buffer &&
        item.y < viewY + viewHeight + buffer
      );
    });

    setVisibleItems(visible);
  }, [items, viewport]);

  useEffect(() => {
    checkVisibility();
  }, [checkVisibility]);

  return visibleItems;
}
