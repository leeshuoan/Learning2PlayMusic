import { useState } from 'react'
import './App.css'
import DefaultAppBar from './components/AppBar/DefaultAppBar'
import SignIn from './components/SignIn'
import ThemeProvider from './theme/index'

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <ThemeProvider>
        <DefaultAppBar />
        <SignIn />
      </ThemeProvider>
    </div>
  );
}

export default App;
