import './App.css'
import MainApp from './index'
import SiteFooter from './components/SiteFooter.tsx'

function App() {
  return (
    <div className="flex min-h-[var(--fullvh)] flex-col bg-white text-slate-900">
      <MainApp />
      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  )
}

export default App
