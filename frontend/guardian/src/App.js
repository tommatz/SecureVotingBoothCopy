import useServer from "./components/useServer";
import Tally from "./components/Tally";
import Upload from "./components/Upload";
import Landing from "./components/landing";
import KeyCeremony from "./components/KeyCeremony"

//import Template from "./components/Template";
import { useEffect, useState } from "react";

const url = "http://localhost:8006";

function App() {

  const [server, setServer] = useServer(url);
  useEffect(() => {
    if (server === "Error")
      setServer("Retry")
  }, [server, setServer])

  const [show, setShow] = useState("landing");

  if (!server || server === false || server === "Error" || server === "Retry") {//Loading page while frontend is fetching server data
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
    <header id="App" className="h-screen w-screen">
      {/*Object.keys(server["contests"]).length !== 0 ? <Tally contests={server["contests"]} url={url} /> : <Upload url={url} />*/}
      {show === "landing" ? <Landing setShow={setShow} /> : show === "upload" ? <Upload url={url} setShow={setShow} /> : show === "tally" ? <Tally contests={server["contests"]} url={url} setShow={setShow} /> : <KeyCeremony setShow={setShow} url={url}/> }
    </header>
  );
}

export default App;
