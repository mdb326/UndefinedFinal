import { useState } from 'react'
import { Button } from '@mui/material'

function GenerateOutfit({ setSection, user, token }){
    //creates a state to store the generated outfit and a state to store the weather label
    const [outfit, setOutfit] = useState([])
    const [weatherLabel, setWeatherLabel] = useState('')

        //function to determine the weather type based on the temperature in Fahrenheit
        const getWeatherType = (tempF) => {
            if (tempF >= 80) return 'hot'
            if (tempF >= 60) return 'warm'
            if (tempF >= 40) return 'cool'
            return 'cold'
        }

        const generateOutfit = () => {
            //Get the user's current location using the Geolocation API, then fetch the weather data for that location from the National Weather Service API. Based on the temperature
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude
                const lon = position.coords.longitude

                //Weather API, get the grid info 
                fetch(`https://api.weather.gov/points/${lat},${lon}`)
                .then(res=> res.json())
                //use the forecast URL from the weather API
                .then(data => fetch(data.properties.forecast))
                .then(res => res.json())
                //Get the temperature, map it to the weather type, and then get outfit that matches weather type 
                .then(forecastData=> {
                    const temp = forecastData.properties.periods[0].temperature
                    const weatherType = getWeatherType(temp)
                    setWeatherLabel(`${temp}°F — ${weatherType}`)
                    
                    //Random outfit after temperature filters 
                    fetch(`http://localhost:3000/outfit?weather_type=${weatherType}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                        .then(res=> res.json())
                        .then(outfitData => setOutfit(outfitData))
                })
         } )
    }

    return (
        <div>
            <button className='back-button' onClick={() => (setSection('home'))}>Back</button>
            <h1>Generate Outfit</h1>
            <Button variant = 'contained' onClick={generateOutfit}>Generate Outfit</Button>

            {/*Show the current weather*/}
            {weatherLabel && <p>Today's Weather: {weatherLabel}</p>}

            {/*Show the outfit cards*/}
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px'}}>
                {outfit.map(item => (
                    <div key = {item.id} style={{border: '1px solid #ccc', borderRadius:'8px', padding: '12px', width: '160px'}}>
                        {item.picture_url && (
                            <img src={item.picture_url} alt={item.name} style={{width: '100%', borderRadius: '4px'}}/>
                        )}
                        <p><strong>{item.name}</strong></p>
                        <p>{item.clothing_type} - {item.weather_type}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GenerateOutfit
