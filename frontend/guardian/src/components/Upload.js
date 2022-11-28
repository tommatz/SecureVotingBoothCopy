import SendFile from "./SendFile"

const Upload = ({url}) => {
    return (
        <section id="upload" className="h-full w-full">
            <SendFile url={url}/>
        </section>
    )
}

export default Upload