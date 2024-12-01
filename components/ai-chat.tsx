"'use client'"

import { useState } from "'react'"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  role: "'user'" | "'assistant'"
  content: string
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("''")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "'user'", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("''")

    // Here you would typically call your AI API
    // For now, we'll use a dummy response
    setTimeout(() => {
      const aiMessage: Message = { 
        role: "'assistant'", 
        content: `Here's some information about SJSU related to "${input}": [AI-generated content would go here]`
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat with SJSU AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`p-2 rounded-lg ${message.role === "'user'" ? "'bg-blue-100 text-right'" : "'bg-gray-100'"}`}>
              {message.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Ask about SJSU..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  )
}

