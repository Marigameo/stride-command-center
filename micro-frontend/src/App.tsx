import React from 'react'
import FederatedButton from './components/FederatedButton'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Micro Frontend - Federated Components
        </h1>
        
        <div className="space-y-4">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Federated Button Component</h2>
            <p className="text-muted-foreground mb-4">
              This is a standalone micro-frontend that exposes a shadcn Button component 
              via Vite Module Federation.
            </p>
            
            <div className="flex gap-4 flex-wrap">
              <FederatedButton />
              <FederatedButton variant="outline">Outline Button</FederatedButton>
              <FederatedButton variant="secondary" size="lg">Large Secondary</FederatedButton>
              <FederatedButton variant="destructive" size="sm">Small Destructive</FederatedButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
