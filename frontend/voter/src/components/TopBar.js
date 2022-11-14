const TopBar = ({darkMode, setDarkMode, login, setLogin}) => {
  return (
    <section id="topbar" className="h-[5%] w-full border-b-4 border-black dark:border-white bg-green-600 dark:bg-slate-700 transition-colors duration-500">
      <div className="flex flex-row h-full w-full items-center px-4 space-x-4 text-black dark:text-white transition-colors duration-500 text-sm sm:text-base md:text-xl">
        {login["active"] && <button onClick={() => setLogin({...login, "active" : false})} className="font-bold text-red-600 stroke scale-150 betterhover:hover:text-red-400 transition-colors duration-500">X</button>}
        <div className="flex flex-row h-full w-full items-center justify-between font-bold">
          {login["active"] ? <p>{login["name"]}</p> : <p></p>}
          <p>ElectionGuard</p>
          {login["active"] ? <p>{login["location"]}</p> : <p></p>}
        </div>
        <span className="h-full w-1 bg-black dark:bg-white transition-colors duration-500" />
        <button onClick={() => setDarkMode(!darkMode)} className="betterhover:hover:scale-150 transition-transform duration-300" > 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 stroke-black dark:stroke-white transition-colors duration-500">
            <path strokeLinecap="round" strokeLinejoin="round" d={darkMode ? "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" : "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"} />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default TopBar