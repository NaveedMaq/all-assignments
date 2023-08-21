import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../misc/config';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isWindowLoadingAtom, loginAtom, pageTitleAtom } from '../store/atoms';
import { Alert, Button, Card, TextField, Typography } from '@mui/material';

import PasswordField from './general/PasswordField';

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [isLoggedIn, setLoginAtom] = useRecoilState(loginAtom);
  const [error, setError] = useState('');

  const [showAlert, setShowAlert] = useState(false);
  const [isLoggingIn, setIsLogginIn] = useState(false);
  const setIsWindowLoading = useSetRecoilState(isWindowLoadingAtom);

  const setPageTitle = useSetRecoilState(pageTitleAtom);

  useEffect(() => {
    if (isLoggedIn) navigate('/');
    setPageTitle('Login');
    setIsWindowLoading(false);
  }, [isLoggedIn, navigate, setPageTitle, setIsWindowLoading]);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      setIsLogginIn(true);
      const res = await axios.post(`${BASE_URL}/admin/login`, {
        username: email,
        password,
      });

      const { token } = res.data;

      if (!token) throw new Error('No token received');

      setShowAlert(true);
      setTimeout(() => {
        localStorage.setItem('token', token);
        setLoginAtom(true);
        setShowAlert(false);
        setIsLogginIn(false);
      }, 2000);
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
      localStorage.removeItem('token');
      setLoginAtom(false);
      setIsLogginIn(false);
    }
  }

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
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
            required
            id='outlined-basic'
            label='Email'
            type='email'
            variant='outlined'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error ? true : false}
            helperText={error}
            disabled={isLoggingIn}
          />

          <PasswordField
            password={password}
            setPassword={setPassword}
            label={'Password'}
            error={error}
            helperText={error}
            disabled={isLoggingIn}
          />

          <Button
            variant='contained'
            color='primary'
            type='submit'
            disabled={isLoggingIn}
          >
            Login
          </Button>

          <Typography style={{ textAlign: 'center' }}>
            New here? <Link to='/register'>Register</Link>
          </Typography>
        </form>
      </Card>

      {showAlert && (
        <Alert
          severity='success'
          style={{
            width: 'fit-content',
            margin: '2rem auto 0rem auto',
            textAlign: 'center',
            fontSize: '1.2rem',
          }}
        >
          You have successfully logged in! Redirecting...
        </Alert>
      )}
    </div>
  );
}

export default Login;
