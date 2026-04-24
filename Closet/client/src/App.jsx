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
  
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (!token) {
      setSection('login')
    }
  }, [token])

  return (
    <div>
      {/** clicking on the header will bring user back to 'home' 
       * Only if the user is logged in ..
      */}
      <h1 className="pageHeader" onClick={()=> {
        if(user !== null){
          setSection('home')}
        }
      }
      >MyDigitalCloset</h1>

      {section === 'login' && <Login setSection={setSection} setUser={setUser} setToken={setToken}/>}
      {section === 'home' && <Home setSection={setSection}/>}
      {section === 'addClothing' && <AddClothing setSection={setSection} user={user} token={token}/>}
      {section === 'myClothes' && <MyClothes user={user} token={token}/>}
      {section === 'generateOutfit' && <GenerateOutfit user={user} token={token}/>}
      {section === 'schedule' && <Schedule user={user} token={token}/>}

    </div>
  )
   
}

export default App;
