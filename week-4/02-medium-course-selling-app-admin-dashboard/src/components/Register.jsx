import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../misc/config';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loginAtom, pageTitleAtom } from '../store/atoms';
import { Alert, Button, Card, TextField, Typography } from '@mui/material';
import PasswordField from './general/PasswordField';

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const [isLoggedIn, setLoginAtom] = useRecoilState(loginAtom);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');

  const [showAlert, setShowAlert] = useState(false);
  const [isLoggingIn, setIsLogginIn] = useState(false);

  const setPageTitle = useSetRecoilState(pageTitleAtom);

  useEffect(() => {
    if (isLoggedIn) navigate('/');
    setPageTitle('Signup');
  }, [isLoggedIn, navigate, setPageTitle]);

  async function handleRegister(e) {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      return setError("Passwords don't match");
    }

    try {
      setIsLogginIn(true);
      const res = await axios.post(`${BASE_URL}/admin/signup`, {
        username: email,
        password,
      });

      const { token } = res.data;

      if (!token) throw new Error('Could not login');

      setShowAlert(true);
      setTimeout(() => {
        localStorage.setItem('token', token);
        setLoginAtom(true);
        setShowAlert(false);
        setIsLogginIn(false);
      }, 2000);
    } catch (error) {
      setEmailError(error?.response?.data?.message || 'Signup Unsuccessful');
      setError(error?.response?.data?.message || 'Signup Unsuccessful');

      localStorage.removeItem('token');
      setLoginAtom(false);
      setIsLogginIn(false);
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
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={emailError ? true : false}
            helperText={emailError}
            disabled={isLoggingIn}
          />

          <PasswordField
            password={password}
            setPassword={setPassword}
            label={'Password'}
            error={error ? true : false}
            helperText={error}
            disabled={isLoggingIn}
          />
          <PasswordField
            password={confirmPassword}
            setPassword={setConfirmPassword}
            label={'Confirm Password'}
            error={error ? true : false}
            helperText={error}
            disabled={isLoggingIn}
          />

          <Button
            variant='contained'
            color='primary'
            type='submit'
            disabled={isLoggingIn}
          >
            Register
          </Button>

          <Typography style={{ textAlign: 'center' }}>
            Already a user? <Link to='/login'>Login</Link>
          </Typography>
        </form>
      </Card>

      {showAlert && (
        <Alert
          severity='success'
          style={{
            width: 'fit-content',
            position: 'absolute',
            textAlign: 'center',
            bottom: '5%',
            fontSize: '1.2rem',
          }}
        >
          You have successfully signed up! Redirecting...
        </Alert>
      )}
    </div>
  );
}

export default Register;
