import { useState } from "react"

const Vote = ({ contests, url, setLogin }) => {

    const cNames = Object.keys(contests) //Returns array of the contests object children names Example: ["Primary", "Secondary"]

    const getDefaultBallot = () => {
        let defaultBallot = {}
        for (let i = 0; i < cNames.length; i++) 
            defaultBallot = { ...defaultBallot, [cNames[i]]: -1 }

        return defaultBallot
    }
    
    const [selected, setSelected] = useState(getDefaultBallot) //Holds the currently selected candidate data

    //makeSelection is the function that controls the currently selected candidate data.
    //It requires the contest and candidate as parameters, and then sets the selected variable with this new information.
    const makeSelection = (contest, selection) => {
        if (selected[contest] !== selection)
            setSelected({ ...selected, [contest]: selection })
        else
            setSelected({ ...selected, [contest]: -1 }) //Deselect is needed since voters can abstain from voting
    }

    const submitVote = () => {
        let ballot = []
        for (let i = 0; i < cNames.length; i++) {
            ballot[i] = {
                "type" : cNames[i],
                "ballot_selections" : [
                    {
                        "id" : selected[cNames[i]] !== -1 ? selected[cNames[i]] : 0, //if a selection was made then use that id, if not use 0
                        "vote" : selected[cNames[i]] !== -1 ? true : false //if a selection was made then vote is true, if not it is false
                    }
                ]
            }
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "contests" : ballot })
        };

        fetch(url + "/voter/send_vote", requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from the backend response or default to response status (i.e. 404 Not Found)
                    const error = (data && typeof (data) == "object" && data["detail"][0]["msg"]) || (data && typeof (data) == "object" && data["detail"]) || response.status;
                    return Promise.reject(error);
                }

                setLogin({ "username": null, "address": null, "name": "", "location": "", "active": false })
            })
            .catch(error => {
                console.error(error)
            });
    }

    return (
        <>{/* This empty html is needed because react components can only return one parent element and there is a section for both vote and bottombar */}
            <section id="vote" className="h-[90%] w-full grid overflow-x-hidden overflow-y-auto"> {/* The 90% vertical height of the vote section is to fill the center of the screen (top bar takes 5% and bottom bar takes 5%) */}
                {cNames.map((contest) => (
                    <div key={contest} className="flex flex-col h-full w-screen">
                        <h1 className="text-2xl px-4 font-bold text-black dark:text-white transition-colors duration-500">{contest} Contest</h1>
                        <div className="grid grid-rows-1 grid-flow-col overflow-x-auto overflow-y-hidden space-x-4 p-4 bg-neutral-200 dark:bg-slate-600 transition-colors duration-500">
                            {contests[contest].map((candidate) => (
                                <div onClick={() => makeSelection(contest, candidate["id"])} key={contest + " " + candidate["id"]} className={`cursor-pointer flex flex-col h-36 min-w-max items-center betterhover:hover:bg-neutral-400 dark:betterhover:hover:bg-slate-800 transition-all duration-500 ${selected[contest] === candidate["id"] && 'bg-neutral-400 dark:bg-slate-800 ring ring-black dark:ring-white'}`}>
                                    <img src={candidate["image_uri"]} alt={candidate["name"]} className={"h-20 w-20 shadow-xl object-cover " + (candidate["party"] === "Republican" ? "shadow-red-600" : candidate["party"] === "Democratic" ? "shadow-blue-600" : "shadow-green-600")} />
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
            <section id="bottombar" className="h-[5%] w-full flex flex-row-reverse items-center bg-green-600 dark:bg-slate-700 border-t-4 border-black dark:border-white transition-colors duration-500">
                <button onClick={() => submitVote()} className="px-4 text-sm sm:text-base md:text-xl font-bold dark:text-white betterhover:hover:bg-green-400 dark:betterhover:hover:bg-slate-500 transition-colors duration-500">Submit</button>
                <span className="h-full w-1 bg-black dark:bg-white transition-colors duration-500" />
            </section>
        </>
    )
}

export default Vote