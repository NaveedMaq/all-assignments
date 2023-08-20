import { useEffect, useState } from 'react';
import { BASE_URL } from '../misc/config';
import axios from 'axios';

function ShowCourses() {
  document.title = 'Coursera Admin | Courses';
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/courses`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      })
      .then((res) => {
        setCourses(res.data.data.courses);
      })
      .catch((err) => alert(err?.response?.data?.message));
  }, []);

  // Add code to fetch courses from the server
  // and set it in the courses state variable.
  return (
    <div>
      <h1>Create Course Page</h1>
      {courses.map((course) => (
        <Course course={course} key={course._id} />
      ))}
    </div>
  );
}

function Course({ course }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', fontSize: '1.8rem' }}>
      <p>{course.title}</p>
      <p>{course.price}</p>
      <p>{course.description}</p>
      <img
        src={course.imageLink}
        alt={`${course.title} course image`}
        height='50px'
      />
    </div>
  );
}

export default ShowCourses;
