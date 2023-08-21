import { Card, Typography } from '@mui/material';
import Button from './general/Button';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loginAtom, pageTitleAtom } from '../store/atoms';
import { useEffect } from 'react';
/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
  const [isLoggedIn] = useRecoilState(loginAtom);
  const setPageTitle = useSetRecoilState(pageTitleAtom);

  useEffect(() => {
    setPageTitle('Home');
  }, [setPageTitle]);

  return (
    <div>
      <Typography
        variant='h3'
        style={{ textAlign: 'center', marginTop: '2rem' }}
      >
        Welcome to coursera!
      </Typography>

      <Card
        style={{
          display: 'flex',

          justifyContent: 'center',
          alignItems: 'center',
          margin: '5rem auto',
          padding: '2rem',
          width: 'fit-content',
        }}
      >
        {isLoggedIn ? (
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Button variant='Link' size='medium' to='/create-course'>
              Create Course
            </Button>
            <Button
              size='medium'
              variant='Link'
              backgroundColor='#0ca678'
              color='#fff'
              to='/courses'
            >
              View Courses
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Button variant='Link' size='medium' to='/login'>
              Log In
            </Button>
            <Button
              size='medium'
              variant='Link'
              backgroundColor='#0ca678'
              color='#fff'
              to='/register'
            >
              Sign Up
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Landing;
