'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MainApp() {
  const [inputText, setInputText] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const analyzeIssue = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      })
      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      console.error('Error:', error)
      setResponse('An error occurred while processing your request.')
    }
    setIsLoading(false)
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">SCANUE</h1>
      <div className="space-y-4">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe your issue."
          className="w-full"
        />
        <Button
          onClick={analyzeIssue}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </Button>
        {response && (
          <div className="p-4 mt-4 bg-gray-100 rounded-md">
            <pre className="whitespace-pre-wrap">{response}</pre>
          </div>
        )}
      </div>
    </div>
  )
}