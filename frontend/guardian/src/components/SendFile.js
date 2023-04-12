import { useEffect, useRef, useState } from "react";

const SendFile = ({ url }) => {

    const [file, setFile] = useState()
    const [serverResponse, setResponse] = useState("")
    const [ceremony, setCeremony] = useState("")

    const debounce = useRef(false)
    const [ceremonys, setCeremonys] = useState("")
    useEffect(() => {
        const fetchData = async (type) => {
            try {
                const response = await fetch(url + type);
                const result = await response.json();
                return result;
            } catch (error) {
                console.error(error);
                return "Error";
            };
        };

        const getCeremonys = async () => {
            debounce.current = true
            const data = await fetchData("/guardian/get_all_ceremonys")
console.log(data)
            setCeremonys(data)
            debounce.current = false
        }

        if (!debounce.current)
            getCeremonys()
    }, [url])

    const handleChange = (e) => {
        const target = e.target
        if (!target.type)
            return

        if (target.type === 'select-one')
            setCeremony(target.value)
        else if (target.files)
            setFile(e.target.files[0])
    }

    const handleSubmit = () => {
        if (!file || file.type !== "application/json" || ceremony === "") return

        const data = new FormData();
        data.append("manifest", file, "manifest.json");

        fetch(url + "/guardian/setup_election", { method: 'POST', body: data })
            .then(async res => {
                const isJson = res.headers.get('content-type')?.includes('application/json');
                const data = isJson && await res.json();

                // check for error response
                if (!res.ok) {
                    // get error message from body or default to response status
                    const error = data || res.status;
                    return Promise.reject(error);
                }

                console.log(res)
                setResponse("Sucessfully uploaded " + file.name + " to the server!")
                return (res);
            })
            .catch(error => {
                console.error(error)
                setResponse("Unable to upload this file to the server!")
                return (error);
            });


    }

    if(ceremonys === ""){
        return (
            <section id="loading" className="m-auto text-center">
            <h1 className='font-bold text-2xl md:text-4xl'>Loading Ceremonys</h1>
            </section>
        )
    }

    return (
        <div className="flex flex-col overflow-hidden space-y-12">

            <select id="ceremony-select" type="select" value={ceremony} selected={ceremony} onChange={handleChange}
                className={("border-2 border-black cursor-pointer text-lg rounded-lg p-4 betterhover:hover:bg-slate-300 transition-colors duration-300") + (ceremony === "" ? " text-neutral-500" : " text-black")}>
                <option value="">Please select a ceremony</option>
                {ceremonys.map((c) => (
                    <option value={c.name}>{c.name}</option>
                ))}
            </select>

            <div className="flex flex-row space-x-4 items-center">

                <label for="file-upload" className="border-2 border-black cursor-pointer text-lg rounded-full p-4 betterhover:hover:bg-slate-300 transition-colors duration-300">
                    Choose Manifest File
                </label>
                <input id="file-upload" type="file" accept=".json" className="hidden" onChange={handleChange} />

                <h1 className="text-xl font-bold">Chosen File: {file !== undefined ? file.name : "None"}</h1>
            </div>
            <button onClick={handleSubmit} className="border-2 border-black text-lg cursor-pointer rounded-full p-4 betterhover:hover:bg-slate-300 transition-colors duration-300">Submit Election</button>
            <p className="text-lg font-bold">{serverResponse}</p>
        </div>
    )
}

export default SendFile