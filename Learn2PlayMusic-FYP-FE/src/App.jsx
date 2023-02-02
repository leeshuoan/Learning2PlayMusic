import { useState } from 'react'
import './App.css'
import DefaultAppBar from './components/AppBar/DefaultAppBar'
import ThemeProvider from './theme/index'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <ThemeProvider>
        <DefaultAppBar />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
      </ThemeProvider>
    </div>
  )
}

export default App
