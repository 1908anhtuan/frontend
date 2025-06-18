"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, ImageIcon } from "lucide-react"

interface MediaItem {
  url: string
  type: "image" | "video"
}

interface MediaPreviewProps {
  media: MediaItem[]
}

export default function MediaPreview({ media }: MediaPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!media || media.length === 0) return null

  const currentMedia = media[currentIndex]

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length)
  }

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {currentMedia.type === "image" ? (
          <img
            src={currentMedia.url || "/placeholder.svg"}
            alt="Post media"
            className="w-full max-h-96 object-contain bg-muted"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = "none"
              target.nextElementSibling?.classList.remove("hidden")
            }}
          />
        ) : (
          <video
            src={currentMedia.url}
            controls
            className="w-full max-h-96 object-contain bg-muted"
            onError={(e) => {
              const target = e.target as HTMLVideoElement
              target.style.display = "none"
              target.nextElementSibling?.classList.remove("hidden")
            }}
          />
        )}

        {/* Fallback for broken media */}
        <div className="hidden w-full h-48 bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            {currentMedia.type === "image" ? (
              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
            ) : (
              <Play className="h-8 w-8 mx-auto mb-2" />
            )}
            <p className="text-sm">Media failed to load</p>
          </div>
        </div>

        {/* Navigation arrows for multiple media */}
        {media.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={prevMedia}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={nextMedia}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Media counter */}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentIndex + 1} / {media.length}
            </div>
          </>
        )}
      </div>

      {/* Media thumbnails for multiple items */}
      {media.length > 1 && (
        <div className="p-2 flex gap-2 overflow-x-auto">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                index === currentIndex ? "border-primary" : "border-muted"
              }`}
            >
              {item.type === "image" ? (
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </Card>
  )
}
