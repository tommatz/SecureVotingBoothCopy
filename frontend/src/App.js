import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Template from './components/Template';
import TopBar from './components/TopBar';

function App() {
  return (
    <BrowserRouter>
      <header id='App' className='bg-neutral-400 h-screen w-full'>
        <TopBar />
        <Routes>
          <Route path='/' element={<Template />}></Route>
        </Routes>
      </header>
    </BrowserRouter>
  )
}

export default App;
