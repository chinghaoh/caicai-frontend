import Button from './components/ui/Button'

function App() {
  return (
    <div className="min-h-screen bg-bg-page text-text-primary">
      <p className="p-4">Caicai</p>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Delete</Button>
      <Button variant="primary" loading>Loading</Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button variant="primary" fullWidth>Full Width</Button>
    </div>
  )
}

export default App