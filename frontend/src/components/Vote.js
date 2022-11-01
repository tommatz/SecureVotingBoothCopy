import { useState } from "react"

const Vote = () => {

    const elections = ["Primary", "Secondary", "Governor", "Senate", "House of Representatives", "Mayor"]
    const candidates = { //Temporary static data to test election and candidate mapping without the backend
        "Primary" : [
            {"id" : 0, "name" : "Bob Ross", "party" : "Republican"},
            {"id" : 1, "name" : "Kanye West", "party" : "Democratic"},
            {"id" : 2, "name" : "Theodore Roosevelt", "party" : "Democratic"},
            {"id" : 3, "name" : "Bob Ross", "party" : "Republican"},
            {"id" : 4, "name" : "Bob Ross", "party" : "Republican"},
            {"id" : 5, "name" : "Kanye West", "party" : "Democratic"},
            {"id" : 6, "name" : "Bob Ross", "party" : "Republican"},
            {"id" : 7, "name" : "Kanye West", "party" : "Democratic"},
            {"id" : 8, "name" : "Kanye West", "party" : "Democratic"},
            {"id" : 9, "name" : "Kanye West", "party" : "Democratic"},
            {"id" : 10, "name" : "Kanye West", "party" : "Democratic"}
        ],
        "Secondary" : [
            {"id" : 0, "name" : "Chuck", "party" : "Republican"},
            {"id" : 1, "name" : "Mary", "party" : "Democratic"},
            {"id" : 2, "name" : "Tim", "party" : "Green"}
        ],
        "Governor" : [
            {"id" : 0, "name" : "Tucker", "party" : "Republican"},
            {"id" : 1, "name" : "Larry", "party" : "Democratic"}
        ],
        "Senate" : [
            {"id" : 0, "name" : "George", "party" : "Republican"},
            {"id" : 1, "name" : "Abraham", "party" : "Democratic"}
        ],
        "House of Representatives" : [
            {"id" : 0, "name" : "George", "party" : "Republican"},
            {"id" : 1, "name" : "Abraham", "party" : "Democratic"}
        ],
        "Mayor" : [
            {"id" : 0, "name" : "George", "party" : "Republican"},
            {"id" : 1, "name" : "Abraham", "party" : "Democratic"}
        ],
    }
    const [selected, setSelected] = useState("none")
    const [showSpoil, setShowSpoil] = useState(false)

    const makeSelection = (election, selection) => {
        if(selected === "none"){
            let newSelected = {}
            for(let i = 0; i < elections.length; i++){
                newSelected = {...newSelected, [elections[i]] : -1} 
            }
            newSelected = {...newSelected, [election] : selection}
            setSelected(newSelected)
        }
        else{
            if(selected[election] !== selection)
                setSelected({...selected, [election] : selection})
            else
                setSelected({...selected, [election] : -1}) //Deselect is needed since voters can abstain from voting
        }
    }

    return (
        <>
        <section id="vote" className="h-[90%] w-full grid overflow-x-hidden overflow-y-auto"> {/* The 90% vertical height of the vote section is to fill the center of the screen (top bar takes 5% and bottom bar takes 5%) */}
            {elections.map((election) => (
                <div key={election} className="flex flex-col h-full w-screen">
                    <h1 className="text-2xl px-4 font-bold text-black dark:text-white transition-colors duration-500">{election} Election</h1>
                    <div className="grid grid-rows-1 grid-flow-col overflow-x-auto overflow-y-hidden flex flex-row space-x-4 p-4 bg-neutral-200 dark:bg-slate-600">
                        {candidates[elections[elections.indexOf(election)]].map((candidate) => (
                            <div onClick={() => makeSelection(election, candidate["id"])} key={election + " " + candidate["id"]} className={`cursor-pointer flex flex-col h-36 min-w-max items-center betterhover:hover:bg-neutral-400 dark:betterhover:hover:bg-slate-800 transition-all duration-500 ${selected[election] === candidate["id"] && 'bg-neutral-400 dark:bg-slate-800 ring ring-black dark:ring-white'}`}>
                                <img src="https://imageio.forbes.com/specials-images/imageserve/5ed00f17d4a99d0006d2e738/0x0.jpg?format=jpg&crop=4666,4663,x154,y651,safe&height=416&width=416&fit=bounds" alt={candidate["name"]} className={"h-20 w-20 shadow-xl object-cover " + (candidate["party"] === "Republican" ? "shadow-red-600" : candidate["party"] === "Democratic" ? "shadow-blue-600" : "shadow-green-600")}/>
                                <div className="h-16 w-full flex flex-col px-2 items-center text-black dark:text-white bg-neutral-300 dark:bg-slate-700 transition-colors duration-500">
                                    <p className="text-base sm:text-lg md:text-xl font-bold">{candidate["name"]}</p>
                                    <p className="text-sm sm:text-base md:text-xl">{candidate["party"]} Party</p>
                                </div>
                            </div>
                        ))}                                            
                    </div>
                </div>
            ))}  
        </section>
        <section id="bottombar" className="h-[5%] w-full px-4 flex flex-row-reverse items-center bg-green-600 border-t-4 border-black dark:border-white dark:bg-slate-700 transition-colors duration-500">
            <button className="h-3/4 mr-4 px-4 border-2 border-black dark:border-white text-base sm:text-lg md:text-xl font-bold dark:text-white betterhover:hover:bg-green-400 dark:betterhover:hover:bg-slate-500 transition-colors duration-500">Submit</button>
            <button className="h-3/4 mr-4 px-4 border-2 border-black dark:border-white text-base sm:text-lg md:text-xl font-bold dark:text-white betterhover:hover:bg-green-400 dark:betterhover:hover:bg-slate-500 transition-colors duration-500">Spoil</button>
            <button onClick={() => setShowSpoil(!showSpoil)} className="h-3/4 mr-4 px-4 md:px-3 rounded-full border-2 border-black dark:border-white text-base sm:text-lg md:text-xl font-bold dark:text-white betterhover:hover:bg-green-400 dark:betterhover:hover:bg-slate-500 transition-colors duration-500">?</button>
            <span className={`mr-4 text-sm sm:text-base md:text-xl font-bold dark:text-white transition-all duration-500  ${!showSpoil && 'opacity-0'}`}>The Spoil button will show you your ballot. (Better explanation needed)</span>
        </section>
        </>
    )
}

export default Vote