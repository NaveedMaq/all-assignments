import { Button, Card, TextField, Typography } from '@mui/material';
import PasswordField from './common/PasswordField';

import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../misc/config';
import { useSetRecoilState } from 'recoil';
import atoms from '../store/atoms';

function Signup() {
  // Global State
  const setIsLoggedIn = useSetRecoilState(atoms.isLoggedIn);

  // Local State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup(e) {
    e.preventDefault();
    const userAuth = { username: email, password };

    setLoading(true);
    try {
      // Sign up
      const res = await axios.post(`${BASE_URL}/users/signup`, userAuth);

      // Login
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);

      setLoading(false);
      setError('');
      setEmail('');
      setPassword('');
    } catch (err) {
      const errorMessage =
        err.response.data.message || err.message || 'Could not sign in';
      setError(errorMessage);

      // Logout
      localStorage.removeItem('token');
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '3rem' }}>
      <Card style={{ width: '30rem', margin: '0 auto' }}>
        <form
          style={{
            display: 'grid',
            rowGap: '2rem',
            padding: '1rem 2.5rem 3rem 2.5rem',
          }}
          onSubmit={handleSignup}
        >
          <Typography
            variant='h1'
            style={{ fontSize: '2rem', textAlign: 'center' }}
          >
            Coursera Signup
          </Typography>
          <TextField
            disabled={isLoading}
            id='outlined-basic'
            label='Email'
            variant='outlined'
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error ? true : false}
            helperText={error}
          />

          <PasswordField
            password={password}
            setPassword={setPassword}
            disabled={isLoading}
            error={error ? true : false}
            helperText={error}
          />

          <Button variant='contained' type='submit' disabled={isLoading}>
            {isLoading ? 'Signing you up...' : 'Sign up'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Signup;