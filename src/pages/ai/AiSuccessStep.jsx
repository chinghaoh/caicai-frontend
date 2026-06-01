import { Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function AiSuccessStep({ onDashboard, onSuggestAgain }) {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="w-14 h-14 rounded-full bg-green/10 flex items-center justify-center">
        <Sparkles size={28} className="text-green" />
      </div>
      <div>
        <h1 className="text-lg font-bold text-text-primary">Goals updated</h1>
        <p className="text-sm text-text-muted mt-2">
          Your new targets are active from today.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Button fullWidth onClick={onDashboard}>
          Go to Dashboard
        </Button>
        <Button variant="secondary" fullWidth onClick={onSuggestAgain}>
          Suggest Again
        </Button>
      </div>
    </div>
  )
}