const Template = () => {

    //Any page JSX would go up here


    /*This return statement is what gets passed up to the App.js then to the index.js
    it is then displayed on the user's screen as the html within the return statement*/

    return (
        <section id="template" className="h-full w-full flex flex-col space-y-4">
            <div className="m-auto text-center text-black dark:text-white transition-colors duration-500"> {/* This div is needed to center the items inside it using m-auto (margins auto) */}
                <h1 className="text-4xl font-bold">Template Page</h1>
                <p className="text-xl text-neutral-700 dark:text-neutral-400 transition-colors duration-500">for the guardians</p>
            </div>
        </section>
    )
}

export default Template