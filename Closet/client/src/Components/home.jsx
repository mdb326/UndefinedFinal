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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
        {[
        ['Add Clothing', 'addClothing'],
        ['My Clothes', 'myClothes'],
        ['Generate Outfit', 'generateOutfit'],
        ['Schedule', 'schedule'],
        ].map(([label, section], i) => (
        <Button
            key={section}
            style={{
            backgroundColor: '#2a2a2a',
            color: '#ffffffdd',
            border: '1px solid #3a3a3a',
            borderRadius: '10px',
            padding: '10px 28px',
            fontSize: '0.95rem',
            fontWeight: 500,
            textTransform: 'none',
            }}
            onClick={() => setSection(section)}
        >
            {label}
        </Button>
        ))}
    </div>
    </div>
)
}
export default Home
