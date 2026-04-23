import { useState, useEffect } from 'react'
import { Button, MenuItem, TextField } from '@mui/material'

function Schedule({user, token}){
    //creates a state to store the clothes of the user and a state to store the schedule map which maps each day to the saved outfit for that day
    const[clothes, setClothes] = useState([])
    const[scheduleMap, setScheduleMap] = useState({})   
    
    //creates an array of the next 7 days
    const getNextSevenDays = () => {
        const days=[]
        for(let i=0; i<7; i++){
            const date = new Date()
            date.setDate(date.getDate() + i)
            days.push(date.toISOString().split('T')[0])
        }
        return days
}

const days = getNextSevenDays()

//gets all the clothing items to fill the dropdown 
const getClothes = () => {
    fetch(`http://localhost:3000/clothing`, {
        headers: {
        Authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => setClothes(data))
}

//gets all the clothing items that were saved for that day 
 const getSavedOutfits = () => {
    const map = {}
    days.forEach(day=> {
        fetch(`http://localhost:3000/clothing?saved_for_day=${day}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res=> res.json())
            .then(data=> {
                map[day]= data
                setScheduleMap(prev=>({...prev, [day]: data}))
                })
            })
    }

    //first load
    useEffect(() => {
        if (token){
            getClothes()
            getSavedOutfits()
        }
    },[token])

    //assigns the clothing item to the specific day 
    const saveItemForDay = (itemId, day) => {
        fetch(`http://localhost:3000/clothing/item/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({saved_for_day: day})
        }).then(() => getSavedOutfits())
    }

    //removes the clothing item from the specific day 
    const removeItemFromDay = (itemId) => {
        fetch(`http://localhost:3000/clothing/item/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({saved_for_day: null})
        }).then(() => getSavedOutfits())
    }
    
    return (
        <div> 
            <h1>Weekly Schedule</h1>

            {/*Creates a card for the next 7 days*/}
            {days.map(day=> (
                <div key={day} style={{border: '1px solid #ccc', borderRadius:'8px', padding: '12px', marginBottom: '16px'}}>
                <h3>{day}</h3>

                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px'}}>
                    {scheduleMap[day] && scheduleMap[day].map(item => (
                        <div key={item.id} style={{border: '1px solid #aaa', borderRadius:'6px', padding: '8px', width: '120px'}}>
                            {item.picture_url && (
                                <img src={item.picture_url} alt={item.name} style={{width: '100%', borderRadius: '4px'}}/>
                    )}
                    <p style={{margin:'4px 0'}}><strong>{item.name}</strong></p>
                    <Button color="error" size="small" onClick={() => removeItemFromDay(item.id)}>Remove</Button>
                    </div>
            ))}
        </div>

        {/*Dropdown*/}
        <TextField select label="Add item" style ={{width:200}}
         onChange={e => saveItemForDay(e.target.value, day)}>
        {clothes.map(item => (
        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
        ))}
        </TextField>
        </div>
    ))}
    </div>
    )
}
 
export default Schedule 
