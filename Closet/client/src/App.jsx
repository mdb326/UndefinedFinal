import {useState, useEffect} from 'react'
import Login from './Components/login'
import Home from './Components/home'
import AddClothing from './Components/addClothing'
import MyClothes from './Components/myClothes'
import GenerateOutfit from './Components/generateOutfit'
import Schedule from './Components/schedule'

function App() {
  // used to show the different pages
  const [section, setSection] = useState('login')
  const [user, setUser] = useState(null)

  return (
    <div>
      {/** clicking on the header will bring user back to 'home' */}
      <h1 className="pageHeader" onClick={()=> setSection('home')}>MyDigitalCloset</h1>

      {section === 'login' && <Login setSection={setSection} setUser={setUser}/>}
      {section === 'home' && <Home setSection={setSection}/>}
      {section === 'addClothing' && <AddClothing setSection={setSection} user={user}/>}
      {section === 'myClothes' && <MyClothes user={user}/>}
      {section === 'generateOutfit' && <GenerateOutfit user={user}/>}
      {section === 'schedule' && <Schedule user={user}/>}

    </div>
  )
   
}

export default App;
