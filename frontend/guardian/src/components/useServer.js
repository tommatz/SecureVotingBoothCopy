import { useState, useEffect, useRef } from 'react'

const useServer = (url) => {
 
    const loaded = useRef(false);
    const [server, setServer] = useState(false); //Default is false
    useEffect(() => {
        const fetchData = async (type) => {
            try {
                const response = await fetch(url + type);
                const result = await response.json();
                //console.log(result);
                return result;
            } catch(error) {
                console.error(error);
                return "Error";
            };
        };

        const getElection = async () => {
            loaded.current = true;

            if(server === "Retry" || server === "Error")
                await new Promise( res => setTimeout(res, 2000) );//Two second delay to slow down fetch spamming

            const setup = await fetchData("/voter/get_setup")
            if(typeof(setup) !== 'object' || "contests" in setup === false){loaded.current = false; setServer(setup); return;} //Ensure that the data was received correctly

            let contests = {}; //Variable to change the backend contests data to the schema used by the frontend
            for(let i = 0; i < setup["contests"].length; i++)
                if(setup["contests"][i]["type"] !== null && setup["contests"][i]["ballot_selections"] !== null)
                    contests = {...contests, [setup["contests"][i]["type"]] : setup["contests"][i]["ballot_selections"]};

            let final = { //variable used to set the server variable
                "contests" : contests
            };

            //console.log(final);
            setServer(final);
        }

        if(!loaded.current)
            getElection();
    }, [server, url])

  return ([server, setServer]);
}

export default useServer