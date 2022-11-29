import { useState } from "react";
import SendFile from "./SendFile"
import TopBar from "./TopBar"

const Upload = ({ url, setShow }) => {
    const [send, setSend] = useState({"Close":false, "keep":true});

    const complete = () => { /// need to fix
        setShow({"landing": true, "tally": false, "upload": false});
        return(<></>)
    }
    return (
        <section id="upload" className="h-full w-full">
            <TopBar />

            <section id="upload-content" className="h-[90%] w-full flex flex-col">
                <div className="m-auto text-center space-y-12"> {/* This div is needed to center the items inside it using m-auto (margins auto) */}
                    <h1 className="text-4xl font-bold">Manifest Upload Page</h1>
                    <SendFile url={url} setSend={setSend} />
                    {send["Close"] === true && send["keep"] === false ? complete : <></>}
                </div>
            </section>

            <section id="bottombar" className="h-[5%] w-full flex flex-row-reverse items-center bg-green-600 border-t-4 border-black"></section>
        </section>
    )
}

export default Upload