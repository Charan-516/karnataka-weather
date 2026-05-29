'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function FogLayer() {
    const ref1 = useRef<THREE.Mesh>(null)
    const ref2 = useRef<THREE.Mesh>(null)

    const mat1 = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: '#e8d5b8',
                transparent: true,
                opacity: 0.15,
                side: THREE.DoubleSide,
                depthWrite: false,
            }),
        []
    )

    const mat2 = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: '#dfc8a8',
                transparent: true,
                opacity: 0.10,
                side: THREE.DoubleSide,
                depthWrite: false,
            }),
        []
    )

    useFrame(({ clock }) => {
        const t = clock.elapsedTime
        if (ref1.current) {
            ref1.current.position.x = Math.sin(t * 0.08) * 3
            ref1.current.position.y = Math.cos(t * 0.06) * 1.5
        }
        if (ref2.current) {
            ref2.current.position.x = Math.cos(t * 0.07) * 2.5
            ref2.current.position.y = Math.sin(t * 0.05) * 2
        }
    })

    return (
        <>
            <mesh ref={ref1} position={[0, 0, -2]} material={mat1}>
                <planeGeometry args={[25, 10]} />
            </mesh>
            <mesh ref={ref2} position={[0, -2, -3]} material={mat2}>
                <planeGeometry args={[30, 8]} />
            </mesh>
        </>
    )
}