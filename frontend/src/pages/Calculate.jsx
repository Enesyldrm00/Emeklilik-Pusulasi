import Header from '../components/Header'
import UserInputForm from '../components/Form/UserInputForm'

export default function Calculate() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emeklilik Hesaplama</h1>
          <p className="text-gray-500">3 adımda bilgilerinizi girin, yapay zeka analiz etsin</p>
        </div>
        <UserInputForm />
      </div>
    </div>
  )
}
