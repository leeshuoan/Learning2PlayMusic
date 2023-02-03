import './App.css'
import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import ThemeProvider from './theme/index'
// App components
import DefaultAppBar from './components/AppBar/DefaultAppBar'
import SignIn from './components/SignIn'
// Amplify setup
import aws_exports from './aws-exports';
import { Amplify } from 'aws-amplify'
Amplify.configure(aws_exports);

function App() {
  const [role, setRole] = useState("home");

  const handleSetRole = (role) => {
    setRole(role)
  }

  return (
    <div className="App">
      <ThemeProvider>
        <DefaultAppBar role={role} handleResetRoles={() => handleSetRole("")} />
        <Routes>
          <Route path="/">
            <Route index element={<SignIn handleSetRole={handleSetRole} />} />
          </Route>
          <Route path="admin">
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
