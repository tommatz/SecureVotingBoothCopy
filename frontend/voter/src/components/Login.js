import { useEffect, useRef, useState } from "react"

const debug = true // The toggle to skip a correct sign in on the login page. Use "test" in the first name field to skip login while debug is set to true.

const defaultLogin = {
    "first": { "display": "First Name", "placeholder": "John", "value": "", "required": true, "error": "" },
    "middle": { "display": "Middle Name", "placeholder": "Michael", "value": "", "required": false, "error": "" },
    "last": { "display": "Last Name", "placeholder": "Doe", "value": "", "required": true, "error": "" },
    "suffix": { "display": "Suffix", "placeholder": "Jr", "value": "", "required": false, "error": "" },
    "street": { "display": "Street Address", "placeholder": "21 Main St", "value": "", "required": true, "error": "" },
    "city": { "display": "City", "placeholder": "Athens", "value": "", "required": true, "error": "" },
    "state": { "display": "State", "placeholder": "OH", "value": "", "required": true, "error": "" },
    "zip": { "display": "Postal Code", "placeholder": "45701", "value": "", "required": true, "error": "" }
}

const Login = ({ url, setLogin }) => {

    const [fields, setFields] = useState(defaultLogin) //Variable to hold the current form information.
    const [error, setError] = useState("") //Variable used to set the error message above the submit button.

    const videoRef = useRef(null)
    const photoRef = useRef(null)
    const [camera, setCamera] = useState(false)
    const [picture, setPicture] = useState(false)

    useEffect(() => {
        const getVideo = () => {
            window.navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user", //Front camera on mobile
                    width: { ideal: 4096 }, //Camera feed will be at 4K if their camera supports that resolution, or lowered to their max resolution if not
                    height: { ideal: 2160 } 
                  },
                  audio: false
            })
            .then(stream => {
                let video = videoRef.current
                video.srcObject = stream
                video.play()
            })
            .catch(err => {
                console.error(err)
            })
        }

        if(camera)
            getVideo()
    }, [videoRef, camera])

    const takePhoto = () => {
        if(videoRef.current == null)
            return

        setPicture(true)

        let video = videoRef.current
        const height = video.videoHeight
        const width = video.videoWidth

        let canvas = document.createElement('canvas')
        canvas.height = height
        canvas.width = width
        let context = canvas.getContext('2d')
        context.drawImage(video, 0, 0, width, height)

        let image = canvas.toDataURL('image/jpeg');
        photoRef.current.src = image
    }

    //The handleChange function is called on every keystroke, it updates the respective field within the fields variable
    const handleChange = (e) => {
        const value = e.target.value
        const fName = e.target.name

        setFields({ ...fields, [fName]: { ...fields[fName], "value": value } })
    }

    //onSubmit runs each time the submit button is clicked. It checks if the form is filled out correctly. If the form is filled out correctly then the postReq function is called.
    const onSubmit = (e) => {
        e.preventDefault()

        if(fields.first.value === "test" && debug === true) {
            setLogin({ "username": {"first": "Test", "middle": "A", "last": "User", "suffix": ""}, "address": {"country_code": "US", "country_area": "OH", "city": "Athens", "postal_code": "45701", "street_address": "1 Ohio University"}, "name": "Test User", "location": "Athens, OH", "active": true })
            return
        }

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
            postReq()
    }

    //The postReq function rearranges the login form input data to a schema that the backend accepts. It then attempts to make a POST request to the backend.
    //Depending on the data sent to the backend, the response will either be successful or return an error (such as invalid characters in name)
    //An error will require the user to attempt their login again. A successful login however will update the topbar and send the user to the voting page.
    const postReq = () => {
        const user = {
            "first": fields["first"]["value"],
            "middle": fields["middle"]["value"],
            "last": fields["last"]["value"],
            "suffix": fields["suffix"]["value"]
        }
        const fullName = user.first + " " + user.last + " " + user.suffix
        const address = {
            "country_code": "US",
            "country_area": fields.state.value,
            "city": fields.city.value,
            "postal_code": fields.zip.value,
            "street_address": fields.street.value
        }
        const location = address.city + ", " + address.country_area
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "username": user, "address": address })
        };

        fetch(url + "/voter/login", requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from the backend response or default to response status (i.e. 404 Not Found)
                    const error = (data && typeof (data) == "object" && data["detail"][0]["msg"]) || (data && typeof (data) == "object" && data["detail"]) || response.status;
                    return Promise.reject(error);
                }

                setError("")
                setFields(defaultLogin)//Reset fields on success
                setLogin({ "username": user, "address": address, "name": fullName, "location": location, "active": true })
            })
            .catch(error => {
                setError(error)
            });
    }

    const checkEmpty = (fName) => {
        if (fields[fName].value === "" && fields[fName].required === true)
            return true

        return false
    }

    if(camera)
        return (
            <section id="camera" className="h-[95%] w-full bg-gray-300 dark:bg-slate-600 transition-colors duration-500">
                <section id="video" className={"h-full w-full " + (picture ? "hidden" : "")}>
                    <video ref={videoRef} className="h-full w-full"/>
                    <button onClick={() => setCamera(false)} className="absolute bottom-8 left-8 text-xl font-bold rounded-full p-4 bg-red-300 border-2 border-black betterhover:hover:bg-red-400 transition-colors duration-500">Go Back</button>
                    <button onClick={() => takePhoto()} className="absolute bottom-8 right-8 text-xl font-bold rounded-full p-4 bg-green-300 border-2 border-black betterhover:hover:bg-green-400 transition-colors duration-500">Take Photo</button>
                </section>
                <section id="photo" className={"flex h-full w-full items-center " + (picture ? "" : "hidden")}>
                    <img ref={photoRef} alt="" className="h-full w-auto m-auto"/>
                    <button onClick={() => setPicture(false)} className="absolute bottom-8 left-8 text-xl font-bold rounded-full p-4 bg-red-300 border-2 border-black betterhover:hover:bg-red-400 transition-colors duration-500">Retake Photo</button>
                    <button onClick={() => console.log("Send this to server: " + photoRef.current.src)} className="absolute bottom-8 right-8 text-xl font-bold rounded-full p-4 bg-green-300 border-2 border-black betterhover:hover:bg-green-400 transition-colors duration-500">Upload</button>
                </section>
            </section>
        )
    
    return (
        <section id="login" className="flex h-[95%] w-full"> {/* The 95% vertical height of the template section is to fill the rest of the screen (top bar takes 5%) */}
            <div className="w-3/4 m-auto space-y-4 p-4 bg-gray-300 dark:bg-slate-600 shadow-xl rounded-xl text-lg md:text-xl text-black dark:text-white transition-colors duration-500"> {/* This div is needed to center the items inside it using m-auto (margins auto) */}
                <h1 className="text-2xl md:text-4xl text-center font-bold">Voter Login</h1>

                <div className="w-full text-center">
                    <button onClick={() => setCamera(true)} className="px-8 py-4 rounded-full cursor-pointer font-bold border-2 border-black dark:border-white bg-gray-300 dark:bg-slate-600  text-black dark:text-white betterhover:hover:bg-gray-400 dark:betterhover:hover:bg-slate-700 transition-colors duration-500">Sign in with your ID</button>
                </div>

                <form className="space-y-4 text-center" onSubmit={onSubmit}>
                    <div className='grid md:grid-cols-2 gap-4 text-left'>
                        {Object.keys(fields).map((field) => (
                            <div key={field} className="flex flex-col">
                                <div className="flex flex-row">
                                    <p>{fields[field].display}</p>
                                    {fields[field].required && <p className="font-bold text-red-600">*</p>}
                                    {fields[field].error !== "" && <p className="mx-2 font-bold">-</p>}
                                    <p className="text-red-600 animate-pulse">{fields[field].error}</p>
                                </div>
                                <input type="text" name={field} value={fields[field].value} maxLength="40" placeholder={"Enter your " + fields[field].display + " here (" + fields[field].placeholder + ")"} onChange={handleChange} className="w-full h-10 border-b-2 text-black dark:text-white border-black dark:border-white bg-transparent focus: transition-colors duration-500" />
                            </div>
                        ))}
                    </div>
                    {error !== "" && <p className="text-red-600 font-bold w-full">{error}</p>}
                    <input type='submit' value='Submit' className={("w-1/2 p-4 rounded-full cursor-pointer border-2 text-black dark:text-white border-black dark:border-white transition-all duration-500 betterhover:hover:scale-110 betterhover:hover:bg-green-300 dark:betterhover:hover:bg-slate-700")} />
                    <p className="text-xs" >* = required field</p>
                </form>

            </div>
        </section>
    )
}

export default Login