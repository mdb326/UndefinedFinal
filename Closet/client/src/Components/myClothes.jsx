import { useEffect, useState } from 'react'
import { Button, MenuItem, TextField, Stack} from  '@mui/material'

function MyClothes({ user }) {
    //creates a state that stores the clothes of the user, and two states for the filters
    const[clothes, setClothes] = useState([])
    const[clothingTypeFilter, setClothingTypeFilter] = useState('')
    const[weatherTypeFilter, setWeatherTypeFilter] = useState('')

//fetches the clothing items for the logged in user 
const getClothes = () => {
    let url = `http://localhost:3000/clothing/${user.id}?`
    if(clothingTypeFilter) url += `clothing_type=${clothingTypeFilter}&`
    if(weatherTypeFilter) url += `weather_type=${weatherTypeFilter}&`

    fetch(url)
        .then(res => res.json())
        .then(data => setClothes(data))
}

//fetches the clothes on reload
useEffect(()=> {
    getClothes()
}, [])

//deletes a clothing item and then refetches the clothes to update the list
const deleteItem = (id) => {
    fetch(`http://localhost:3000/clothing/item/${id}`, {method: 'DELETE'})
    .then(() => getClothes())
}

return(
    <div>
        <h1>My Clothes</h1>

        {/*Filter section with dropdowns for clothing type and weather type, and a button to apply the filters*/}
        <Stack direction='row' spacing={2} style={{marginBottom: '20px'}}>
            <TextField select label = "Clothing Type" value={clothingTypeFilter} onChange={e => setClothingTypeFilter(e.target.value)}
                style={{width: 150}}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
                <MenuItem value="outerwear">Outerwear</MenuItem>
                <MenuItem value="shoes">Shoes</MenuItem>
                <MenuItem value="accessory">Accessory</MenuItem>
            </TextField>

            <TextField select label = "Weather Type" value={weatherTypeFilter} onChange={e => setWeatherTypeFilter(e.target.value)}
            style ={{width: 150}}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="hot">Hot</MenuItem>
                <MenuItem value="warm">Warm</MenuItem>
                <MenuItem value="cool">Cool</MenuItem>
                <MenuItem value="cold">Cold</MenuItem>
            </TextField>

            <Button variant="contained" onClick={getClothes}>Filter</Button>
        </Stack>
        
        {/* Displays all the clothing item as cards */}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
            {clothes.map(item=>(
                <div key ={item.id} style={{border: '1px solid #ccc', borderRadius:'8px', padding: '8px', width: '200px'}}>
                    {item.picture_url &&(
                        <img src={item.picture_url} alt={item.name} style={{width: '100%', borderRadius: '4px'}}/>
                    )}
                <p><strong>{item.name}</strong></p>
                <p>{item.clothing_type} - {item.weather_type}</p>
                <Button color = 'error' onClick={() => deleteItem(item.id)}>Delete</Button>
        </div>
            ))}
    </div>
    </div>
)
}

export default MyClothes
