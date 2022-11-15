import { useEffect, useState } from "react"

const Tally = ({ url }) => {

    const [tally, setTally] = useState("")
    useEffect(() => {
        const fetchData = async (type) => {
            try {
                const response = await fetch(url + type);
                const result = await response.json();
                console.log(result);
                return result;
            } catch (error) {
                console.error(error);
                return "Error";
            };
        };

        const getTally = async () => {
            const tal = await fetchData("/voter/get_tally?contest=string&candidate=string")
            setTally(tal)
        }

        getTally()
    }, [url])

    return (
        <section id="tally" className="h-full w-full flex flex-col space-y-4">
            <div className="m-auto text-center text-black dark:text-white transition-colors duration-500">
                <h1 className="text-4xl font-bold">Template Page</h1>
                <p className="text-xl text-neutral-700 dark:text-neutral-400 transition-colors duration-500">Tally: {tally}</p>
            </div>
        </section>
    )
}

export default Tally