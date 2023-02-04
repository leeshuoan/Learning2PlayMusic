import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThemeProvider from './theme/index'
import PrivateRoutes from './components/utils/PrivateRoutes'
// App components
import DefaultAppBar from './components/AppBar/DefaultAppBar'
import SignIn from './components/SignIn'
// Amplify setup
import aws_exports from './aws-exports';
import { Amplify } from 'aws-amplify'
import { Auth } from 'aws-amplify';
Amplify.configure(aws_exports);

function App() {
  const [role, setRole] = useState("home");

  const handleSetRole = (role) => {
    setRole(role)
  }

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((user) => {
      console.log(user)
      user.getSession((err, session) => {
        if (err) {
          console.log(err);
          setRole("home")
        }
        let userRole = session.getIdToken().payload["userRole"];
        console.log(userRole)
        const roles = ["Admin", "Teacher"]
        if (roles.includes(userRole)) {
          setRole(userRole)
        } else {
          setRole("Home")
        }
      })
    })
  }, [])

  return (
    <div className="App">
      <ThemeProvider>
        <DefaultAppBar role={role} handleResetRoles={() => handleSetRole("home")} />
        <ToastContainer />
        <Routes>
          <Route path="/">
            <Route index element={<SignIn handleSetRole={handleSetRole} />} />
          </Route>
          <Route path="admin" element={<PrivateRoutes userType="Admin"></PrivateRoutes>}>

          </Route>
          <Route path="teacher" element={<PrivateRoutes userType="Teacher"></PrivateRoutes>}>
            
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
