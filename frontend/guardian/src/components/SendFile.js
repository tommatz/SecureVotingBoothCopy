import { useState } from "react";

const SendFile = ({url}) => {

    const [file, setFile] = useState()

    const handleChange = (e) => {
        if (e.target.files) 
            setFile(e.target.files[0])
    }

    const handleSubmit = () => {
        if(!file || file.type !== "application/json") return

        const data = new FormData();
        data.append("manifest", file, "manifest.json");

        fetch( url + "/guardian/setup_election", {method:'POST', body: data} )
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
                return (res);
            })
            .catch(error => {
                console.error(error)
                return (error);
            });
    }

    return (
        <div>
            <input type="file" onChange={handleChange} />
            <button onClick={handleSubmit} className="border-2 border-black">Upload File</button>
        </div>
    )    
}

export default SendFile