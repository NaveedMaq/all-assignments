import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../misc/config';
import { useSetRecoilState } from 'recoil';
import atoms from '../store/atoms';
import { Typography } from '@mui/material';
import CourseCard from './CourseCard';

function Courses() {
  const [courses, setCourses] = useState([]);
  const setWindowLoading = useSetRecoilState(atoms.windowLoading);

  useEffect(() => {
    async function loadCourses() {
      try {
        setWindowLoading(true);
        const token = localStorage.getItem('token');

        if (!token) return setWindowLoading(false);
        const res = await axios.get(`${BASE_URL}/users/courses`, {
          headers: { Authorization: 'Bearer ' + token },
        });
        console.log(res.data.data.courses);

        setCourses(res.data.data.courses);
        setWindowLoading(false);
      } catch (err) {
        setCourses([]);
        console.log(
          err?.response?.data?.message || err.message || 'Could not get courses'
        );
        setWindowLoading(false);
      }
    }

    loadCourses();
  }, [setCourses, setWindowLoading]);

  if (courses.length === 0) {
    return (
      <Typography
        varient='h2'
        style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginTop: '4rem',
          color: '#666',
        }}
      >
        No Courses Found
      </Typography>
    );
  }

  return (
    <div>
      <Typography
        variant='h6'
        style={{ textAlign: 'center', marginTop: '1rem' }}
      >
        {courses.length} course{courses.length !== 1 && 's'} found
      </Typography>
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          padding: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {courses.map((c) => (
          <CourseCard course={c} key={c._id} />
        ))}
      </div>
    </div>
  );
}

export default Courses;
