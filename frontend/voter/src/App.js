import { useEffect, useState } from 'react';
import useServer from './components/useServer';
import TopBar from './components/TopBar';
import Login from './components/Login';
import Vote from './components/Vote';
import Success from './components/Success';
import ip from "./constants/backend_ip.json"; // The relative path to your File

const url = "http://" + ip["ip"] + ":8006";

function App() {
  document.body.style.overflow = "hidden" //This app is meant to fit the screen, this prevents the scrollbar from showing for the entire app (individual components may be scrollable)

  const [server, setServer] = useServer(url);
  useEffect(() => {
    if(server === "Error")
      setServer("Retry")
  }, [server, setServer])

  const [login, setLogin] = useState({"active" : false, "name" : "", "location" : ""})
  const [verifierID, setVerifierID] = useState("")

  const [darkMode, setDarkMode] = useState(false); //Default is false
  
  if(!server || server === false || server === "Error" || server === "Retry") {//Loading page while frontend is fetching server data
    return (
      <header id='App' className='h-screen w-screen flex flex-col'>
        <section id="loading" className="m-auto text-center">
          <h1 className='font-bold text-2xl md:text-4xl'>Loading Election</h1>
          {(server === "Error" || server === "Retry") && <p className='font-bold text-red-700 text-lg md:text-2xl animate-pulse'>Failed to get election data, retrying...</p>}
        </section>
      </header>
    );
  }

  return (
      <header id='App' className={`h-screen w-screen transition-colors duration-500 ${darkMode && 'dark bg-slate-800'}`}>
        <TopBar darkMode={darkMode} setDarkMode={setDarkMode} login={login} setLogin={setLogin}/>
        {login["active"] === false ? <Login url={url} setLogin={setLogin}/> : verifierID === "" ? <Vote contests={server["contests"]} url={url} login={login} setLogin={setLogin} verifierID={verifierID} setVerifierID={setVerifierID } /> : <Success verifierID={verifierID} setVerifierID={setVerifierID} login={login} setLogin={setLogin} />}
        
      </header>
  );
};

export default App;
