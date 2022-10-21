const Template = () => {

    //Any page JSX would go up here

    /*This return statement is what gets passed up to the App.js then to the index.js
    it is then displayed on the user's screen as the html within the return statement*/
    return (
        <section id="template" className="h-[95%] w-full"> {/* The 95% vertical height of the template section is to fill the rest of the screen (top bar takes 5%) */}
            <div className="flex flex-col space-y-4 h-full w-full">
                <div className="m-auto text-center dark:text-white"> {/* This div is needed to center the items inside it using m-auto (margins auto) */}
                    <h1 className="text-4xl font-bold">Header</h1>
                    <p className="text-xl text-neutral-700 dark:text-neutral-400">subtext</p>
                </div>
            </div>
        </section>
    )
}

export default Template