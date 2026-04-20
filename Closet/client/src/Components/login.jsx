import { Box, TextField, Button } from '@mui/material'
import { useState } from 'react'
// initial landing page for user to log in
function Login( { setSection }){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    return (
        <div>
            <Box className='login-box' sx={{
                borderColor: 'blue',
                width: 300,
                display: 'grid',
                gap: 2
            }}>
                <TextField label="Username" value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                <TextField label="Password" type="password"
                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Button
                    className='home-buttons'
                    onClick={async () => {
                        try {
                        const res = await fetch('http://localhost:3000/login', {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                            "username": username,
                            "password": password,
                            }),
                        });

                        const data = await res.json();

                        if (!res.ok) {
                            alert(data.error || 'Login failed');
                            return;
                        }

                        setSection('home');

                        } catch (err) {
                        console.error(err);
                        alert('Server error');
                        }
                    }}
                    >
                    Log in
                </Button>
            </Box>
        </div>
    )
}

export default Login