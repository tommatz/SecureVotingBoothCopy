import { useState } from "react"

const Login = () => {

    const [name, setname] = useState("")
    const [address, setaddress] = useState("")

    const handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        
        if(name === "address")
            setaddress(value)
        if(name === "name")
            setname(value)
        
    }

    const onSubmit = (e) => {
        e.preventDefault()
        console.log(name)
        console.log(address)
    }

    /*This return statement is what gets passed up to the App.js then to the index.js
    it is then displayed on the user's screen as the html within the return statement*/

    return (
        <section id="login" className="h-[95%] w-full"> {/* The 95% vertical height of the template section is to fill the rest of the screen (top bar takes 5%) */}
            <div className="flex h-full w-full">
                <div className="m-auto text-center text-lg md:text-xl text-black dark:text-white transition-colors duration-500 space-y-4"> {/* This div is needed to center the items inside it using m-auto (margins auto) */}
                    <h1 className="sm:text-4xl font-bold">Input Information to Continue</h1>

                    <form className='block' onSubmit={onSubmit}>
                        <input type="text" name="name" value = {name} maxLength="100" placeholder='Enter First and Last Name' onChange={handleChange} className="mt-1 block w-full h-10 px-3 py-2 border border-black dark:border-white bg-transparent"/>
                        <input type="text" name="address" value = {address} maxLength="100" placeholder='Enter Address' onChange={handleChange} className="mt-1 block w-full h-10 px-3 py-2 border border-black dark:border-white bg-transparent"/>

                        <input type='submit' value='Submit' className={("w-1/2 mt-4 p-4 rounded-full cursor-pointer border-2 text-black dark:text-white border-black dark:border-white transition-all duration-500 betterhover:hover:scale-110 betterhover:hover:bg-green-300 dark:betterhover:hover:bg-slate-700")} />
                    </form>

                </div>
            </div>
        </section>
    )
}

export default Login