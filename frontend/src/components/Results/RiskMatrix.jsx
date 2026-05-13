import { formatTL } from '../../utils/sgkCalculator'

const RISK_BG = {
  'düşük': 'bg-green-50 border-green-200',
  'orta': 'bg-yellow-50 border-yellow-200',
  'yüksek': 'bg-red-50 border-red-200'
}

const RISK_BADGE = {
  'düşük': 'bg-green-100 text-green-700',
  'orta': 'bg-yellow-100 text-yellow-700',
  'yüksek': 'bg-red-100 text-red-700'
}

const QUALITY_COLORS = {
  'yetersiz': 'text-red-600',
  'yeterli': 'text-yellow-600',
  'rahat': 'text-blue-600',
  'konforlu': 'text-green-600'
}

export default function RiskMatrix({ scenarios, lifeQuality }) {
  const qualityKeys = ['scenario1', 'scenario2', 'scenario3']

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Risk ve Yaşam Kalitesi Analizi</h3>
      <div className="space-y-3">
        {scenarios.map((s, i) => {
          const quality = lifeQuality?.[qualityKeys[i]] || ''
          return (
            <div key={s.id} className={`rounded-xl border p-4 ${RISK_BG[s.riskLevel] || 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {s.retirementAge} yaş · {s.retirementYear} · {formatTL(s.monthlyPension?.total || 0)}/ay
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {s.riskLevel && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${RISK_BADGE[s.riskLevel] || 'bg-gray-100 text-gray-600'}`}>
                      {s.riskLevel} risk
                    </span>
                  )}
                  {quality && (
                    <span className={`text-xs font-semibold capitalize ${QUALITY_COLORS[quality] || 'text-gray-600'}`}>
                      {quality}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Yaşam kalitesi referansı: İstanbul/Ankara tek kişi min 15.000 TL · 22.000 TL aile · 30.000 TL+ rahat
      </p>
    </div>
  )
}
