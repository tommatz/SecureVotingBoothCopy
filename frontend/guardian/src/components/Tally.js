import { useEffect, useRef, useState } from "react"

const Tally = ({ contests, url }) => {

    const debounce = useRef(false)
    const [tally, setTally] = useState("")
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

        const getTally = async () => {
            debounce.current = true
            const tal = await fetchData("/tally/election")
            setTally(tal)
            debounce.current = false
        }

        if(!debounce.current)
            getTally()
    }, [url])

    const [selected, setSelected] = useState(Object.keys(contests)[0])
    const [total, setTotal] = useState (0)
    useEffect(() => {
        if(typeof(tally) !== "object" || Object.keys(tally).length === 0) return 

        let sum = 0
        Object.keys(tally[selected]).map((candidate) => (sum += tally[selected][candidate]))
        setTotal(sum)
    }, [tally, selected])

    if(tally === "" || tally === "Error"){
        return (
            <section id="tally" className="h-full w-full flex flex-col">
                <div className="m-auto text-center text-black dark:text-white transition-colors duration-500">
                    <h1 className="text-4xl font-bold">{tally === "" ? "Election tally loading" : "Error fetching the tally"}</h1>
                </div>
            </section>
        )
    }

    return (
        <section id="tally" className="h-full w-full flex flex-row">
            <section id="tally_nav" className="h-full w-[15%] bg-gradient-to-r from-slate-700 to-slate-500 border-r-2 border-black shadow-xl shadow-black text-white">
                <div className="h-full w-full flex flex-col space-y-4 p-4">
                    <h1 className="mx-auto text-2xl font-bold">Election Tally</h1>
                    {/*<p className="mx-auto text-xl">Election in progress</p>*/}
                    <h2 className="text-2xl font-bold">Contests</h2>
                    {Object.keys(contests).map((contest) => (
                        <p key={contest} onClick={() => setSelected(contest)} className={"text-xl w-fit transition-all duration-300 " + (selected === contest ? "cursor-default text-slate-300" : "cursor-pointer betterhover:hover:text-gray-400")}>{(selected === contest ? "> " : "• " ) + contest}</p>
                    ))}
                </div>
            </section>

            <section id="tally_content" className="h-full w-[85%] p-4">
                <div className="flex flex-col h-full w-full space-y-4">
                    <div className="p-4 text-white text-center bg-gradient-to-l from-slate-700 to-slate-500 rounded-xl border-2 border-black shadow-md shadow-black">
                        <h1 className="text-2xl font-bold">{selected} Contest</h1>
                        <p>Total Votes: {total}</p>
                    </div>

                    {(Object.keys(tally).length !== 0 && tally[selected]) ?
                        <div className="flex flex-col border-2 border-black">
                            <div className="flex flex-row bg-slate-300 px-2 space-x-2 text-base sm:text-lg md:text-xl">
                                <div className="w-2/3 flex flex-row space-x-2">
                                    <p className="font-bold">#</p>
                                    <span className="h-full w-0.5 bg-black"></span>
                                    <p>Name</p>
                                </div>
                                <span className="h-full w-0.5 bg-black"></span>
                                <p className="w-1/3">Tally</p>
                            </div>

                            {Object.keys(tally[selected]).sort((a, b) => tally[selected][b] - tally[selected][a]).map((candidate, index) => (
                                <div key={candidate} className="flex flex-row px-2 space-x-2 border-t-2 border-black text-base sm:text-lg md:text-xl">
                                    <div className="w-2/3 flex flex-row space-x-2">
                                        <p className="font-bold">{(index+1)}</p>
                                        <span className="h-full w-0.5 bg-black"></span>
                                        <p>{candidate}</p>
                                    </div>
                                    <span className="h-full w-0.5 bg-black"></span>
                                    <p className="w-1/3">{tally[selected][candidate]}</p>
                                </div>
                            ))}
                        </div>
                    :
                        <p className="font-bold text-xl text-center">No ballots collected for this contest!</p>
                    }
                </div>
            </section>
        </section>
    )
}

export default Tally