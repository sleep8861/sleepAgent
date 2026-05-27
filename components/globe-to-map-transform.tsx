"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import * as d3 from "d3"
import { feature } from "topojson-client"
import { Button } from "@/components/ui/button"

interface GeoFeature {
  type: string
  geometry: any
  properties: any
}

function interpolateProjection(raw0: any, raw1: any) {
  const mutate: any = d3.geoProjectionMutator((t: number) => (x: number, y: number) => {
    const [x0, y0] = raw0(x, y)
    const [x1, y1] = raw1(x, y)
    return [x0 + t * (x1 - x0), y0 + t * (y1 - y0)]
  })
  let t = 0
  return Object.assign((mutate as any)(t), {
    alpha(_: number) {
      return arguments.length ? (mutate as any)((t = +_)) : t
    },
  })
}

export function GlobeToMapTransform() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState([0])
  const [worldData, setWorldData] = useState<GeoFeature[]>([])
  const [rotation, setRotation] = useState([0, 0])
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState([0, 0])
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        const h = Math.min(width * 0.64, 700)
        setDimensions({ width, height: h })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        const world: any = await response.json()
        const countries = (feature(world, world.objects.countries) as any).features
        setWorldData(countries)
      } catch (_) {
        setWorldData([{
          type: "Feature",
          geometry: { type: "Polygon", coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]] },
          properties: {},
        }])
      }
    }
    loadWorldData()
  }, [])

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    setIsDragging(true)
    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) setLastMouse([event.clientX - rect.left, event.clientY - rect.top])
  }, [])

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging) return
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const currentMouse = [event.clientX - rect.left, event.clientY - rect.top]
    const dx = currentMouse[0] - lastMouse[0]
    const dy = currentMouse[1] - lastMouse[1]
    const t = progress[0] / 100
    if (t < 0.5) {
      setRotation((prev) => [prev[0] + dx * 0.5, Math.max(-90, Math.min(90, prev[1] - dy * 0.5))])
    } else {
      setRotation((prev) => [prev[0] + dx * 0.25, Math.max(-90, Math.min(90, prev[1] - dy * 0.25))])
    }
    setLastMouse(currentMouse)
  }, [isDragging, lastMouse, progress])

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (!svgRef.current || worldData.length === 0) return
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const { width, height } = dimensions
    const t = progress[0] / 100
    const alpha = Math.pow(t, 0.5)

    const scale = d3.scaleLinear().domain([0, 1]).range([Math.min(width, height) * 0.34, Math.min(width, height) * 0.20])
    const projection = interpolateProjection(d3.geoOrthographicRaw, d3.geoEquirectangularRaw)
      .scale(scale(alpha))
      .translate([width / 2, height / 2])
      .rotate([rotation[0], rotation[1]])
      .precision(0.1)

    projection.alpha(alpha)
    const path = d3.geoPath(projection)

    // Graticule
    try {
      const graticule = d3.geoGraticule()
      const gp = path(graticule())
      if (gp) {
        svg.append("path").datum(graticule()).attr("d", gp)
          .attr("fill", "none").attr("stroke", "#d4d4d4").attr("stroke-width", 0.8).attr("opacity", 0.5)
      }
    } catch (_) {}

    // Countries
    svg.selectAll(".country").data(worldData).enter().append("path")
      .attr("class", "country")
      .attr("d", (d: any) => {
        try {
          const ps = path(d)
          if (!ps || (typeof ps === "string" && (ps.includes("NaN") || ps.includes("Infinity")))) return ""
          return ps
        } catch (_) { return "" }
      })
      .attr("fill", "none")
      .attr("stroke", "#404040")
      .attr("stroke-width", 0.7)
      .attr("opacity", 0.55)
      .style("visibility", function (this: SVGPathElement) {
        const d = d3.select(this).attr("d")
        return d && d.length > 0 && !d.includes("NaN") ? "visible" : "hidden"
      })

    // Sphere outline
    try {
      const so = path({ type: "Sphere" })
      if (so) {
        svg.append("path").datum({ type: "Sphere" }).attr("d", so)
          .attr("fill", "none").attr("stroke", "#d4d4d4").attr("stroke-width", 1).attr("opacity", 0.5)
      }
    } catch (_) {}
  }, [worldData, progress, rotation, dimensions])

  const handleAnimate = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    const startProgress = progress[0]
    const endProgress = startProgress === 0 ? 100 : 0
    const duration = 2000
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      setProgress([startProgress + (endProgress - startProgress) * eased])
      if (t < 1) requestAnimationFrame(animate)
      else setIsAnimating(false)
    }
    animate()
  }, [isAnimating, progress])

  const handleReset = useCallback(() => setRotation([0, 0]), [])

  const isMap = progress[0] > 50

  return (
    <div ref={containerRef} className="relative flex items-center justify-center w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full cursor-grab active:cursor-grabbing"
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        <Button
          onClick={handleAnimate}
          disabled={isAnimating}
          size="sm"
          className="cursor-pointer min-w-[120px] rounded-full bg-foreground hover:bg-foreground/90 text-background"
        >
          {isAnimating ? "Transforming..." : isMap ? "Roll to Globe" : "Unroll Map"}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="cursor-pointer min-w-[80px] rounded-full border-foreground/20 hover:bg-foreground/5"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
