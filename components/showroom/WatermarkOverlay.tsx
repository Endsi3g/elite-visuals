'use client'

export function WatermarkOverlay() {
  return (
    <>
      {/* Watermark principal (centre) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <div className="text-6xl font-bold text-gray-200 opacity-20 rotate-[-15deg]">
          Elite Visuals
        </div>
      </div>

      {/* Watermarks répétés (pattern) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl font-semibold text-gray-200 opacity-10 rotate-[-15deg]"
            style={{
              left: `${(i % 4) * 25 + 10}%`,
              top: `${Math.floor(i / 4) * 30 + 15}%`,
            }}
          >
            Elite Visuals
          </div>
        ))}
      </div>

      {/* Watermark footer */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg pointer-events-none select-none">
        <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">EV</span>
        </div>
        <span className="text-sm font-medium text-gray-700">
          Créé avec Elite Visuals
        </span>
      </div>
    </>
  )
}
