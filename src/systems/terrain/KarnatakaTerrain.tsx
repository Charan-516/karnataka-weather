'use client'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { KARNATAKA_BORDER } from '@/lib/karnatakaBorder'

export default function KarnatakaTerrain() {
    const meshRef = useRef<THREE.Mesh>(null)

    const { extrudeGeo, shapeGeo } = useMemo(() => {
        const shape = new THREE.Shape()
        shape.moveTo(KARNATAKA_BORDER[0][0], KARNATAKA_BORDER[0][1])
        KARNATAKA_BORDER.slice(1).forEach(([x, y]) =>
            shape.lineTo(x, y)
        )
        shape.closePath()

        const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.04,
            bevelSize: 0.02,
            bevelSegments: 2,
        })

        const shapeGeo = new THREE.ShapeGeometry(shape)

        return { extrudeGeo, shapeGeo }
    }, [])

    useFrame(({ clock }) => {
        const t = clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.position.y =
                Math.sin(t * 0.3) * 0.06
            meshRef.current.rotation.x =
                -0.12 + Math.sin(t * 0.2) * 0.01
        }
    })

    return (
        <group ref={meshRef} position={[0, 0, -0.5]}>
            {/* Main terrain body */}
            <mesh geometry={extrudeGeo}>
                <meshStandardMaterial
                    color="#c4956a"
                    roughness={0.9}
                    metalness={0.0}
                    transparent
                    opacity={0.85}
                />
            </mesh>

            {/* Top face lighter sandal */}
            <mesh geometry={shapeGeo} position={[0, 0, 0.21]}>
                <meshStandardMaterial
                    color="#deb887"
                    roughness={0.95}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Peach border glow */}
            <mesh geometry={shapeGeo} position={[0, 0, 0.22]}>
                <meshBasicMaterial
                    color="#e8b89a"
                    transparent
                    opacity={0.15}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}