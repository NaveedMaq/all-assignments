import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../misc/config';
import { useSetRecoilState } from 'recoil';
import { loginAtom } from '../store/atoms';
import { Button, Card, TextField, Typography } from '@mui/material';

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const setLoginAtom = useSetRecoilState(loginAtom);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/admin/signup`, {
        username: email,
        password,
      });

      const { token } = res.data;

      if (!token) throw new Error('No token received');
      localStorage.setItem('token', token);
      setLoginAtom(true);

      alert('Admin Registered successfully');
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Card style={{ width: '30rem', margin: '0 auto', padding: '1rem 2rem' }}>
        <form
          onSubmit={handleRegister}
          style={{
            display: 'grid',
            rowGap: '1.6rem',
          }}
        >
          <Typography
            variant='h2'
            style={{ fontSize: '3rem', textAlign: 'center' }}
          >
            Admin Sign Up
          </Typography>
          <TextField
            id='outlined-basic'
            label='Email'
            variant='outlined'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            id='outlined-basic'
            label='Password'
            variant='outlined'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant='contained' color='primary' type='submit'>
            Register
          </Button>

          <Typography style={{ textAlign: 'center' }}>
            Already a user? <Link to='/login'>Login</Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}

export default Register;
