const PRIORITY_COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-gray-400']

export default function ActionPlan({ actionPlan, tesSuggestion, besSuggestion }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Aksiyon Planı</h3>

      {/* TES & BES suggestions */}
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {tesSuggestion && (
          <div className={`rounded-xl p-3 border ${tesSuggestion.shouldJoin ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
            <p className="text-xs font-semibold text-gray-700 mb-1">TES 2026</p>
            <p className={`text-xs font-bold ${tesSuggestion.shouldJoin ? 'text-amber-700' : 'text-gray-600'}`}>
              {tesSuggestion.shouldJoin ? 'Katılım önerilir' : 'Katılım önerilmez'}
            </p>
            <p className="text-xs text-gray-500 mt-1">{tesSuggestion.reason}</p>
            {tesSuggestion.monthlyDeduction > 0 && (
              <p className="text-xs text-amber-600 mt-1 font-medium">Aylık kesinti: {tesSuggestion.monthlyDeduction?.toLocaleString('tr-TR')} TL</p>
            )}
          </div>
        )}
        {besSuggestion && (
          <div className="rounded-xl p-3 bg-blue-50 border border-blue-200">
            <p className="text-xs font-semibold text-gray-700 mb-1">BES Önerisi</p>
            <p className="text-xs font-bold text-blue-700">Aylık {besSuggestion.monthlyAmount?.toLocaleString('tr-TR')} TL</p>
            <p className="text-xs text-gray-500 mt-1">{besSuggestion.reason}</p>
            {besSuggestion.stateContribution > 0 && (
              <p className="text-xs text-blue-600 mt-1 font-medium">Devlet katkısı: {besSuggestion.stateContribution?.toLocaleString('tr-TR')} TL/yıl</p>
            )}
          </div>
        )}
      </div>

      {/* Action list */}
      {actionPlan && actionPlan.length > 0 && (
        <div className="space-y-3">
          {actionPlan.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className={`w-6 h-6 rounded-full ${PRIORITY_COLORS[Math.min(i, PRIORITY_COLORS.length - 1)]} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                {item.priority || i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.action}</p>
                <div className="flex gap-3 mt-0.5 text-xs text-gray-500">
                  {item.deadline && <span>Son: {item.deadline}</span>}
                  {item.impact && <span className="text-blue-600">{item.impact}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
