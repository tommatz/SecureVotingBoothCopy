import TopBar from "./TopBar"

const qs_match = new RegExp("code=([^ ]+)")

const Verifier = ({ url, setShow, fields, setFields, defaultVals, error, setError }) => {
    const getCode = (address) => {
        const match = address.match(qs_match);
        if(match)
            return decodeURIComponent(match[1]);
        return fields['verify_code'].value;
    }

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
            //setFields(errorFields)
            
        }
        else
        {
            postReq();
        }
    }

    const postReq = () => {
    //     /// needs a verifier that the code matches the lexical structure of what the codes should be ie can it have nums, letters, and or symbols
        console.log()
         fetch(url + "/verifier/get_verifier?filename="+fields["verify_code"]["value"])
            .then(async res => {

                const isJson = res.headers.get('content-type')?.includes('application/json');
                const data = isJson && await res.json();

                // check for error response
                if (!res.ok) {
                    // get error message from body or default to response status
                    const error = data || res.status;
                    return Promise.reject(error);
                }
                Object.keys(data).map((field) => fields[field].value = data[field]);
                setFields(fields)
                
                setError("")
                
                setShow("Results")

                return (res);
            })
            .catch(error => {
                console.error(error)
                setError("Unable to upload this input to the server!")
                return (error);
            });

            
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
                    
                
                            <div key={'verify_code'} className="flex flex-col">
                                <div className="flex flex-row">
                                    <p>{fields['verify_code'].display}</p>
                                    {fields['verify_code'].required && <p className="font-bold text-red-600">*</p>}
                                    {fields['verify_code'].error !== "" && <p className="mx-2 font-bold">-</p>}
                                    <p className="text-red-600 animate-pulse">{fields['verify_code'].error}</p>
                                </div>
                                <input type="text" name={'verify_code'} defaultValue={getCode(window.location.href)} placeholder={"Enter the " + fields['verify_code'].display + " here (" + fields['verify_code'].placeholder + ")"} onChange={handleChange} className="w-full h-10 border-b-2 text-black dark:text-white border-black dark:border-white bg-transparent focus: transition-colors duration-500" />
                            </div>
                        
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