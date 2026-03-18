"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2, Database, Image, History, Sparkles } from "lucide-react"

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message?: string
}

export function LogoTestPanel() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const runTests = async () => {
    setTesting(true)
    const testResults: TestResult[] = []

    // Test 1: API Logo Settings
    try {
      const response = await fetch('/api/settings/logo')
      if (response.ok) {
        testResults.push({
          name: 'API Logo Settings',
          status: 'success',
          message: 'Endpoint accessible'
        })
      } else {
        testResults.push({
          name: 'API Logo Settings',
          status: 'error',
          message: `Erreur ${response.status}`
        })
      }
    } catch (error) {
      testResults.push({
        name: 'API Logo Settings',
        status: 'error',
        message: 'Endpoint inaccessible'
      })
    }

    setResults([...testResults])
    await new Promise(resolve => setTimeout(resolve, 500))

    // Test 2: API History
    try {
      const response = await fetch('/api/settings/logo/history')
      if (response.ok || response.status === 401) {
        testResults.push({
          name: 'API History',
          status: 'success',
          message: 'Endpoint accessible (auth requise)'
        })
      } else {
        testResults.push({
          name: 'API History',
          status: 'error',
          message: `Erreur ${response.status}`
        })
      }
    } catch (error) {
      testResults.push({
        name: 'API History',
        status: 'error',
        message: 'Endpoint inaccessible'
      })
    }

    setResults([...testResults])
    await new Promise(resolve => setTimeout(resolve, 500))

    // Test 3: Image Optimizer
    try {
      const { optimizeImage } = await import('@/lib/image-optimizer')
      testResults.push({
        name: 'Image Optimizer',
        status: 'success',
        message: 'Module chargé'
      })
    } catch (error) {
      testResults.push({
        name: 'Image Optimizer',
        status: 'error',
        message: 'Module non disponible'
      })
    }

    setResults([...testResults])
    await new Promise(resolve => setTimeout(resolve, 500))

    // Test 4: Favicon Generator
    try {
      const { generateFavicon } = await import('@/lib/image-optimizer')
      testResults.push({
        name: 'Favicon Generator',
        status: 'success',
        message: 'Module chargé'
      })
    } catch (error) {
      testResults.push({
        name: 'Favicon Generator',
        status: 'error',
        message: 'Module non disponible'
      })
    }

    setResults([...testResults])
    setTesting(false)
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-xl font-bold">Tests du Système Logo</h2>
        </div>
        <Button
          onClick={runTests}
          disabled={testing}
          className="gap-2"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Tests en cours...
            </>
          ) : (
            'Lancer les tests'
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 p-4 rounded-xl border
                ${result.status === 'success' 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : result.status === 'error'
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-secondary border-border'
                }
              `}
            >
              {result.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              ) : result.status === 'error' ? (
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="font-medium">{result.name}</p>
                {result.message && (
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                )}
              </div>

              {result.name === 'API Logo Settings' && <Database className="w-4 h-4 text-muted-foreground" />}
              {result.name === 'API History' && <History className="w-4 h-4 text-muted-foreground" />}
              {result.name === 'Image Optimizer' && <Image className="w-4 h-4 text-muted-foreground" />}
              {result.name === 'Favicon Generator' && <Sparkles className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !testing && (
        <div className="text-center py-12 text-muted-foreground">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Cliquez sur "Lancer les tests" pour vérifier le système</p>
        </div>
      )}

      {results.length > 0 && !testing && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {results.filter(r => r.status === 'success').length} / {results.length} tests réussis
            </p>
            {results.every(r => r.status === 'success') && (
              <p className="text-sm text-green-500 font-medium">
                ✅ Système opérationnel
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
