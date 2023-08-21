import { Button, Card, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div>
      <Card
        style={{
          display: 'grid',
          gridTemplateRows: '18rem 2rem 2rem 3rem',
          width: '18rem',
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

        <Button
          variant='contained'
          style={{ margin: '0 2rem' }}
          onClick={() => navigate('/courses/' + course._id)}
        >
          See Course
        </Button>
      </Card>
    </div>
  );
}

export default CourseCard;
