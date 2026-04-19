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

  return (
    <div>
      {/** clicking on the header will bring user back to 'home' */}
      <h1 className="pageHeader" onClick={()=> setSection('home')}>MyDigitalCloset</h1>

      {section === 'login' && <Login setSection={setSection}/>}
      {section === 'home' && <Home setSection={setSection}/>}
      {section === 'addClothing' && <AddClothing setSection={setSection}/>}
      {section === 'myClothes' && <MyClothes/>}
      {section === 'generateOutfit' && <GenerateOutfit/>}
      {section === 'schedule' && <Schedule/>}

    </div>
  )
   
}

export default App;
