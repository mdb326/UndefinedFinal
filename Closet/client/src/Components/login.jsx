import { Box, TextField, Button } from '@mui/material'
// initial landing page for user to log in
function Login( { setSection }){
    return (
        <div>
            <Box className='login-box' sx={{
                borderColor: 'blue',
                width: 300,
                display: 'grid',
                gap: 2
            }}>
            <TextField label="Username" />
            <TextField label="Password" />
            <Button className='home-buttons' 
                // add real account login/creation feature before allowing 
                // user to progress to 'home'.
                onClick={()=> setSection('home')}
                >Log in</Button>
            </Box>
        </div>
    )
}

export default Login