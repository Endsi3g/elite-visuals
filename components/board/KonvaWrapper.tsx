"use client"

import dynamic from 'next/dynamic'

// Import dynamique de Konva pour éviter les erreurs SSR
export const Stage = dynamic(
  () => import('react-konva').then((mod) => mod.Stage),
  { ssr: false }
)

export const Layer = dynamic(
  () => import('react-konva').then((mod) => mod.Layer),
  { ssr: false }
)

export const Rect = dynamic(
  () => import('react-konva').then((mod) => mod.Rect),
  { ssr: false }
)

export const Text = dynamic(
  () => import('react-konva').then((mod) => mod.Text),
  { ssr: false }
)

export const Image = dynamic(
  () => import('react-konva').then((mod) => mod.Image),
  { ssr: false }
)

export const Circle = dynamic(
  () => import('react-konva').then((mod) => mod.Circle),
  { ssr: false }
)

export const Line = dynamic(
  () => import('react-konva').then((mod) => mod.Line),
  { ssr: false }
)

export const Group = dynamic(
  () => import('react-konva').then((mod) => mod.Group),
  { ssr: false }
)
