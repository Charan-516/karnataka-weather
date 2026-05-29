'use client'
import dynamic from 'next/dynamic'

const SunnyBg = dynamic(() => import('./backgrounds/SunnyBackground'), { ssr: false })
const CloudyBg = dynamic(() => import('./backgrounds/CloudyBackground'), { ssr: false })
const RainyBg = dynamic(() => import('./backgrounds/RainyBackground'), { ssr: false })
const StormyBg = dynamic(() => import('./backgrounds/StormyBackground'), { ssr: false })
const FoggyBg = dynamic(() => import('./backgrounds/FoggyBackground'), { ssr: false })
const WindyBg = dynamic(() => import('./backgrounds/WindyBackground'), { ssr: false })

interface Props {
    condition: string
}

export default function WeatherBackground({ condition }: Props) {
    switch (condition) {
        case 'Sunny': return <SunnyBg />
        case 'Cloudy': return <CloudyBg />
        case 'Rainy': return <RainyBg />
        case 'Stormy': return <StormyBg />
        case 'Foggy': return <FoggyBg />
        case 'Windy': return <WindyBg />
        default: return <SunnyBg />
    }
}
