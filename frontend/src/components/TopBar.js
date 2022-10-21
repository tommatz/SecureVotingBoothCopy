const TopBar = ({darkMode, setDarkMode}) => {

  const name = "Name/ID here"
  const location = "Location here"

  /*This return statement is what gets passed up to the App.js then to the index.js
  it is then displayed on the user's screen as the html within the return statement*/
  return (
    <section id="topbar" className="bg-gradient-to-b from-green-500 to-green-600 dark:from-slate-700 dark:to-slate-500 h-[5%] w-full">
      <div className="flex flex-row h-full w-full items-center px-4 space-x-4 dark:text-white font-bold text-sm sm:text-base md:text-xl">
        <div className="flex flex-row h-full w-full items-center justify-between">
          <p>{name}</p>
          <p>ElectionGuard</p>
          <p>{location}</p>
        </div>
        <span className="h-full w-1 bg-black dark:bg-white" />
        <button onClick={() => setDarkMode(!darkMode)} > B </button>
      </div>
    </section>
  )
}

export default TopBar