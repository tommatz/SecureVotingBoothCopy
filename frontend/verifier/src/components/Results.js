import { useState } from "react"
import TopBar from "./TopBar"


const Results= ({ url, ballots, setBallots, setShow }) => {

    const [error, setError] = useState("") //Variable used to set the error message above the submit button.

        const onSubmit = (e) => {
        e.preventDefault()
        setShow("verifier")
        
    }

    

    return (
        <section id="results" className="h-full w-full"> {/* The 95% vertical height of the template section is to fill the rest of the screen (top bar takes 5%) */}
        <TopBar/>
         <div className="grid place-items-center h-screen">
            <div className="w-2/3 m-auto space-y-4 p-4 bg-gray-300 dark:bg-slate-600 shadow-xl rounded-xl text-lg md:text-xl text-black dark:text-white transition-colors duration-500"> {/* This div is needed to center the items inside it using m-auto (margins auto) */}
           
                <h1 className="text-2xl md:text-4xl text-center font-bold">Your Votes</h1>
                <form className="space-y-4 text-center" onSubmit={onSubmit}>
                    <div className='grid md:grid-cols-1 gap-4'>
                        <h1>*User Ballots will go here*</h1>
                        {/* use this to show the ballots as a template but will need some work  */}
                        {/* {Object.keys(fields).map((field) => (
                            <div key={field} className="flex flex-col">
                                <div className="flex flex-row">
                                    <p>{fields[field].display}</p>
                                    {fields[field].required && <p className="font-bold text-red-600">*</p>}
                                    {fields[field].error !== "" && <p className="mx-2 font-bold">-</p>}
                                    <p className="text-red-600 animate-pulse">{fields[field].error}</p>
                                </div>
                                <input type="text" name={field} value={fields[field].value} maxLength="40" placeholder={"Enter your " + fields[field].display + " here (" + fields[field].placeholder + ")"} onChange={handleChange} className="w-full h-10 border-b-2 text-black dark:text-white border-black dark:border-white bg-transparent focus: transition-colors duration-500" />
                            </div>
                        ))} */}
                    </div>
                    {error !== "" && <p className="text-red-600 font-bold w-full">{error}</p>}
                    <input type='submit' value='Done' className={("w-1/2 p-4 rounded-full cursor-pointer border-2 text-black dark:text-white border-black dark:border-white transition-all duration-500 betterhover:hover:scale-110 betterhover:hover:bg-green-300 dark:betterhover:hover:bg-slate-700")} />
                   
                </form>
            </div>
            </div>
        </section>
    )
}

export default Results