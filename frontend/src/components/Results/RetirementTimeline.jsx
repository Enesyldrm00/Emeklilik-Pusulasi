import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatTL } from '../../utils/sgkCalculator'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-800 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.stroke }}>{p.name}</span>
          <span className="font-medium">{formatTL(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function RetirementTimeline({ scenarios }) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 25 }, (_, i) => currentYear + i * 2)

  const data = years.map(year => {
    const point = { year: String(year) }
    scenarios.forEach(s => {
      const retYear = s.retirementYear || currentYear + 20
      const total = s.monthlyPension?.total || (s.monthlyPension?.sgk || 0)
      point[s.name] = year >= retYear ? total : 0
    })
    return point
  })

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b']

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Emeklilik Zaman Çizelgesi</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {scenarios.map((s, i) => (
            <Line
              key={s.id}
              type="monotone"
              dataKey={s.name}
              stroke={COLORS[i]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
