/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type EventPin = {
  title: string
  slug: string
  location?: string | null
  date?: string | null
}

type Props = {
  events: EventPin[]
  initialSlug?: string
}

type PinWithCoords = EventPin & {
  lat: number
  lon: number
}

function hashToLatLon(input: string): { lat: number; lon: number } {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  const lon = ((hash % 360) + 360) % 360 - 180 // -180 to 180
  const lat = (((hash >> 1) % 120) + 120) % 120 - 60 // -60 to 60
  return { lat, lon }
}

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

export function EventsGlobe({ events, initialSlug }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [selected, setSelected] = useState<string | undefined>(initialSlug)
  const router = useRouter()

  const pins = useMemo(() => {
    return events
      .filter((e) => e.location)
      .map((e) => {
        const { lat, lon } = hashToLatLon(e.location || '')
        return { ...e, lat, lon }
      })
  }, [events])

  const selectedPin = pins.find((p) => p.slug === selected) || pins[0]

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 4

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const ambient = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambient)
    const directional = new THREE.DirectionalLight(0xffffff, 0.6)
    directional.position.set(5, 3, 5)
    scene.add(directional)

    const globeGeometry = new THREE.SphereGeometry(1.5, 64, 64)
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0ea5e9'),
      emissive: new THREE.Color('#0ea5e9').multiplyScalar(0.2),
      roughness: 0.7,
      metalness: 0.1,
      wireframe: false,
    })
    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    scene.add(globe)

    const atmosphereGeometry = new THREE.SphereGeometry(1.52, 64, 64)
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#22d3ee'),
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    const pinMaterial = new THREE.MeshStandardMaterial({
      color: '#f97316',
      emissive: '#f97316',
      emissiveIntensity: 0.8,
    })
    const pinGeometry = new THREE.SphereGeometry(0.025, 16, 16)

    const pinsGroup = new THREE.Group()
    pins.forEach((pin) => {
      const mesh = new THREE.Mesh(pinGeometry, pinMaterial.clone())
      mesh.position.copy(latLonToVector3(pin.lat, pin.lon, 1.52))
      mesh.userData = pin
      pinsGroup.add(mesh)
    })
    scene.add(pinsGroup)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(pinsGroup.children, false)
      if (intersects.length > 0) {
        const data = intersects[0].object.userData as PinWithCoords
        setSelected(data.slug)
      }
    }

    window.addEventListener('resize', handleResize)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('click', onClick)

    let frame = 0
    const animate = () => {
      frame = requestAnimationFrame(animate)
      globe.rotation.y += 0.0008
      pinsGroup.rotation.y += 0.0008
      atmosphere.rotation.y += 0.0008
      raycaster.setFromCamera(mouse, camera)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('click', onClick)
      renderer.dispose()
      globeGeometry.dispose()
      globeMaterial.dispose()
      atmosphereGeometry.dispose()
      atmosphereMaterial.dispose()
      pinGeometry.dispose()
      pinsGroup.clear()
    }
  }, [pins])

  return (
    <div className="relative rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>3D Globe (click a dot)</span>
        </div>
        <span className="text-xs text-zinc-500">{pins.length} pinned</span>
      </div>
      <div ref={containerRef} className="relative w-full aspect-[16/9] bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {!pins.length && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
            No locations to show
          </div>
        )}
      </div>
      {selectedPin && (
        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-black/50">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-emerald-300 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Selected event
            </p>
            <h3 className="text-lg font-semibold text-white line-clamp-1">{selectedPin.title}</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
              {selectedPin.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedPin.date.split('T')[0]}
                </span>
              )}
              {selectedPin.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{selectedPin.location}</span>
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="border-zinc-700 text-zinc-100 hover:bg-zinc-900">
              <Link href={`/e/${selectedPin.slug}`}>Open</Link>
            </Button>
            <Button
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-400 text-black"
              onClick={() => router.push(`/e/${selectedPin.slug}`)}
            >
              Go <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

