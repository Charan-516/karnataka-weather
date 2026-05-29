'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
    count?: number
    speedMultiplier?: number
    color?: string
}

// eslint-disable-next-line react-hooks/purity
const rand = (min: number, max: number) => Math.random() * (max - min) + min

export default function ParticleField({
    count = 300,
    speedMultiplier = 1,
    color = '#8899bb',
}: Props) {
    const ref = useRef<THREE.Points>(null)

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            arr[i * 3] = rand(-20, 20)
            arr[i * 3 + 1] = rand(-20, 20)
            arr[i * 3 + 2] = rand(-15, -5)
        }
        return arr
    }, [count])

    useFrame(() => {
        if (!ref.current) return
        const pos = ref.current.geometry.attributes.position
            .array as Float32Array
        const speed = 0.003 * speedMultiplier
        for (let i = 0; i < count; i++) {
            pos[i * 3 + 1] += speed
            if (pos[i * 3 + 1] > 22) pos[i * 3 + 1] = -22
        }
        ref.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                color={color}
                transparent
                opacity={0.35}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                sizeAttenuation
            />
        </points>
    )
}