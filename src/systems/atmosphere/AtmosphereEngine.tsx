'use client'
import { Canvas } from '@react-three/fiber'
import ParticleField from './ParticleField'
import FogLayer from './FogLayer'

interface Props {
    particleSpeed?: number
    particleColor?: string
}

export default function AtmosphereEngine({
    particleSpeed = 1,
    particleColor = '#f0c8a0',
}: Props) {
    return (
        <Canvas
            camera={{ position: [0, 0, 10], fov: 60 }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
            }}
            gl={{ antialias: false, alpha: false }}
            dpr={[1, 1.5]}
        >
            <color attach="background" args={['#f5f0e8']} />
            <fog attach="fog" args={['#f5f0e8', 20, 60]} />
            <ambientLight intensity={0.8} color="#f0d0a0" />
            <ParticleField
                count={120}
                speedMultiplier={particleSpeed}
                color={particleColor}
            />
            <FogLayer />
        </Canvas>
    )
}