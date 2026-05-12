const CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya',
  'Gaziantep', 'Şanlıurfa', 'Kocaeli', 'Mersin', 'Diyarbakır', 'Hatay',
  'Manisa', 'Kayseri', 'Samsun', 'Trabzon', 'Eskişehir', 'Denizli', 'Diğer'
]

export default function FormStep1({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Kişisel Bilgiler</h2>
        <p className="text-sm text-gray-500">Emeklilik yaşının doğru hesaplanması için gerekli</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Doğum Tarihi <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.birthDate || ''}
          onChange={e => onChange('birthDate', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          min="1950-01-01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Cinsiyet <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {[{ value: 'male', label: 'Erkek' }, { value: 'female', label: 'Kadın' }].map(opt => (
            <label key={opt.value} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${data.gender === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="radio"
                name="gender"
                value={opt.value}
                checked={data.gender === opt.value}
                onChange={e => onChange('gender', e.target.value)}
                className="sr-only"
              />
              <span className={`text-sm font-medium ${data.gender === opt.value ? 'text-blue-700' : 'text-gray-700'}`}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
        <select
          value={data.city || ''}
          onChange={e => onChange('city', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">Seçiniz (opsiyonel)</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <p className="text-xs text-gray-400 mt-1">Yaşam kalitesi tahmini için kullanılır</p>
      </div>
    </div>
  )
}
