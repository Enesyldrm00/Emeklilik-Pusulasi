import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormStep1 from './FormStep1'
import FormStep2 from './FormStep2'
import FormStep3 from './FormStep3'

const STEPS = ['Kişisel', 'Sigorta', 'Tasarruf']

const defaultData = {
  personalInfo: { birthDate: '', gender: '', city: '' },
  insuranceInfo: { type: '', startDate: '', totalPrimDays: '', averageMonthlyWage: '', militaryService: false, maternityLeave: false },
  savingsInfo: { hasBES: false, besMonthlyContribution: 0, joinTES: false, extraSavings: 0, targetRetirementAge: 60 }
}

function validateStep(step, data) {
  if (step === 0) {
    if (!data.personalInfo.birthDate) return 'Doğum tarihi gerekli'
    if (!data.personalInfo.gender) return 'Cinsiyet seçiniz'
    const age = new Date().getFullYear() - new Date(data.personalInfo.birthDate).getFullYear()
    if (age < 18 || age > 70) return 'Yaş 18-70 arasında olmalı'
  }
  if (step === 1) {
    if (!data.insuranceInfo.type) return 'Sigorta türü seçiniz'
    if (!data.insuranceInfo.startDate) return 'Sigorta giriş tarihi gerekli'
    if (new Date(data.insuranceInfo.startDate) >= new Date()) return 'Sigorta tarihi bugünden önce olmalı'
    if (!data.insuranceInfo.totalPrimDays && data.insuranceInfo.totalPrimDays !== 0) return 'Prim günü gerekli'
    if (data.insuranceInfo.totalPrimDays < 0 || data.insuranceInfo.totalPrimDays > 15000) return 'Prim günü 0-15000 arasında olmalı'
    if (!data.insuranceInfo.averageMonthlyWage || data.insuranceInfo.averageMonthlyWage <= 0) return 'Geçerli bir maaş giriniz'
  }
  return null
}

export default function UserInputForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState(defaultData)
  const [error, setError] = useState('')

  function updatePersonal(field, value) {
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }))
  }
  function updateInsurance(field, value) {
    setData(prev => ({ ...prev, insuranceInfo: { ...prev.insuranceInfo, [field]: value } }))
  }
  function updateSavings(field, value) {
    setData(prev => ({ ...prev, savingsInfo: { ...prev.savingsInfo, [field]: value } }))
  }

  function handleNext() {
    const err = validateStep(step, data)
    if (err) { setError(err); return }
    setError('')
    if (step < 2) setStep(step + 1)
  }

  function handleSubmit() {
    setError('')
    sessionStorage.setItem('retireFormData', JSON.stringify(data))
    navigate('/results')
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i < step ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-blue-700' : i < step ? 'text-green-700' : 'text-gray-400'}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {step === 0 && <FormStep1 data={data.personalInfo} onChange={updatePersonal} />}
        {step === 1 && <FormStep2 data={data.insuranceInfo} onChange={updateInsurance} gender={data.personalInfo.gender} />}
        {step === 2 && <FormStep3 data={data.savingsInfo} onChange={updateSavings} />}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={() => { setStep(step - 1); setError('') }}
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Geri
            </button>
          )}
          {step < 2 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              İleri
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Analizi Başlat
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
