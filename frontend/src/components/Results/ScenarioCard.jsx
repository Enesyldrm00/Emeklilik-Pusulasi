import { formatTL } from '../../utils/sgkCalculator'

const RISK_COLORS = {
  'düşük': 'bg-green-100 text-green-700',
  'orta': 'bg-yellow-100 text-yellow-700',
  'yüksek': 'bg-red-100 text-red-700'
}

export default function ScenarioCard({ scenario, isRecommended }) {
  const { monthlyPension = {} } = scenario
  const total = monthlyPension.total || (monthlyPension.sgk || 0) + (monthlyPension.bes || 0) + (monthlyPension.tes || 0)

  return (
    <div className={`relative bg-white rounded-2xl border-2 p-5 flex flex-col gap-4 transition-shadow ${isRecommended ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200 shadow-sm'}`}>
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          <span>Önerilen</span>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Senaryo {scenario.id}</p>
        <h3 className="text-lg font-bold text-gray-900">{scenario.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">Emeklilik: {scenario.retirementAge} yaş ({scenario.retirementYear})</span>
          {scenario.riskLevel && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RISK_COLORS[scenario.riskLevel] || 'bg-gray-100 text-gray-600'}`}>
              {scenario.riskLevel} risk
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-2">Aylık Toplam Gelir</p>
        <p className={`text-2xl font-bold ${isRecommended ? 'text-blue-700' : 'text-gray-900'}`}>{formatTL(total)}</p>
        <div className="mt-3 space-y-1.5">
          {monthlyPension.sgk > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">SGK Maaşı</span>
              <span className="font-medium text-gray-700">{formatTL(monthlyPension.sgk)}</span>
            </div>
          )}
          {monthlyPension.bes > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">BES Geliri</span>
              <span className="font-medium text-gray-700">{formatTL(monthlyPension.bes)}</span>
            </div>
          )}
          {monthlyPension.tes > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">TES Geliri</span>
              <span className="font-medium text-gray-700">{formatTL(monthlyPension.tes)}</span>
            </div>
          )}
        </div>
      </div>

      {scenario.pros && scenario.pros.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-green-700 mb-1.5">Artılar</p>
          <ul className="space-y-1">
            {scenario.pros.slice(0, 3).map((p, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>{p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {scenario.cons && scenario.cons.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-600 mb-1.5">Eksiler</p>
          <ul className="space-y-1">
            {scenario.cons.slice(0, 3).map((c, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <span className="text-red-400 mt-0.5 flex-shrink-0">−</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
