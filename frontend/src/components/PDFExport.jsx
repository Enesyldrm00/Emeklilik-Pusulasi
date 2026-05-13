import { useState } from 'react'

export default function PDFExport({ results }) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')

      const doc = new jsPDF()
      const { agent1, agent2, agent3 } = results
      const scenarios = agent2?.scenarios || []
      const now = new Date().toLocaleDateString('tr-TR')

      // Header
      doc.setFillColor(37, 99, 235)
      doc.rect(0, 0, 210, 30, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('RetireSmart TR', 14, 18)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Emeklilik Analiz Raporu - ${now}`, 14, 25)

      doc.setTextColor(0, 0, 0)
      let y = 40

      // Legal summary
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('Hukuki Durum', 14, y)
      y += 7
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      if (agent1?.retirementAge) {
        doc.text(`Emeklilik Yasi: ${agent1.retirementAge}`, 14, y); y += 6
      }
      if (agent1?.retirementDate) {
        doc.text(`Tahmini Emeklilik Yili: ${agent1.retirementDate}`, 14, y); y += 6
      }
      if (agent1?.primDayStatus) {
        doc.text(`Prim Gun Durumu: ${agent1.primDayStatus} (${agent1.primDayDifference > 0 ? '+' : ''}${agent1.primDayDifference} gun)`, 14, y); y += 6
      }
      if (agent1?.isEYT) {
        doc.text('EYT Kapsami: Evet (yas sarti yok)', 14, y); y += 6
      }
      y += 4

      // Scenarios table
      if (scenarios.length > 0) {
        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.text('3 Emeklilik Senaryosu', 14, y)
        y += 5

        autoTable(doc, {
          startY: y,
          head: [['Senaryo', 'Emeklilik Yasi', 'Yil', 'SGK (TL)', 'BES (TL)', 'Toplam (TL)', 'Risk']],
          body: scenarios.map(s => [
            s.name,
            s.retirementAge,
            s.retirementYear,
            (s.monthlyPension?.sgk || 0).toLocaleString('tr-TR'),
            (s.monthlyPension?.bes || 0).toLocaleString('tr-TR'),
            (s.monthlyPension?.total || 0).toLocaleString('tr-TR'),
            s.riskLevel || '-'
          ]),
          styles: { fontSize: 9 },
          headStyles: { fillColor: [37, 99, 235] },
          alternateRowStyles: { fillColor: [239, 246, 255] }
        })
        y = doc.lastAutoTable.finalY + 10
      }

      // Recommendation
      if (agent3?.recommendation) {
        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.text('Oneri', 14, y)
        y += 7
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(agent3.recommendation, 180)
        doc.text(lines, 14, y)
        y += lines.length * 5 + 6
      }

      // Action plan
      if (agent3?.actionPlan && agent3.actionPlan.length > 0) {
        if (y > 240) { doc.addPage(); y = 20 }
        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.text('Aksiyon Plani', 14, y)
        y += 5

        autoTable(doc, {
          startY: y,
          head: [['Once.', 'Aksiyon', 'Son Tarih', 'Etki']],
          body: agent3.actionPlan.map(a => [a.priority, a.action, a.deadline || '-', a.impact || '-']),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [37, 99, 235] },
          columnStyles: { 1: { cellWidth: 80 } }
        })
        y = doc.lastAutoTable.finalY + 10
      }

      // Disclaimer
      if (y > 260) { doc.addPage(); y = 20 }
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Bu rapor bilgilendirme amaclidir. Kesin sonuclar icin SGK\'ya basvurun.', 14, y)
      doc.text('Hesaplamalar 5510 Sayili Kanun ve 2026 katsayilarina gore yapilmistir.', 14, y + 5)

      doc.save(`retiresmart-rapor-${Date.now()}.pdf`)
    } catch (err) {
      console.error('PDF export hatasi:', err)
      alert('PDF oluşturulurken hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )}
      {loading ? 'PDF Hazırlanıyor...' : 'PDF Raporu İndir'}
    </button>
  )
}
