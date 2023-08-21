import { useEffect, useState } from 'react';
import { BASE_URL } from '../misc/config';
import axios from 'axios';
import { loginAtom, pageTitleAtom } from '../store/atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, TextField, Typography } from '@mui/material';

function CreateCourse() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [imageLink, setImageLink] = useState('');
  const [error, setError] = useState('');

  const [isLoggedIn] = useRecoilState(loginAtom);
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  const setPageTitle = useSetRecoilState(pageTitleAtom);

  useEffect(() => {
    if (isLoggedIn === false) navigate('/login');
    setPageTitle('Create Course');
  }, [isLoggedIn, navigate, setPageTitle]);

  async function handleCreateCourse(e) {
    e.preventDefault();
    if (price < 0) {
      return setError('Price cannot be negative');
    }

    setIsCreatingCourse(true);
    const newCourse = { title, price, imageLink };

    try {
      const res = await axios.post(`${BASE_URL}/admin/courses`, newCourse, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      setShowAlert(true);
      setAlertSeverity('success');
      setAlertMessage(res.data.message);

      setTitle('');
      setPrice(0);
      setImageLink('');
      setError('');

      setTimeout(() => {
        setShowAlert(false);
        setAlertSeverity('success');
        setAlertMessage('');
      }, 5_000);
    } catch (err) {
      setError('');
      setShowAlert(true);
      setAlertSeverity('error');
      setAlertMessage(
        err?.response?.data?.message ||
          err?.message ||
          'Could not create course'
      );
    }

    setIsCreatingCourse(false);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Card
        style={{
          width: '30rem',
          margin: '0 auto',
          padding: '2rem 2rem 3.5rem 2rem',
        }}
      >
        <form
          onSubmit={handleCreateCourse}
          style={{
            display: 'grid',
            rowGap: '1.6rem',
          }}
        >
          <Typography
            variant='h2'
            style={{ fontSize: '2rem', textAlign: 'center' }}
          >
            Create New Course
          </Typography>

          <TextField
            required
            id='outlined-basic'
            label='Title'
            variant='outlined'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isCreatingCourse}
          />

          <TextField
            required
            id='outlined-basic'
            label='Price'
            type='number'
            variant='outlined'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={error ? true : false}
            helperText={error}
            disabled={isCreatingCourse}
          />

          <TextField
            required
            id='outlined-basic'
            label='Image Link'
            variant='outlined'
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            disabled={isCreatingCourse}
          />

          <Button
            variant='contained'
            color='primary'
            type='submit'
            disabled={isCreatingCourse}
          >
            Create Course
          </Button>
        </form>
      </Card>

      {showAlert && (
        <Alert
          severity={alertSeverity}
          style={{
            width: 'fit-content',
            margin: '1rem auto 0rem auto',
            textAlign: 'center',
            fontSize: '1.2rem',
            position: 'absolute',
            bottom: '5%',
          }}
        >
          {alertMessage}
        </Alert>
      )}
    </div>
  );
}
export default CreateCourse;
