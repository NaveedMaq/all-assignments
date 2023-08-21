import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Logo from './Logo';
import atoms from '../store/atoms';

function ButtonAppBar() {
  const navigate = useNavigate();

  // State
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(atoms.isLoggedIn);
  const [pageTitle] = useRecoilState(atoms.pageTitle);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Logo />
          <Typography
            variant='h6'
            style={{ fontSize: '1rem' }}
            component='div'
            sx={{ flexGrow: 1 }}
          >
            {pageTitle}
          </Typography>

          {!isLoggedIn && (
            <>
              <Button color='inherit' onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color='inherit' onClick={() => navigate('/signup')}>
                Signup
              </Button>
            </>
          )}

          {isLoggedIn && (
            <>
              <Button color='inherit' onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ButtonAppBar;
