const AGENTS = [
  { id: 1, label: 'Ajan 1: Hukuki Analiz', desc: 'SGK mevzuatı inceleniyor, emeklilik hakkı hesaplanıyor...' },
  { id: 2, label: 'Ajan 2: Mali Hesaplama', desc: '3 senaryo üretiliyor, maaş projeksiyonları yapılıyor...' },
  { id: 3, label: 'Ajan 3: Kişisel Danışmanlık', desc: 'Kişisel tavsiye ve aksiyon planı oluşturuluyor...' },
]

export default function AgentProgress({ currentAgent }) {
  return (
    <div className="max-w-lg mx-auto space-y-5">
      <p className="text-center text-gray-500 text-sm mb-6">Yapay zeka ajanları çalışıyor, lütfen bekleyin...</p>
      {AGENTS.map((agent) => {
        const isDone = currentAgent > agent.id
        const isActive = currentAgent === agent.id
        const isPending = currentAgent < agent.id

        return (
          <div key={agent.id} className={`rounded-xl border p-4 transition-all duration-500 ${isActive ? 'border-blue-400 bg-blue-50' : isDone ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center gap-3 mb-2">
              {isDone ? (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : isActive ? (
                <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin flex-shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
              )}
              <span className={`text-sm font-semibold ${isActive ? 'text-blue-700' : isDone ? 'text-green-700' : 'text-gray-400'}`}>
                {agent.label}
              </span>
            </div>
            {isActive && (
              <>
                <p className="text-xs text-blue-600 pl-9 mb-2">{agent.desc}</p>
                <div className="pl-9">
                  <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-progress" style={{ width: '60%' }} />
                  </div>
                </div>
              </>
            )}
            {isDone && (
              <p className="text-xs text-green-600 pl-9">Tamamlandı</p>
            )}
            {isPending && (
              <p className="text-xs text-gray-400 pl-9">Bekliyor...</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
