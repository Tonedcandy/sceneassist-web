import './App.css'
import MainApp from './index'
import SiteFooter from './components/SiteFooter.tsx'
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="flex min-h-[var(--fullvh)] flex-col text-slate-900">
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* global footer */}
      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
}

export default App
