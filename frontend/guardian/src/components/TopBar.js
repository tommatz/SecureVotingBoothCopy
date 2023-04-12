const TopBar = () => {
  return (
    <section id="topbar" className="h-[5%] w-full border-b-4 overflow-hidden border-black bg-green-600">
      <div className="flex flex-row h-full w-full items-center px-4 space-x-4 text-sm sm:text-base md:text-xl">
        <div className="flex flex-row h-full w-full items-center font-bold">
          <p className="w-full text-center">ElectionGuard</p>
        </div>
      </div>
    </section>
  )
}

export default TopBar