import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';

import AppBar from './components/AppBar';
import LandingPage from './components/LandingPage';
import Courses from './components/Courses';
import Login from './components/Login';
import Signup from './components/Signup';
import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import atoms from './store/atoms';
import { CircularProgress } from '@mui/material';
import WindowLoader from './components/common/WindowLoader';
import PageNotFound from './components/PageNotFound';
import Course from './components/Course';
import PurchasedCourses from './components/PurchasedCourses';

const pathSettings = {
  '/': {
    title: 'Home',
    protect: false,
    redirectForLoggedIn: false,
  },
  '/login': {
    title: '',
    protect: false,
    redirectForLoggedIn: true,
  },
  '/signup': {
    title: '',
    protect: false,
    redirectForLoggedIn: true,
  },
  '/courses': {
    title: 'All Courses',
    protect: true,
    redirectForLoggedIn: false,
  },

  '/courses/purchased': {
    title: 'Purchased Courses',
    protect: true,
    redirectForLoggedIn: false,
  },
  '/page-not-found': {
    title: 'Page Not Found',
    protect: false,
    redirectForLoggedIn: false,
  },
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  // Global State
  const setPageTitle = useSetRecoilState(atoms.pageTitle);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(atoms.isLoggedIn);

  // Navigation related sync
  useEffect(() => {
    if (!pathSettings || !pathSettings[pathname]) return;
    const { title, protect, redirectForLoggedIn } = pathSettings[pathname];

    if (title) {
      document.title = 'Coursera | ' + title;
      setPageTitle(title);
    } else {
      document.title = 'Coursera';
      setPageTitle('');
    }

    if (isLoggedIn === false) {
      if (protect) {
        navigate('/login');
      }
    } else if (isLoggedIn === true) {
      if (redirectForLoggedIn) {
        navigate('/');
      }
    }
  }, [pathname, setPageTitle, navigate, isLoggedIn]);

  // Login related sync
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setIsLoggedIn(false);

    try {
      const jwtPayload = JSON.parse(atob(token.split('.')[1]));
      const { exp } = jwtPayload;
      const current = Date.now() / 1000;
      if (current > exp) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        return;
      }
    } catch (err) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }

    setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  return (
    <div>
      <AppBar />
      <>
        <WindowLoader />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/courses/purchased' element={<PurchasedCourses />} />
          <Route path='/courses/*' element={<Course />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/page-not-found' element={<PageNotFound />} />
          <Route path='/*' element={<Navigate to='/page-not-found' />} />
        </Routes>
      </>
    </div>
  );
}

export default App;
