import { useState } from "react"

const Login = () => {

    const [ssn, setssn] = useState("")

    const handleChange = (e) => {
        const target = e.target
        if (!target.type)
            return
        
        setssn(e.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        console.log(ssn)
    }

    /*This return statement is what gets passed up to the App.js then to the index.js
    it is then displayed on the user's screen as the html within the return statement*/

    return (
        <section id="login" className="h-[95%] w-full"> {/* The 95% vertical height of the template section is to fill the rest of the screen (top bar takes 5%) */}
            <div className="flex h-full w-full">
                <div className="m-auto text-center text-black dark:text-white transition-colors duration-500 space-y-4"> {/* This div is needed to center the items inside it using m-auto (margins auto) */}
                    <h1 className="text-4xl font-bold"> Input SSN </h1>

                    <form className='block' onSubmit={onSubmit}>
                        <input type="text" name="ssn" value = {ssn} maxLength="11" placeholder='Enter SSN here' onChange={handleChange} className="mt-1 block w-full h-10 px-3 py-2 bg-white border border-black"/>
                        <input type='submit' value='Submit' className={("w-1/2 mt-4 ml-[25%] md:w-1/4 md:ml-[37.5%] cursor-pointer mb-4 p-4 border-4 border-black rounded-full transition-all ease-in-out duration-300 hover:scale-110 hover:bg-green-600 md:text-xl lg:text-2xl xl:text-3xl")} />
                    </form>

                </div>
            </div>
        </section>
    )
}

export default Login