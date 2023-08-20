import { useState } from 'react';
import { BASE_URL } from '../misc/config';
import axios from 'axios';
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [imageLink, setImageLink] = useState('');
  const [published, setPublished] = useState(false);

  async function handleCreateCourse() {
    if (!title || price < 0 || !imageLink) {
      return alert('Title, price and image are mandatory');
    }
    const newCourse = { title, price, imageLink, published };

    try {
      const res = await axios.post(`${BASE_URL}/admin/courses`, newCourse, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      alert(res.data.message);
    } catch (err) {
      alert(err?.response?.data?.message);
    }
  }

  return (
    <div>
      <h1>Create Course Page</h1>
      <input
        type={'text'}
        placeholder='Title'
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <input
        type={'number'}
        placeholder='Price'
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <br />
      <input
        type={'text'}
        placeholder='Image URL'
        onChange={(e) => setImageLink(e.target.value)}
      />
      <br />
      <input
        type={'checkbox'}
        onChange={(e) => setPublished(e.target.checked)}
      />
      <label htmlFor=''>Published?</label>
      <br />
      <button onClick={handleCreateCourse}>Create Course</button>
    </div>
  );
}
export default CreateCourse;
