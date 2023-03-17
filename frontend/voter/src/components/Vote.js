import { useState } from "react"

const Vote = ({ contests, url, login, setLogin }) => {

    const cNames = Object.keys(contests) //Returns array of the contests object children names Example: ["Primary", "Secondary"]

    const getDefaultBallot = () => {
        let defaultBallot = {}
        for (let i = 0; i < cNames.length; i++) 
            defaultBallot = { ...defaultBallot, [cNames[i]]: -1 }

        return defaultBallot
    }

    const [selected, setSelected] = useState(getDefaultBallot) //Holds the currently selected candidate data
    const [currentContest, setCurrentContest] = useState(cNames[0])
    const [verifierID, setVerifierID] = useState("")

    //makeSelection is the function that controls the currently selected candidate data.
    //It requires the contest and candidate as parameters, and then sets the selected variable with this new information.
    const makeSelection = (contest, selection) => {
        if (selected[contest] !== selection)
            setSelected({ ...selected, [contest]: selection })
        else
            setSelected({ ...selected, [contest]: -1 }) //Deselect is needed since voters can abstain from voting
    }

    const submitVote = (spoil) => {
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
            body: JSON.stringify({ "ballot": {"contests" : ballot, "spoiled" : spoil}, "login_info": {"username": login["username"], "address": login["address"]} })
        };

        fetch(url + "/voter/send_vote", requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from the backend response or default to response status (i.e. 404 Not Found)
                    const error = (data && typeof (data) == "object" && data["detail"][0]["msg"]) || (data && typeof (data) == "object" && data["detail"]) || response.status;
                    console.log(data["detail"])
                    return Promise.reject(error);
                }
                
                //this verifier ID code will need to be moved to wherever the logic behind the success page is when that is completed
                try {
                    const response = await fetch(url + "/verifier/get_verifier_id");
                    const result = await response.json();
                    console.log(result);
                    setVerifierID(result)
                } catch(error) {
                    console.error(error);
                    setVerifierID("Error")
                };

                setLogin({ "username": null, "address": null, "name": "", "location": "", "active": false })
            })
            .catch(error => {
                console.error(error)
            });
    }

    return (
        <>{/* This empty html is needed because react components can only return one parent element and there is a section for both vote and bottombar */}
            <section id="vote" className="h-[90%] w-full grid overflow-y-auto"> {/* The 90% vertical height of the vote section is to fill the center of the screen (top bar takes 5% and bottom bar takes 5%) */}
                {cNames.map((contest) => (
                    <div key={contest} className={`flex flex-col m-auto items-center bg-neutral-300 dark:bg-slate-700 rounded-xl transition-colors duration-500 ${currentContest !== contest && "hidden"}`}>
                        <h1 className="text-2xl sm:text-4xl p-4 font-bold text-black dark:text-white transition-colors duration-500">{contest} Contest</h1>
                        <div className="grid p-4">
                            {contests[contest].map((candidate) => (
                                <div onClick={() => makeSelection(contest, candidate["id"] - 1)} key={contest + " " + candidate["id"]} className="flex flex-row items-center p-4 -mt-1 border-4 border-black dark:border-white transition-colors duration-500">
                                    <div className="cursor-pointer betterhover:hover:bg-neutral-400 dark:betterhover:hover:bg-slate-800 border-4 border-black dark:border-white transition-colors duration-500">
                                        <span className={`p-2 text-lg sm:text-xl md:text-2xl font-bold dark:text-white transition-all duration-500 ${selected[contest] === candidate["id"] -1 ? 'opacity-1' : 'opacity-0'}`}>&#10004;</span>
                                    </div>
                                    <div className="w-full flex flex-col px-4 items-center text-black dark:text-white transition-colors duration-500">
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold">{candidate["name"]}</p>
                                        <p className="text-base sm:text-lg md:text-xl">{candidate["party"]} Party</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <section id="confirmation" className={`flex flex-col m-auto items-center p-4 space-y-4 bg-neutral-300 dark:bg-slate-700 rounded-xl transition-colors duration-500 ${currentContest !== "Confirm" && "hidden"}`}>
                    <h1 id="confirmation-header" className="text-2xl sm:text-4xl font-bold text-black dark:text-white transition-colors duration-500">Confirm your ballot</h1>
                    
                    <div id="confirmation-selection" className="flex flex-col space-y-4 border-y-4 p-4 text-lg sm:text-xl md:text-2xl dark:text-white border-black dark:border-white transition-colors duration-500">
                        {cNames.map((contest) => (
                            <p key={contest}>{contest + ": " + (selected[contest] === -1 ? "No Vote" : contests[contest][selected[contest]]["name"])}</p>
                        ))}
                    </div>
                    
                    <div id="confirmation-buttons" className="flex space-x-4">
                        <button onClick={() => setCurrentContest(cNames[cNames.length -1])} className="px-8 py-4 rounded-full cursor-pointer border-4 text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white border-black dark:border-white transition-all duration-500 betterhover:hover:scale-110 betterhover:hover:bg-red-300 dark:betterhover:hover:bg-red-700">Go Back</button>
                        <button onClick={() => submitVote(true)} className="px-8 py-4 rounded-full cursor-pointer border-4 text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white border-black dark:border-white transition-all duration-500 betterhover:hover:scale-110 betterhover:hover:bg-yellow-300 dark:betterhover:hover:bg-yellow-500">Spoil</button>
                        <button onClick={() => submitVote(false)} className="px-8 py-4 rounded-full cursor-pointer border-4 text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white border-black dark:border-white transition-all duration-500 betterhover:hover:scale-110 betterhover:hover:bg-green-300 dark:betterhover:hover:bg-green-700">Confirm</button>
                    </div>
                </section>
            </section>
            <section id="bottombar" className="h-[5%] w-full bg-green-600 dark:bg-slate-700 border-t-4 border-black dark:border-white transition-colors duration-500">
                <div className={`h-full w-full flex flex-row-reverse items-center ${currentContest === "Confirm" && "hidden"}`}>
                    <button onClick={cNames.indexOf(currentContest) === cNames.length - 1 ? () => setCurrentContest("Confirm") : () => setCurrentContest(cNames[cNames.indexOf(currentContest) + 1])} className="px-4 h-full text-sm sm:text-base md:text-xl font-bold dark:text-white betterhover:hover:bg-green-400 dark:betterhover:hover:bg-slate-500 transition-colors duration-500">{cNames.indexOf(currentContest) === cNames.length - 1 ? "Submit" : "Continue"}</button>
                    <span className="h-full w-1 bg-black dark:bg-white transition-colors duration-500"/>
                    <button onClick={() => setCurrentContest(cNames[cNames.indexOf(currentContest) - 1])} className={`px-4 h-full text-sm sm:text-base md:text-xl font-bold dark:text-white betterhover:hover:bg-green-400 dark:betterhover:hover:bg-slate-500 transition-colors duration-500 ${cNames.indexOf(currentContest) === 0 && "hidden"}`}>Go Back</button>
                    <span className={`h-full w-1 bg-black dark:bg-white transition-colors duration-500 ${cNames.indexOf(currentContest) === 0 && "hidden"}`}/>
                </div>
            </section>
        </>
    )
}

export default Vote