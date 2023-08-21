import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
} from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import {
  isLoadingAtom,
  isWindowLoadingAtom,
  loginAtom,
  pageTitleAtom,
} from './store/atoms';

import AppBar from './components/AppBar';
import Landing from './components/Landing';
import Login from './components/Login';
import CreateCourse from './components/CreateCourse';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';
import PageNotFound from './components/PageNotFound';
import WindowLoader from './components/general/WindowLoader';

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
  const [isLoggedIn, setLoginAtom] = useRecoilState(loginAtom);
  const [pageTitle] = useRecoilState(pageTitleAtom);
  const setLoadingAtom = useSetRecoilState(isLoadingAtom);
  const [isWindowLoading] = useRecoilState(isWindowLoadingAtom);

  useEffect(() => {
    if (!pageTitle) return document.title;
    document.title = `Coursera Admin | ${pageTitle}`;
  }, [pageTitle]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoginAtom(true);
    } else setLoginAtom(false);

    setTimeout(() => {
      setLoadingAtom(false);
    }, 300);
  }, [setLoginAtom, setLoadingAtom]);

  return (
    <>
      {isLoggedIn === undefined || (isWindowLoading && <WindowLoader />)}
      <Router>
        <AppBar />
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/create-course' element={<CreateCourse />} />
          <Route path='/courses' element={<ShowCourses />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
