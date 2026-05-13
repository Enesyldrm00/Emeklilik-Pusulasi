import ScenarioCard from './ScenarioCard'
import RetirementTimeline from './RetirementTimeline'
import PensionChart from './PensionChart'
import RiskMatrix from './RiskMatrix'
import ActionPlan from './ActionPlan'
import PDFExport from '../PDFExport'
import { formatTL } from '../../utils/sgkCalculator'

export default function ResultsDashboard({ results }) {
  const { agent1, agent2, agent3 } = results
  const scenarios = agent2?.scenarios || []
  const recommended = agent2?.recommendedScenario
  const legalBasis = agent1?.legalBasis || '5510 sayılı Kanun'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Hero summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <p className="text-blue-200 text-sm font-medium mb-1">Emeklilik Durumun</p>
        <div className="flex flex-wrap items-end gap-6">
          <div>
            {agent1?.retirementAge ? (
              <>
                <p className="text-3xl font-bold">{agent1.retirementAge} yaşında emekli olabilirsin</p>
                <p className="text-blue-200 text-sm mt-1">Tahmini yıl: {agent1.retirementDate}</p>
              </>
            ) : (
              <p className="text-2xl font-bold">EYT kapsamısın</p>
            )}
          </div>
          {agent1?.primDayStatus && (
            <div className={`rounded-xl px-4 py-2 text-sm font-semibold ${agent1.primDayStatus === 'yeterli' || agent1.primDayStatus === 'fazla' ? 'bg-green-500' : 'bg-red-500'}`}>
              Prim günü: {agent1.primDayStatus}
              {agent1.primDayDifference !== undefined && ` (${agent1.primDayDifference > 0 ? '+' : ''}${agent1.primDayDifference})`}
            </div>
          )}
        </div>
        {agent1?.isEYT && (
          <div className="mt-3 bg-blue-500 bg-opacity-50 rounded-lg px-3 py-2 text-sm">
            EYT kapsamındasın — 1999 öncesi sigortalısın, yaş şartı olmaksızın emekli olabilirsin.
          </div>
        )}
        {agent1?.warnings && agent1.warnings.length > 0 && (
          <div className="mt-3 space-y-1">
            {agent1.warnings.map((w, i) => (
              <p key={i} className="text-yellow-200 text-xs flex items-start gap-1">
                <span className="flex-shrink-0 mt-0.5">⚠</span> {w}
              </p>
            ))}
          </div>
        )}
        <p className="text-blue-300 text-xs mt-3">{legalBasis}</p>
      </div>

      {/* Motivational message */}
      {agent3?.motivationalMessage && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-gray-700 italic text-sm leading-relaxed">"{agent3.motivationalMessage}"</p>
          {agent3?.recommendation && (
            <p className="text-gray-600 text-sm mt-3">{agent3.recommendation}</p>
          )}
        </div>
      )}

      {/* 3 scenario cards */}
      {scenarios.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">3 Emeklilik Senaryosu</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {scenarios.map(s => (
              <ScenarioCard
                key={s.id}
                scenario={s}
                isRecommended={s.id === recommended}
              />
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      {scenarios.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-5">
          <PensionChart scenarios={scenarios} />
          <RetirementTimeline scenarios={scenarios} />
        </div>
      )}

      {/* Risk & action */}
      {scenarios.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-5">
          <RiskMatrix scenarios={scenarios} lifeQuality={agent3?.lifeQuality} />
          <ActionPlan
            actionPlan={agent3?.actionPlan}
            tesSuggestion={agent3?.tesSuggestion}
            besSuggestion={agent3?.besSuggestion}
          />
        </div>
      )}

      {/* Borrowing options */}
      {agent1?.borrowingOptions && agent1.borrowingOptions.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Borçlanma Seçeneklerin</h3>
          <ul className="space-y-2">
            {agent1.borrowingOptions.map((opt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>{opt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PDF Export */}
      <div className="flex justify-center pb-6">
        <PDFExport results={results} />
      </div>

      <p className="text-center text-xs text-gray-400 pb-8">
        Bu rapor bilgilendirme amaçlıdır. Kesin sonuçlar için SGK'ya başvurun. · 2026 mevzuatına göre hesaplanmıştır.
      </p>
    </div>
  )
}
