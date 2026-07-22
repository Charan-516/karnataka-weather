const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface WeatherData {
  current?: {
    temperature_2m?: number
    relative_humidity_2m?: number
    apparent_temperature?: number
    precipitation?: number
    weather_code?: number
    wind_speed_10m?: number
    pressure_msl?: number
  }
  daily?: {
    time?: string[]
    temperature_2m_max?: number[]
    temperature_2m_min?: number[]
    precipitation_sum?: number[]
    weather_code?: number[]
  }
}

export interface IntelligenceResponse {
  summary?: string
  weather?: WeatherData
  places?: { name: string; type: string; lat?: number; lng?: number }[]
  wikipedia?: { title: string; extract: string; url?: string; thumbnail?: string }
  wikivoyage?: { title: string; extract: string; url?: string }
  images?: { title: string; url: string }[]
  news?: { title: string; url: string; source: string; published: string }[]
  _available?: string[]
}

export async function fetchIntelligence(district: string, place?: string, placeLat?: number, placeLng?: number): Promise<IntelligenceResponse> {
  let url = `${API_URL}/intelligence?district=${encodeURIComponent(district)}`
  if (place) url += `&place=${encodeURIComponent(place)}`
  if (placeLat != null) url += `&lat=${placeLat}`
  if (placeLng != null) url += `&lng=${placeLng}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch intelligence')
  return res.json()
}
