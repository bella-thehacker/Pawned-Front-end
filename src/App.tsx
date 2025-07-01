
import { Routes, Route } from "react-router-dom"
import './App.css'
import HomePage from "./components/HomePge"

import Continue from "./components/Continue"
import PlayRobot from "./components/PlayRobot"
import PlayHuman from "./components/PlayHuman"

function App() {
 

  return (
    <>
     <Routes>
       <Route path="/" element={<HomePage />} />
      <Route path="/continue" element={<Continue/>} />
      <Route path="/PlayRobot" element={<PlayRobot/>} />
      <Route path="/PlayHuman" element={<PlayHuman />} />
      </Routes>
    </>
  )
}

export default App
