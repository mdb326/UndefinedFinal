import {useState, useEffect} from 'react'
import Login from './Components/login'
import Home from './Components/home'
import AddClothing from './Components/addClothing'
import MyClothes from './Components/myClothes'
import GenerateOutfit from './Components/generateOutfit'
import Schedule from './Components/schedule'
import Admin from './Components/admin'

function App() {
  // used to show the different pages
  const [section, setSection] = useState('login')
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (!token) {
      setSection('login')
      setUser(null)
      localStorage.removeItem('user')
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (storedUser) {
        setUser(storedUser)
      }
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
      {section === 'home' && user?.is_admin && (
        <button onClick={() => setSection('admin')}>
          Admin Panel
        </button>
      )}

      {section === 'login' && <Login setSection={setSection} setUser={setUser} setToken={setToken}/>}
      {section === 'home' && <Home setSection={setSection}/>}
      {section === 'addClothing' && <AddClothing setSection={setSection} user={user} token={token}/>}
      {section === 'myClothes' && <MyClothes setSection={setSection} user={user} token={token}/>}
      {section === 'generateOutfit' && <GenerateOutfit setSection={setSection} user={user} token={token}/>}
      {section === 'schedule' && <Schedule setSection={setSection} user={user} token={token}/>}
      {section === 'admin' && user?.is_admin && (
        <Admin token={token} />
      )}
    </div>
  )
   
}

export default App;
