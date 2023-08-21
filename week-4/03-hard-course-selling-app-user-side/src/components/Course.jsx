import { Alert, Button, Card, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../misc/config';
import { useRecoilState, useSetRecoilState } from 'recoil';
import atoms from '../store/atoms';
function Course() {
  const location = useLocation();
  const navigate = useNavigate();

  // GLOBAL STATE
  const [isLoggedIn] = useRecoilState(atoms.isLoggedIn);
  const setWindowLoading = useSetRecoilState(atoms.windowLoading);

  // LOCAL STATE
  const [course, setCourse] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (isLoggedIn === false) {
      return navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  useEffect(() => {
    async function getCourse() {
      const id = location?.pathname?.split('/')?.at(-1);

      setWindowLoading(true);

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const resCourse = await axios.get(`${BASE_URL}/users/courses/${id}`, {
          headers: { Authorization: 'Bearer ' + token },
        });

        const course = resCourse.data.course;

        const resPurchased = await axios.get(
          `${BASE_URL}/users/purchasedCourses`,
          {
            headers: { Authorization: 'Bearer ' + token },
          }
        );

        const purchasedCourses = resPurchased.data.data;
        const purchasedCourse = purchasedCourses.find((c) => c._id === id);

        if (purchasedCourse) course.purchased = true;
        else course.purchased = false;
        setCourse(course);
        setWindowLoading(false);
      } catch (err) {
        setCourse(null);
        setWindowLoading(false);
      }
    }

    getCourse();
  }, [location, setWindowLoading]);

  async function handleBuyCourse() {
    try {
      setPurchasing(true);
      await axios.post(
        `${BASE_URL}/users/courses/${course._id}`,
        {},
        { headers: { Authorization: 'Basic ' + localStorage.getItem('token') } }
      );

      setPurchasing(false);
    } catch (err) {
      const message = err?.response?.data?.message || 'Course purchase failed';
      alert(message);
      setPurchasing(false);
    }
  }

  if (!course)
    return (
      <Typography
        variant='h4'
        style={{ textAlign: 'center', marginTop: '2rem' }}
      >
        Course Not Found
      </Typography>
    );

  return (
    <div>
      <Card
        style={{
          display: 'grid',
          gridTemplateRows: '25rem 2rem 2rem 3rem',
          width: '25rem',
          margin: '2rem auto',
          padding: '0 0 1rem 0',
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src={course.imageLink} alt='' width='100%' />
        </div>
        <Typography style={{ textAlign: 'center', fontSize: '1.3em' }}>
          {course.title}
        </Typography>

        <Typography style={{ textAlign: 'center' }}>
          Price: {course.price}
        </Typography>

        {!course.purchased && (
          <Button
            variant='contained'
            style={{ margin: '0 2rem' }}
            onClick={handleBuyCourse}
            disabled={purchasing}
          >
            {purchasing ? 'Purchasing Course... ' : 'Buy Course'}
          </Button>
        )}

        {course.purchased && (
          <div
            style={{
              margin: '0',
              borderRadius: '0',
              height: '140%',
              backgroundColor: '#0ca678',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '1rem',
              display: 'flex',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#fff',
              alignItems: 'center',
              textTransform: 'uppercase',
            }}
          >
            Course Already Purchased
          </div>
        )}
      </Card>
    </div>
  );
}

export default Course;
