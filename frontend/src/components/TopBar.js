const TopBar = () => {

  //Any page JSX would go up here

  /*This return statement is what gets passed up to the App.js then to the index.js
  it is then displayed on the user's screen as the html within the return statement*/
  return (
    <section id="topbar" className="bg-green-800">
      <div className="flex flex-row px-4 justify-between text-xl">
        <p>Name/ID</p>
        <p>City/Country</p>
        <p>State</p>
      </div>
    </section>
  )
}

export default TopBar