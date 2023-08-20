import { useState } from 'react';
import { fetchAllTodos } from '../misc/utils';
import axios from 'axios';
import { BASE_URL } from '../misc/config';

function AddTodoForm({ setTodos }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleAddTodo(e) {
    e.preventDefault();

    if (!title || !description) return;

    try {
      axios
        .post(`${BASE_URL}/todos`, {
          title,
          description,
        })
        .then(() => {
          setTitle('');
          setDescription('');
          fetchAllTodos().then((todos) => setTodos(todos));
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <Input
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        placeholder='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        style={{
          border: 'none',
          backgroundColor: '#f03e3e',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          height: '3.5rem',
          width: '3.5rem',
          fontSize: '2rem',
          borderRadius: '50%',
        }}
        onClick={handleAddTodo}
      >
        +
      </button>
    </form>
  );
}

function Input({ placeholder, value, onChange }) {
  return (
    <input
      style={{
        height: '3rem',
        width: '20rem',
        borderRadius: '7px',
        textAlign: 'center',
        fontSize: '1.5rem',
        border: '1px solid black',
        color: '#f03e3e',
        marginBottom: '3rem',
      }}
      type='text'
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default AddTodoForm;
