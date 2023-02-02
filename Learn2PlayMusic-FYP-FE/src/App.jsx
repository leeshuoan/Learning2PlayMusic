import { useState } from 'react'
import './App.css'
import ThemeProvider from './theme/index'
import DefaultAppBar from './components/AppBar/DefaultAppBar'
import SignIn from './components/SignIn'
// Amplify setup
import aws_exports from './aws-exports';
import { Amplify } from 'aws-amplify'
Amplify.configure(aws_exports);

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
