import React from 'react'
import { useState, useEffect } from 'react'
import closetIcon from '../assets/closet1.png'
import { Button } from '@mui/material'
// Home component
// after user logs in --> get directed to home component
// this is where user can direct to add clothing, my clothes, generate outfit, and schedule
function Home( {setSection }){

    return (
        <div
        className="homeAll"
        style={{
        width: '1300px',
        height: '900px',
        backgroundImage: `url(${closetIcon})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '270px'
        }}
        >
            <div className='home-buttons'
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '12px',
                    color: 'black',
                    fontSize: '1px'
                }}>
                <Button style={{ backgroundColor: '#ebebebff', color: 'black' }} 
                    onClick={()=>{
                        setSection('addClothing')
                    }}
                > 
                    Add Clothing
                </Button>
                <Button style={{
                    marginBottom: '105px',
                    backgroundColor: '#ebebebff',
                    color: 'black'
                }}
                    onClick={()=>{
                        setSection('myClothes')
                    }}
                >
                    My Clothes
                </Button>
                <Button style={{ backgroundColor: '#ebebebff', color: 'black' }}
                    onClick={()=>{
                        setSection('generateOutfit')
                    }}
                >
                    Generate Outfit
                </Button>
                <Button style={{ backgroundColor: '#ebebebff', color: 'black' }}
                    onClick={()=>{
                        setSection('schedule')
                    }}
                >
                    Schedule
                </Button>
            </div>
            
        </div>
    )
}
export default Home
