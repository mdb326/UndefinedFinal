import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Grid, Chip } from '@mui/material';

function Admin({ token }) {
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    fetch('http://localhost:3000/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  const promoteUser = (id) => {
    fetch(`http://localhost:3000/users/${id}/promote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => getUsers());
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel</h1>

      <Grid container spacing={2}>
  {users.map(u => {
    const itemCount = u.clothing_items?.[0]?.count || 0;

    return (
      <Grid item xs={12} sm={6} md={6} key={u.id} sx={{ display: 'flex' }}>
        <Card sx={{
            backgroundColor: 'white',
            border: '1px solid #333',
            borderRadius: '12px',
            boxShadow: 'none',

            width: '100%',
            flex: 1,            
            height: '220px',

            display: 'flex',
            flexDirection: 'column',
        }}>
          <CardContent sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}>
            <Typography variant="h6">
              {u.username}
            </Typography>

            <Typography variant="body2">
              User ID: {u.id}
            </Typography>

            <Typography variant="body2">
              Items: {itemCount}
            </Typography>

            <div style={{ marginTop: '8px', marginBottom: '8px' }}>
              {u.is_admin ? (
                <Chip label="Admin" color="success" />
              ) : (
                <Chip label="User" />
              )}
            </div>

            {!u.is_admin && (
              <Button
                variant="contained"
                size="small"
                onClick={() => promoteUser(u.id)}
              >
                Promote to Admin
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  })}
</Grid>
    </div>
  );
}

export default Admin;
