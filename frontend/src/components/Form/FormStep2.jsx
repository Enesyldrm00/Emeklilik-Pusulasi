export default function FormStep2({ data, onChange, gender }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Sigorta Bilgileri</h2>
        <p className="text-sm text-gray-500">e-Devlet üzerinden öğrenebilirsiniz</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Sigorta Türü <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {[
            { value: '4A', label: '4A — SSK (Özel Sektör İşçisi)' },
            { value: '4B', label: '4B — Bağ-Kur (Esnaf / Serbest Meslek)' },
            { value: '4C', label: '4C — Emekli Sandığı (Devlet Memuru)' },
          ].map(opt => (
            <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${data.type === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="radio"
                name="insuranceType"
                value={opt.value}
                checked={data.type === opt.value}
                onChange={e => onChange('type', e.target.value)}
                className="text-blue-600"
              />
              <span className={`text-sm font-medium ${data.type === opt.value ? 'text-blue-700' : 'text-gray-700'}`}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İlk Sigorta Giriş Tarihi <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.startDate || ''}
          onChange={e => onChange('startDate', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          min="1970-01-01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Toplam Prim Gün Sayısı <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={data.totalPrimDays || ''}
          onChange={e => onChange('totalPrimDays', parseInt(e.target.value) || 0)}
          min={0}
          max={15000}
          placeholder="Örn: 6500"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
        <p className="text-xs text-gray-400 mt-1">e-Devlet'te "Hizmet Dökümü"nden öğrenebilirsiniz (0 — 15.000 arası)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Aylık Ortalama Brüt Maaş (TL) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={data.averageMonthlyWage || ''}
          onChange={e => onChange('averageMonthlyWage', parseInt(e.target.value) || 0)}
          min={1}
          placeholder="Örn: 12000"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Borçlanma (opsiyonel)</label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.militaryService || false}
            onChange={e => onChange('militaryService', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">Askerlik borçlanması yaptım / yapacağım</span>
        </label>
        {gender === 'female' && (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.maternityLeave || false}
              onChange={e => onChange('maternityLeave', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Doğum borçlanması yaptım / yapacağım</span>
          </label>
        )}
      </div>
    </div>
  )
}
