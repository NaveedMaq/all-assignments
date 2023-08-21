import { Button, Card, Typography } from '@mui/material';
import { useRecoilState } from 'recoil';
import atoms from '../store/atoms';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  // GLOBAL STATE
  const [isLoggedIn] = useRecoilState(atoms.isLoggedIn);

  return (
    <div>
      {/* <Link to='/courses'>Courses</Link>
      <div></div>
      <Link to='/courses/purchased'>Purchased Courses</Link> */}

      <Typography
        variant='h3'
        style={{ textAlign: 'center', color: '#444', marginTop: '2rem' }}
      >
        Welcome to Coursera!
      </Typography>

      {isLoggedIn && (
        <Card
          style={{
            width: 'fit-content',
            padding: '1rem 2rem',
            margin: '4rem auto',
            display: 'flex',
            gap: '1.2rem',
          }}
        >
          <Button variant='contained' onClick={() => navigate('/courses')}>
            All Courses
          </Button>
          <Button
            variant='contained'
            onClick={() => navigate('/courses/purchased')}
          >
            View your courses
          </Button>
        </Card>
      )}
      {!isLoggedIn && (
        <Card
          style={{
            width: 'fit-content',
            padding: '1rem 2rem',
            margin: '4rem auto',
            display: 'flex',
            gap: '1.2rem',
          }}
        >
          <Button variant='contained' onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button
            variant='contained'
            color='success'
            onClick={() => navigate('/signup')}
          >
            Signup
          </Button>
        </Card>
      )}
    </div>
  );
}

export default LandingPage;
