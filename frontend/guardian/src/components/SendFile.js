import { useState } from "react";

const SendFile = ({ url }) => {

    const [file, setFile] = useState()
    const [serverResponse, setResponse] = useState("")

    const handleChange = (e) => {
        if (e.target.files)
            setFile(e.target.files[0])
    }

    const handleSubmit = () => {
        if (!file || file.type !== "application/json") return

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

    return (
        <div className="flex flex-col space-y-12">

            <h1 className="text-xl font-bold">Chosen File: {file !== undefined ? file.name : "None"}</h1>

            <div className="flex flex-row space-x-4">
                <label for="file-upload" className="border-2 border-black cursor-pointer text-lg rounded-full p-4 betterhover:hover:bg-slate-300 transition-colors duration-300">
                    Choose Manifest File
                </label>
                <input id="file-upload" type="file" accept=".json" className="hidden" onChange={handleChange} />
                <button onClick={handleSubmit} className="border-2 border-black text-lg cursor-pointer rounded-full p-4 betterhover:hover:bg-slate-300 transition-colors duration-300">Upload File</button>
            </div>

            <p className="text-lg font-bold">{serverResponse}</p>
        </div>
    )
}

export default SendFile