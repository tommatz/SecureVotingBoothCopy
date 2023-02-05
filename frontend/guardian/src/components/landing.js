import TopBar from "./TopBar"

function Landing({ setShow }) {
    return (
        <section id="Landing" className="h-full w-full">
            <TopBar />
            <div className="grid place-items-center h-screen">
            <div className="w-2/3 m-auto space-y-4 p-4 bg-gray-300 dark:bg-slate-600 shadow-xl rounded-xl text-lg md:text-xl text-black dark:text-white transition-colors duration-500"> {/* This div is needed to center the items inside it using m-auto (margins auto) */}
            <h1 className="text-2xl md:text-4xl text-center font-bold">Select a page</h1>
                    
                    <div className="text-center">
                    <button className="w-1/2 p-4 rounded-full cursor-pointer border-2 text-black dark:text-white border-black dark:border-white transition-all duration-500 betterhover:hover:scale-110 betterhover:hover:bg-green-300 dark:betterhover:hover:bg-slate-700" onClick={() => setShow("keyCeremony")}>
                            Key Ceremony
                        </button>
                    </div>
                    <div className=" text-center ">
                        <button className="w-1/2 p-4 rounded-full cursor-pointer border-2 text-black dark:text-white border-black dark:border-white transition-all duration-500 betterhover:hover:scale-110 betterhover:hover:bg-green-300 dark:betterhover:hover:bg-slate-700" onClick={() => setShow("upload")}>
                            Configure Election
                        </button>
                    </div>
                    <div className=" text-center">
                        <button className="w-1/2 p-4 rounded-full cursor-pointer border-2 text-black dark:text-white border-black dark:border-white transition-all duration-500 betterhover:hover:scale-110 betterhover:hover:bg-green-300 dark:betterhover:hover:bg-slate-700" onClick={() => setShow("tally")}>Check Results</button>
                    </div>

            {/* <section id="bottombar" className="h-[5%] w-full flex flex-row-reverse items-center bg-green-600 border-t-4 border-black"></section> */}
            </div>
            </div>
        </section>
    )
}

export default Landing




        
            
        