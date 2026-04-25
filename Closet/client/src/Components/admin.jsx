import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

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
    <div>
      <h1>Admin Panel</h1>

      {users.map(u => (
        <div key={u.id}>
          <span>{u.username}</span>
          {!u.is_admin && (
            <Button onClick={() => promoteUser(u.id)}>
              Promote
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Admin;