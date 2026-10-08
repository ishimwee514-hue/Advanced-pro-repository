import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <img src={heroImg} className="base" width="170" height="179" alt="" />
        <img src={reactLogo} className="framework" alt="React logo" />
        <img src={viteLogo} className="vite" alt="Vite logo" />
      </section>

      <div className="content-panel">
        <h1>Ruta Smart Transport</h1>
        <p>Project structure repaired and the broken app paths fixed.</p>
        <button type="button" className="counter" onClick={() => setCount((value) => value + 1)}>
          Action count: {count}
        </button>
      </div>
    </main>
  )
}

export default App
