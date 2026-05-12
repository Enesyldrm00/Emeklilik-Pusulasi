export default function FormStep3({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Tasarruf Bilgileri</h2>
        <p className="text-sm text-gray-500">BES ve TES durumunuzu girin</p>
      </div>

      {/* BES */}
      <div className="border border-gray-200 rounded-xl p-4 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.hasBES || false}
            onChange={e => onChange('hasBES', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <div>
            <span className="text-sm font-medium text-gray-800">BES'e katılıyorum (Bireysel Emeklilik)</span>
            <p className="text-xs text-gray-500">Devlet katkısı: %20 (yıllık tavan 5.400 TL)</p>
          </div>
        </label>
        {data.hasBES && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aylık BES Katkısı (TL)</label>
            <input
              type="number"
              value={data.besMonthlyContribution || ''}
              onChange={e => onChange('besMonthlyContribution', parseInt(e.target.value) || 0)}
              min={0}
              max={10000}
              placeholder="Örn: 500"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        )}
      </div>

      {/* TES */}
      <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.joinTES || false}
            onChange={e => onChange('joinTES', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded mt-0.5"
          />
          <div>
            <span className="text-sm font-medium text-gray-800">TES'e dahil olacağım (2026 Tamamlayıcı Emeklilik)</span>
            <p className="text-xs text-amber-700 mt-1">
              2026'da başlıyor · Brüt maaştan %3 kesinti (zorunlu, 4A çalışanları)
            </p>
          </div>
        </label>
        <div className="text-xs text-amber-600 pl-7 space-y-1">
          <p>• İşveren de %1 katkı sağlar</p>
          <p>• Sisteme girmeden çıkmak isteyenler 2026 bitmeden OKS'tan çıkmalı</p>
          <p>• Kısmi çıkış: evlilik, işsizlik, ilk konut veya ağır hastalıkta (%10-20)</p>
        </div>
      </div>

      {/* Ek birikim */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ek Birikim / Yatırım (TL/ay, opsiyonel)</label>
        <input
          type="number"
          value={data.extraSavings || ''}
          onChange={e => onChange('extraSavings', parseInt(e.target.value) || 0)}
          min={0}
          placeholder="Örn: 1000"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Hedef yaş */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hedef Emeklilik Yaşı: <span className="text-blue-600 font-semibold">{data.targetRetirementAge || 60}</span>
        </label>
        <input
          type="range"
          min={50}
          max={70}
          value={data.targetRetirementAge || 60}
          onChange={e => onChange('targetRetirementAge', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>50</span>
          <span>55</span>
          <span>60</span>
          <span>65</span>
          <span>70</span>
        </div>
      </div>
    </div>
  )
}
