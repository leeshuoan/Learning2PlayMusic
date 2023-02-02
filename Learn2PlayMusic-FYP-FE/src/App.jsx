import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import DefaultAppBar from "./components/AppBar/DefaultAppBar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <DefaultAppBar />
    </div>
  );
}

export default App;
