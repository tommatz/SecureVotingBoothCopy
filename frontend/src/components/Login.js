const Login = () => {

    //Any page JSX would go up here

    /*This return statement is what gets passed up to the App.js then to the index.js
    it is then displayed on the user's screen as the html within the return statement*/

    return (
        <section id="template">
            <div className="flex flex-col p-4">
                <div className="flex flex-col space-y-4">
                    <h1 className="text-4xl font-bold">Header</h1>
                    <p className="text-xl text-gray-700">subtext</p>
                </div>
            </div>
        </section>
    )
}

export default Login