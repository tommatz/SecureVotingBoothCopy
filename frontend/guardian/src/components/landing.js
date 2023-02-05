import TopBar from "./TopBar"

function Landing({ setShow }) {
    return (
        <section id="Landing" className="h-full w-full">
            <TopBar />
            <section id="middle" className="h-[90%] w-full flex flex-col">
                <div className="m-auto space-y-12">
                    <div className="text-center text-4xl font-bold">
                        Select a page
                    </div>
                    <div className="text-center">
                    <button className="border-2 border-black text-lg cursor-pointer rounded-full p-4 betterhover:hover:bg-slate-300 transition-colors duration-300" onClick={() => setShow("keyCeremony")}>
                            Key Ceremony
                        </button>
                    </div>
                    <div className=" text-center ">
                        <button className="border-2 border-black text-lg cursor-pointer rounded-full p-4 betterhover:hover:bg-slate-300 transition-colors duration-300" onClick={() => setShow("upload")}>
                            Configure Election
                        </button>
                    </div>
                    <div className=" text-center">
                        <button className="border-2 border-black text-lg cursor-pointer rounded-full p-4 betterhover:hover:bg-slate-300 transition-colors duration-300" onClick={() => setShow("tally")}>Check Results</button>
                    </div>
                </div>
            </section>

            <section id="bottombar" className="h-[5%] w-full flex flex-row-reverse items-center bg-green-600 border-t-4 border-black"></section>
        </section>
    )
}

export default Landing