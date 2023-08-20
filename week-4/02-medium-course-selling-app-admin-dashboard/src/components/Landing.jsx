import { Typography } from '@mui/material';
import Button from './Button';
import { useRecoilState } from 'recoil';
import { loginAtom } from '../store/atoms';
/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
  const [isLoggedIn] = useRecoilState(loginAtom);
  console.log({ isLoggedIn });
  return (
    <div>
      <Typography variant='h3'>Welcome to coursera!</Typography>

      <div>
        {isLoggedIn ? (
          <>Site Content</>
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
      </div>
    </div>
  );
}

export default Landing;
