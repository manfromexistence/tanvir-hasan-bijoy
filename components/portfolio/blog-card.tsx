"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRef, useState } from "react"
import { useTheme } from "next-themes"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from "@/lib/utils"

// Define the props for the BlogCard component - removed title and description
export default function BlogCard({ image }: { image: string }) {
  // Create a ref for the card element
  const ref = useRef<HTMLDivElement>(null)
  // State to track mouse position relative to the card
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  // State to track whether the card is being hovered
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme()

  // Function to handle mouse movement over the card
  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    // Get the bounding rectangle of the current element
    const rect = ref.current?.getBoundingClientRect()

    // If we successfully got the rectangle
    if (rect) {
      // Calculate the mouse position relative to the element
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      // Update the state with the new mouse position
      setMousePosition({ x, y })
    }
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }} // Slightly increase size on hover
      className="relative flex w-full h-full overflow-hidden rounded-md border hover:cursor-pointer"
    >
      {/* Radial gradient overlay that follows the mouse */}
      <div
        className="absolute inset-0 z-10 transition-opacity duration-300 ease-in-out pointer-events-none"
        style={{
          background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, ${theme === "light" ? "hsl(var(--muted))" : "hsl(var(--muted-foreground))"}, transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Use the entire area for the image */}
      <div className="w-full h-full">
        {image ? (
          <AspectRatio ratio={16/9} className="h-full">
            <Image
              src={image}
              alt="Content image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </AspectRatio>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>
    </motion.div>
  )
}