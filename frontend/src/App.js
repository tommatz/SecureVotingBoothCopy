import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TopBar from './components/TopBar';
import Login from './components/Login';
import Vote from './components/Vote';

function App() {
  document.body.style.overflow = "hidden" //This app is meant to fit the screen, this prevents the scrollbar from showing for the entire app (individual components may be scrollable)

  const [darkMode, setDarkMode] = useState(false) //Default is false

  return (
    <BrowserRouter>
      <header id='App' className={`h-screen w-screen transition-colors duration-500 ${darkMode && 'dark bg-slate-800'}`}>
        <TopBar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/vote' element={<Vote />}></Route>
        </Routes>
      </header>
    </BrowserRouter>
  )
}

export default App;
