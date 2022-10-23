import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TopBar from './components/TopBar';
//import Template from './components/Template';
import Login from './components/Login';

function App() {

  const [darkMode, setDarkMode] = useState(false) //Default is false

  return (
    <BrowserRouter>
      <header id='App' className={`h-screen w-screen transition-colors duration-500  ${darkMode && 'dark bg-slate-800'}`}>
        <TopBar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <Routes>
          <Route path='/' element={<Login />}></Route>
        </Routes>
      </header>
    </BrowserRouter>
  )
}

export default App;
