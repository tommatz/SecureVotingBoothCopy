const Success = ({ login, setLogin, verifierID, setVerifierID }) => {

    const onSubmit = (e) => {
        //prevents close of form
        e.preventDefault()
        //resets verifier Id for which window to show
        setVerifierID("")
        //resets login info for which window to show
        setLogin({ "username": null, "address": null, "name": "", "location": "", "active": false })
    }

    
    return (
        <section id="login" className="flex h-[95%] w-full"> {/* The 95% vertical height of the template section is to fill the rest of the screen (top bar takes 5%) */}
            <div className="w-2/3 m-auto space-y-4 p-4 bg-gray-300 dark:bg-slate-600 shadow-xl rounded-xl text-lg md:text-xl text-black dark:text-white transition-colors duration-500"> {/* This div is needed to center the items inside it using m-auto (margins auto) */}
                <h1 className="text-2xl md:text-4xl text-center font-bold">Success</h1>
                <form className="space-y-4 text-center" onSubmit={onSubmit}>
                    <div className='grid md:grid-cols-1 gap-4'>
                        <h1>Verifier Id Code</h1>
                        <text>{verifierID}</text>
                    </div>
                    {/* {error !== "" && <p className="text-red-600 font-bold w-full">{error}</p>} */}
                    <input type='Exit' value='Complete' className={("w-1/2 p-4 rounded-full cursor-pointer border-2 text-black dark:text-white border-black dark:border-white transition-all duration-500 betterhover:hover:scale-110 betterhover:hover:bg-green-300 dark:betterhover:hover:bg-slate-700")} />
                    
                </form>
            </div>
        </section>
    )
}

export default Success

