import { NextRequest, NextResponse } from 'next/server'
import { predict } from '@/lib/xgboost'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { minTemp, maxTemp, humidity, pressure, windSpeed } = body

        if (
            typeof minTemp !== 'number' ||
            typeof maxTemp !== 'number' ||
            typeof humidity !== 'number' ||
            typeof pressure !== 'number' ||
            typeof windSpeed !== 'number'
        ) {
            return NextResponse.json(
                { error: 'Invalid input. All fields must be numbers.' },
                { status: 400 }
            )
        }

        console.log('[API /predict] Input:', { minTemp, maxTemp, humidity, pressure, windSpeed })

        const result = predict({ minTemp, maxTemp, humidity, pressure, windSpeed })

        console.log('[API /predict] Result:', {
            condition: result.condition,
            confidence: result.confidence,
            probabilities: result.probabilities,
        })

        return NextResponse.json({
            condition: result.condition,
            confidence: result.confidence,
        })
    } catch (err) {
        console.error('[API /predict] Error:', err)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
