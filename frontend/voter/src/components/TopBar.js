import { useState } from "react"

const TopBar = ({darkMode, setDarkMode, login, setLogin}) => {

  const [menu, setMenu] = useState(false)

  return (
    <section id="topbar" className="h-[5%] w-full border-b-4 border-black dark:border-white bg-green-600 dark:bg-slate-700 transition-colors duration-500">
      
      <section id="bar" className="flex flex-row h-full w-full items-center px-4 space-x-4 text-black dark:text-white transition-colors duration-500 text-sm sm:text-base md:text-xl">
        <div className="flex flex-row h-full w-full items-center justify-between font-bold">
          {login["active"] ? <p>{login["name"]}</p> : <p></p>}
          <p>ElectionGuard</p>
          {login["active"] ? <p>{login["location"]}</p> : <p></p>}
        </div>
        <span className="h-full w-1 bg-black dark:bg-white transition-colors duration-500"/>
        <button onClick={() => setMenu(!menu)} className="betterhover:hover:scale-150 transition-transform duration-300"> 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 stroke-black dark:stroke-white transition-colors duration-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </section>

      <section id="menu" className={`absolute top-[5%] transition-all duration-300 ${!menu ? "-right-1/4" : "right-0"}`} >
        <div className={`flex flex-col border-b-4 border-l-4 border-black dark:border-white bg-green-600 dark:bg-slate-700 transition-colors duration-500 ${!menu && "hidden"}`}>
          <button onClick={() => setLogin({...login, "active" : false}, setMenu(false))} className={`w-full flex items-center justify-end space-x-4 p-4 betterhover:hover:scale-110 transition-transform duration-300 ${!login["active"] && "hidden"}`}>
            <p className="text-black dark:text-white transition-colors duration-500 text-sm sm:text-base md:text-xl">Logout</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 stroke-black dark:stroke-white transition-colors duration-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {login["active"] && <span className="h-1 w-full bg-black dark:bg-white transition-colors duration-500"/>}
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-end space-x-4 p-4 betterhover:hover:scale-110 transition-transform duration-300" > 
            <p className="text-black dark:text-white transition-colors duration-500 text-sm sm:text-base md:text-xl">Dark Mode</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 stroke-black dark:stroke-white transition-colors duration-500">
              <path strokeLinecap="round" strokeLinejoin="round" d={darkMode ? "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" : "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"} />
            </svg>
          </button>
        </div>
      </section>

    </section>
  )
}

export default TopBar