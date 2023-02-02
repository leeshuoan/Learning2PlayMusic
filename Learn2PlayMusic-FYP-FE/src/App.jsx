<<<<<<< HEAD
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import DefaultAppBar from "./components/AppBar/DefaultAppBar";
=======
import { useState } from 'react'
import './App.css'
import DefaultAppBar from './components/AppBar/DefaultAppBar'
import ThemeProvider from './theme/index'
>>>>>>> c00274d846d41ce6bf5902c6bf5e09bae4cc5d97

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
<<<<<<< HEAD
      <DefaultAppBar />
=======
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
>>>>>>> c00274d846d41ce6bf5902c6bf5e09bae4cc5d97
    </div>
  );
}

export default App;
