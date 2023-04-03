//import Template from "./components/Template";
import Verifier from "./components/verifier";
import useServer from "./components/useServer";
import Results from "./components/Results";
import { useEffect, useState } from "react";

const url = "http://192.168.50.83:8006";

function App() {

  const defaultVals = {
    "verify_code": { "display": "Verification Code", "placeholder": "Verification Code", "value": "", "required": true, "error": "" },
    "vote_time": { "display": "Time of Vote", "placeholder": "Verification Code", "value": "", "required": false, "error": "" },
    "location": { "display": "Location of Vote", "placeholder": "Verification Code", "value": "fff", "required": false, "error": "" },
    "spoiled": { "display": "is Vote Spoiled", "placeholder": "Verification Code", "value": "", "required": false, "error": "" },
  }

  const [server, setServer] = useServer(url);
  useEffect(() => {
    if (server === "Error")
      setServer("Retry")
  }, [server, setServer])

  const [show, setShow] = useState("verifier");
  const [fields,setFields] = useState(defaultVals)
  const [error, setError] = useState("") //Variable used to set the error message above the submit button.
  
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
      {show === "verifier" 
      ? <Verifier setShow={setShow} url={url} fields={fields} setFields={setFields} defaultVals={defaultVals} error={error} setError={setError}/> : <Results setShow={setShow} url={url} fields={fields} setFields={setFields} error={error} defaultVals={defaultVals}/> }
    </header>
  );
}

export default App;
