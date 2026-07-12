'use client'
import { useState } from 'react'

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-7xl text-gray-300">
        🧯
      </div>
    )
  }

  return (
    <div>
      <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={name} className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === active ? 'border-brand-primary' : 'border-transparent hover:border-gray-200'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${name} - ảnh ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
