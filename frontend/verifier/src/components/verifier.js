import { useState } from "react"
import TopBar from "./TopBar"

const debug = true // The toggle to skip a correct sign in on the login page. Use "test" in the first name field to skip login while debug is set to true.

const defaultVals = {
    "VerificationCode": { "display": "Verification Code", "placeholder": "Verification Code", "value": "", "required": true, "error": "" },
}
const Verifier = ({ url, setShow }) => {
    const [fields, setFields] = useState(defaultVals) //Variable to hold the current form information.
    
    
    const [error, setError] = useState("") //Variable used to set the error message above the submit button.  
    
    const handleChange = (e) => {
        const value = e.target.value
        const fName = e.target.name

        setFields({ ...fields, [fName]: { ...fields[fName], "value": value } })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const fNames = Object.keys(fields)
        let badForm = false //If true then there is a bad input
        let errorFields = fields

        for (let i = 0; i < fNames.length; i++) {
            let error = "" //Clear old error
            if (checkEmpty(fNames[i])) { error = "Required"; badForm = true }
            errorFields[fNames[i]].error = error
        }

        if (badForm) {
            setError("Invalid input, see red text above.")
            setFields(errorFields)
            
        }
        else
        {
            postReq();
        }
    }

    const postReq = () => {
    //     /// needs a verifier that the code matches the lexical structure of what the codes should be ie can it have nums, letters, and or symbols

    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({"name" : fields.VerificationCode.value, "VerificationCode" : Code})
    //     };

    //     fetch(url + "", requestOptions)
    //         .then(async res => {
    //             const isJson = res.headers.get('content-type')?.includes('application/json');
    //             const data = isJson && await res.json();

    //             // check for error response
    //             if (!res.ok) {
    //                 // get error message from body or default to response status
    //                 const error = data || res.status;
    //                 return Promise.reject(error);
    //             }

    //             console.log(res)
    //             setError("Sucessfully uploaded " + fields.electionName.value + " to the server!")
    //             setFields(defaultVals)//Reset fields on success
                
    //             return (res);
    //         })
    //         .catch(error => {
    //             console.error(error)
    //             setError("Unable to upload this input to the server!")
    //             return (error);
    //         });

        setShow("Results")
    }

    const checkEmpty = (fName) => {
        if (fields[fName].value === "" && fields[fName].required === true)
            return true

        return false
    }

    return (
        <section id="keyCeremony" className="h-full w-full"> 
        <TopBar />
        <div className="grid place-items-center h-screen">
        <div className="w-2/3 m-auto space-y-4 p-4 bg-gray-300 dark:bg-slate-600 shadow-xl rounded-xl text-lg md:text-xl text-black dark:text-white transition-colors duration-500"> {/* This div is needed to center the items inside it using m-auto (margins auto) */}
            <h1 className="text-2xl md:text-4xl text-center font-bold">Election Verifier</h1>
            <form className="space-y-4 text-center" onSubmit={onSubmit}  >                                  
                <div className='grid md:grid-cols-1 gap-4 text-left'>
                {Object.keys(fields).map((field) => (
                            <div key={field} className="flex flex-col">
                                <div className="flex flex-row">
                                    <p>{fields[field].display}</p>
                                    {fields[field].required && <p className="font-bold text-red-600">*</p>}
                                    {fields[field].error !== "" && <p className="mx-2 font-bold">-</p>}
                                    <p className="text-red-600 animate-pulse">{fields[field].error}</p>
                                </div>
                                <input type="text" name={field} value={fields[field].value} maxLength="40" placeholder={"Enter the " + fields[field].display + " here (" + fields[field].placeholder + ")"} onChange={handleChange} className="w-full h-10 border-b-2 text-black dark:text-white border-black dark:border-white bg-transparent focus: transition-colors duration-500" />
                            </div>
                        ))}
                </div>
                
                {error !== "" && <p className="text-red-600 font-bold w-full">{error}</p>}
                <input type='submit' value='Verify Results' className={("w-2/5 p-4 rounded-full cursor-pointer border-2 text-black m-4 dark:text-white border-black dark:border-white transition-all duration-500 betterhover:hover:scale-110 betterhover:hover:bg-green-300 dark:betterhover:hover:bg-slate-700")} />
                <p className="text-xs" >* = required field</p>
               
            </form>
            
        </div>
        </div>
    </section>
    )
}

export default Verifier