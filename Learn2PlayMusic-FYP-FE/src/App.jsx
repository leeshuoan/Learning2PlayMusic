import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThemeProvider from './theme/index'
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
        const newRole = userRole == "Admin" ? "admin" : "Teacher" ? "teacher" :"home"
        setRole(newRole)
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
          <Route path="admin">
          </Route>
          <Route path="teacher">
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
