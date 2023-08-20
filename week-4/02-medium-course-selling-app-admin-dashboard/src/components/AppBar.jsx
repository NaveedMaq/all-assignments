import { Link, useNavigate } from 'react-router-dom';

import { useRecoilState } from 'recoil';
import { isLoadingAtom, loginAtom } from '../store/atoms';
import Button from './Button';
import Loader from './Loader';
import { Typography } from '@mui/material';

function AppBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setLoginAtom] = useRecoilState(loginAtom);
  const [isLoading] = useRecoilState(isLoadingAtom);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#1971c2',
        color: '#fff',
        padding: '1rem 2rem',
      }}
    >
      <img
        src='/coursera.svg'
        alt='Coursera Logo'
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer', width: '10rem' }}
      />

      {isLoading && (
        <div
          style={{
            position: 'relative',
            height: '3rem',
            width: '3rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '5rem',
          }}
        >
          <Loader />
        </div>
      )}

      {!isLoading && isLoggedIn && (
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Button
            backgroundColor='#f03e3e'
            color='#fff5f5'
            size='medium'
            onClick={() => {
              localStorage.removeItem('token');
              setLoginAtom(false);
            }}
          >
            Log Out
          </Button>
        </div>
      )}
      {!isLoading && !isLoggedIn && (
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Button
            variant='Link'
            size='medium'
            backgroundColor='#a5d8ff'
            color='#222'
            to='/login'
          >
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
  );
}

export default AppBar;
