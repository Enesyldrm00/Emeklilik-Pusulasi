import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatTL } from '../../utils/sgkCalculator'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-800 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.fill }}>{p.name}</span>
          <span className="font-medium">{formatTL(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function PensionChart({ scenarios }) {
  const data = scenarios.map(s => ({
    name: s.name,
    SGK: s.monthlyPension?.sgk || 0,
    BES: s.monthlyPension?.bes || 0,
    TES: s.monthlyPension?.tes || 0,
  }))

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Aylık Maaş Karşılaştırması</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="SGK" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="BES" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="TES" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
