import { useEffect, useState } from 'react';
import { BASE_URL } from '../misc/config';
import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { isWindowLoadingAtom, loginAtom, pageTitleAtom } from '../store/atoms';
import { Card, Typography } from '@mui/material';

function ShowCourses() {
  const [courses, setCourses] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginAtom);
  const setIsWindowLoading = useSetRecoilState(isWindowLoadingAtom);

  const setPageTitle = useSetRecoilState(pageTitleAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn === false) navigate('/login');

    setPageTitle('Courses');
  }, [isLoggedIn, navigate, setPageTitle]);

  useEffect(() => {
    setIsWindowLoading(true);

    if (isLoggedIn) {
      axios
        .get(`${BASE_URL}/admin/courses`, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        })
        .then((res) => {
          setCourses(res.data.data.courses);
          setIsWindowLoading(false);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            alert('You have been logged out');
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setIsWindowLoading(false);
          }
        });
    }
  }, [isLoggedIn, setIsLoggedIn, setIsWindowLoading]);

  // Add code to fetch courses from the server
  // and set it in the courses state variable.

  if (courses.length === 0) {
    return (
      <Typography
        variant='h3'
        style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: '#888',
          position: 'absolute',
          top: '40%',
          width: '100%',
        }}
      >
        No courses found
      </Typography>
    );
  }
  return (
    <div>
      <Typography style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        {courses.length} course{courses.length > 1 ? 's' : ''} found
      </Typography>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          marginTop: '2rem',
        }}
      >
        {courses.map((course) => (
          <Course course={course} key={course._id} />
        ))}
      </div>
    </div>
  );
}

function Course({ course }) {
  return (
    <Card
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '10rem 2rem 2rem 2rem',
        justifyItems: 'center',
        width: '15rem',
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <img
          src={course.imageLink}
          alt={course.title}
          style={{ width: '100%' }}
        />
      </div>
      <div></div>

      <Typography
        style={{
          fontWeight: 'bold',
        }}
      >
        {course.title}
      </Typography>

      <Typography>Price ${course.price}</Typography>
    </Card>
  );
}

export default ShowCourses;
