"use client"

// Import direct de react-konva côté client uniquement
// Les composants sont exportés directement sans dynamic import
// car le "use client" directive garantit qu'ils ne seront pas SSR
export { Stage, Layer, Rect, Text, Image, Circle, Line, Group } from 'react-konva'
