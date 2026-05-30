import modelData from './xgboost_model.json'

interface XgbNode {
  nodeid: number
  depth?: number
  children?: XgbNode[]
  split?: string
  split_condition?: number
  yes?: number
  no?: number
  missing?: number
  leaf?: number
}

interface XgbModel {
  trees: XgbNode[]
  classes: string[]
  feature_names: string[]
  n_estimators: number
  num_class: number
  learning_rate: number
}

const model = modelData as XgbModel

function predictTree(node: XgbNode, features: number[]): number {
  if ('leaf' in node) {
    return node.leaf!
  }
  const featIdx = parseInt(node.split!.slice(1))
  const val = features[featIdx]
  const childId = val <= node.split_condition! ? node.yes! : node.no!
  const child = node.children!.find(c => c.nodeid === childId)
  if (!child) {
    return 0
  }
  return predictTree(child, features)
}

function engineerFeatures(input: {
  minTemp: number
  maxTemp: number
  humidity: number
  pressure: number
  windSpeed: number
}): number[] {
  const minT = input.minTemp
  const maxT = input.maxTemp
  const hum = input.humidity
  const pres = input.pressure
  const wind = input.windSpeed

  const tempRange = maxT - minT
  const tempMean = (maxT + minT) / 2.0
  const humidityWind = hum * wind / 100.0
  const pressureAnomaly = 1013.25 - pres
  const stormIndex = (hum / 100.0) * (wind / 75.0) * (Math.max(pressureAnomaly, 0) / 25.0 + 0.3)
  const heatDryIndex = (maxT / 45.0) * (1.0 - hum / 100.0)
  const fogIndex = Math.max(0, Math.min(1, 1.0 - (minT - 10.0) / 18.0)) * (hum / 100.0) * Math.max(0, Math.min(1, 1.0 - wind / 75.0))
  const humidityHigh = Math.pow(Math.max(hum - 70, 0) / 30.0, 2)
  const humidityLow = Math.pow(Math.max(50 - hum, 0) / 50.0, 2)
  const windPower = Math.pow(wind / 75.0, 1.5)

  return [
    minT, maxT, hum, pres, wind,
    tempRange, tempMean, humidityWind, pressureAnomaly,
    stormIndex, heatDryIndex, fogIndex,
    humidityHigh, humidityLow, windPower,
  ]
}

function softmax(scores: number[]): number[] {
  const maxScore = Math.max(...scores)
  const exps = scores.map(s => Math.exp(s - maxScore))
  const sumExps = exps.reduce((a, b) => a + b, 0)
  return exps.map(e => e / sumExps)
}

function applyRuleOverrides(
  input: { minTemp: number; maxTemp: number; humidity: number; windSpeed: number },
  mlLabel: string,
  mlConfidence: number,
): [string, number] {
  const { humidity, windSpeed, minTemp, maxTemp } = input

  // Stormy: very high humidity + strong wind
  if (humidity >= 88 && windSpeed >= 40) return ['Stormy', Math.max(mlConfidence, 0.88)]

  // Rainy: very high humidity with any breeze, or high humidity with moderate wind
  if (humidity >= 88 && windSpeed >= 5) return ['Rainy', Math.max(mlConfidence, 0.82)]
  if (humidity >= 85 && windSpeed >= 15) return ['Rainy', Math.max(mlConfidence, 0.84)]
  if (humidity >= 92 && windSpeed >= 3) return ['Rainy', Math.max(mlConfidence, 0.80)]

  // Foggy: cool temps, moderate-high humidity, calm wind (checked before Cloudy)
  if (humidity >= 40 && windSpeed <= 15 && minTemp <= 18 && maxTemp <= 26) return ['Foggy', Math.max(mlConfidence, 0.78)]

  // Cloudy: moderate-high humidity any wind
  if (humidity >= 70) return ['Cloudy', Math.max(mlConfidence, 0.80)]

  // Windy: high wind speed (NOT already caught by Stormy/Rainy/Cloudy, so low-moderate humidity)
  if (windSpeed >= 30) return ['Windy', Math.max(mlConfidence, 0.82)]

  // Sunny: warm enough and dry-ish
  if (maxTemp >= 26 && humidity <= 55) return ['Sunny', Math.max(mlConfidence, 0.85)]

  // Fallback to ML model for edge cases
  return [mlLabel, mlConfidence]
}

export function predict(input: {
  minTemp: number
  maxTemp: number
  humidity: number
  pressure: number
  windSpeed: number
}): { condition: string; confidence: number; probabilities: Record<string, number> } {
  const features = engineerFeatures(input)

  const numClass = model.num_class
  const scores = new Array(numClass).fill(0)

  for (let i = 0; i < model.trees.length; i++) {
    const cls = i % numClass
    const leafValue = predictTree(model.trees[i], features)
    scores[cls] += leafValue
  }

  const probs = softmax(scores)

  let maxIdx = 0
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > probs[maxIdx]) maxIdx = i
  }

  const mlLabel = model.classes[maxIdx]
  const mlConfidence = probs[maxIdx]

  const [finalLabel, finalConfidence] = applyRuleOverrides(input, mlLabel, mlConfidence)

  const probabilities: Record<string, number> = {}
  model.classes.forEach((cls, i) => {
    probabilities[cls] = probs[i]
  })

  return { condition: finalLabel, confidence: finalConfidence, probabilities }
}
