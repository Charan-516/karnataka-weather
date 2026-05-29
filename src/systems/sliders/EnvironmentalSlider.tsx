'use client'

interface SliderProps {
    label: string
    min: number
    max: number
    step?: number
    unit: string
    value: number
    onChange: (v: number) => void
}

function EnvironmentalSlider({
    label,
    min,
    max,
    step = 0.1,
    unit,
    value,
    onChange,
}: SliderProps) {
    const pct = ((value - min) / (max - min)) * 100
    const displayVal = step >= 1
        ? Math.round(value)
        : value.toFixed(1)

    return (
        <div className="env-slider">
            <div className="slider-meta">
                <span className="slider-label">{label}</span>
                <span className="slider-value">
                    {displayVal}
                    <span className="slider-unit">{unit}</span>
                </span>
            </div>
            <div className="slider-track">
                <div
                    className="slider-fill"
                    style={{ width: `${pct}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="slider-input"
                />
            </div>
        </div>
    )
}

export default EnvironmentalSlider