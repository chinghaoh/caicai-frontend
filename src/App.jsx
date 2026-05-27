import SessionExpiredModal from './components/ui/SessionExpiredModal'
import LoadingSpinner from './components/ui/LoadingSpinner'
import Input from './components/ui/Input'
function App() {
  return (
    <div className="min-h-screen bg-bg-page text-text-primary">
      <p className="p-4">Caicai</p>
      <Input label="Email" type="email" value="" onChange={() => {}} placeholder="Enter your email" error="" disabled={false} />
    </div>
  )
}

export default App