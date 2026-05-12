import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import AgentProgress from '../components/AgentProgress'
import ResultsDashboard from '../components/Results/ResultsDashboard'

export default function Results() {
  const navigate = useNavigate()
  const [currentAgent, setCurrentAgent] = useState(1)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('retireFormData')
    if (!raw) { navigate('/calculate'); return }

    const formData = JSON.parse(raw)

    let agentTimer1, agentTimer2

    async function fetchResults() {
      try {
        // Simulate agent 1 visible progress
        agentTimer1 = setTimeout(() => setCurrentAgent(2), 8000)
        agentTimer2 = setTimeout(() => setCurrentAgent(3), 18000)

        const response = await axios.post('/api/calculate', formData, { timeout: 120000 })

        clearTimeout(agentTimer1)
        clearTimeout(agentTimer2)
        setCurrentAgent(4)

        await new Promise(r => setTimeout(r, 600))
        setResults(response.data)
      } catch (err) {
        clearTimeout(agentTimer1)
        clearTimeout(agentTimer2)
        const msg = err.response?.data?.error || 'Hesaplama sırasında hata oluştu. Lütfen tekrar deneyin.'
        setError(msg)
      }
    }

    fetchResults()
    return () => { clearTimeout(agentTimer1); clearTimeout(agentTimer2) }
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Hata Oluştu</h2>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => navigate('/calculate')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Analiz Yapılıyor</h1>
            <p className="text-gray-500 text-sm">3 yapay zeka ajanı sırayla çalışıyor</p>
          </div>
          <AgentProgress currentAgent={currentAgent} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ResultsDashboard results={results} />
    </div>
  )
}
