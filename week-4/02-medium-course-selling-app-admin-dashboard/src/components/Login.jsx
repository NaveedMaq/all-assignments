import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../misc/config';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { loginAtom } from '../store/atoms';
import { Button, Card, TextField, Typography } from '@mui/material';

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const setLoginAtom = useSetRecoilState(loginAtom);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/admin/login`, {
        username: email,
        password,
      });

      const { token } = res.data;

      if (!token) throw new Error('No token received');

      localStorage.setItem('token', token);
      setLoginAtom(true);

      alert('Logged in successfully');
    } catch (error) {
      alert(error.response.data.message);
      localStorage.removeItem('token');
      setLoginAtom(false);
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Card style={{ width: '30rem', margin: '0 auto', padding: '1rem 2rem' }}>
        <form
          onSubmit={handleLogin}
          style={{
            display: 'grid',
            rowGap: '1.6rem',
          }}
        >
          <Typography
            variant='h2'
            style={{ fontSize: '3rem', textAlign: 'center' }}
          >
            Admin Login
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
            Login
          </Button>

          <Typography style={{ textAlign: 'center' }}>
            New here? <Link to='/register'>Register</Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}

export default Login;
