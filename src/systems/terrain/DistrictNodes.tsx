'use client'
import { useRef, useState } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { CITIES, toScene } from '@/lib/cities'

interface NodeProps {
    x: number
    y: number
    name: string
    region: string
    onClick: () => void
    onHover: (
        name: string,
        region: string,
        x: number,
        y: number
    ) => void
    onLeave: () => void
}

function CityNode({
    x, y, name, region,
    onClick, onHover, onLeave,
}: NodeProps) {
    const coreRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)

    useFrame(({ clock }) => {
        if (!coreRef.current || !glowRef.current) return
        const t = clock.elapsedTime
        const pulse = 0.85 + 0.15 * Math.sin(t * 2.5 + x * 8)
        const scale = hovered ? 1.8 : 1.0

        coreRef.current.scale.setScalar(scale * pulse)
        glowRef.current.scale.setScalar(
            scale * (1.8 + 0.3 * pulse)
        )
            ; (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
                hovered ? 0.55 : 0.18 + 0.06 * pulse
    })

    const handleOver = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
        onHover(name, region, e.nativeEvent.clientX, e.nativeEvent.clientY)
    }

    const handleOut = () => {
        setHovered(false)
        document.body.style.cursor = 'default'
        onLeave()
    }

    return (
        <group position={[x, y, 0.5]}>
            {/* Glow ring */}
            <mesh ref={glowRef}>
                <circleGeometry args={[0.2, 16]} />
                <meshBasicMaterial
                    color="#e8b89a"
                    transparent
                    opacity={0.18}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Core dot */}
            <mesh
                ref={coreRef}
                onPointerOver={handleOver}
                onPointerOut={handleOut}
                onClick={onClick}
            >
                <circleGeometry args={[0.09, 12]} />
                <meshBasicMaterial
                    color={hovered ? '#8b4513' : '#c4622d'}
                    transparent
                    opacity={hovered ? 1.0 : 0.85}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}

interface Props {
    onCityClick: (city: string) => void
    onCityHover: (
        name: string,
        region: string,
        x: number,
        y: number
    ) => void
    onCityLeave: () => void
}

export default function DistrictNodes({
    onCityClick,
    onCityHover,
    onCityLeave,
}: Props) {
    return (
        <>
            {CITIES.map((city) => {
                const { x, y } = toScene(city.lat, city.lng)
                return (
                    <CityNode
                        key={city.name}
                        x={x}
                        y={y}
                        name={city.name}
                        region={city.region}
                        onClick={() => onCityClick(city.name)}
                        onHover={onCityHover}
                        onLeave={onCityLeave}
                    />
                )
            })}
        </>
    )
}