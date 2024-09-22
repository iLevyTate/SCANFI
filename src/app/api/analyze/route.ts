import { NextResponse } from 'next/server'
import { createAssistants } from '@/lib/pfc.js'

export async function POST(request: Request) {
  try {
    const { inputText } = await request.json()
    const assistants = await createAssistants()
    
    const responses = await Promise.all([
      assistants.DLPFC.analyze(inputText),
      assistants.VMPFC.analyze(inputText),
      assistants.OFC.analyze(inputText),
      assistants.MPFC.analyze(inputText),
      assistants.ACC.analyze(inputText),
      assistants.QLearning(inputText)
    ])

    const response = {
      DLPFC: responses[0],
      VMPFC: responses[1],
      OFC: responses[2],
      MPFC: responses[3],
      ACC: responses[4],
      QLearning: responses[5]
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error in /api/analyze:', error)
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 })
  }
}