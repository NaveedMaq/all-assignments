import axios from 'axios';
import { fetchAllTodos } from '../misc/utils';
import { BASE_URL } from '../misc/config';

function Todo({ todo, setTodos }) {
  // Add a delete button here so user can delete a TODO.

  function handleCheckTodo(e, id) {
    const todoPatch = { completed: e.target.checked };

    axios
      .put(`${BASE_URL}/todos/${id}`, todoPatch)
      .then(() => {
        fetchAllTodos().then((todos) => setTodos(todos));
      })
      .catch((error) => console.log(error));
  }

  function handleDeleteTodo(id) {
    axios
      .delete(`${BASE_URL}/todos/${id}`)
      .then((res) => {
        if (res.data === 'OK') {
          fetchAllTodos().then((todos) => setTodos(todos));
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <li
      style={{
        // background: 'red',
        borderRadius: '7px',
        display: 'grid',
        gridTemplateColumns: '5fr 20fr 65fr 10fr',
        alignItems: 'center',
        justifyContent: 'left',
        fontSize: '1.6rem',
        padding: '1rem 2rem',
        // margin: '0rem 1rem',
      }}
    >
      <input
        type='checkbox'
        defaultChecked={todo.completed}
        onChange={(e) => handleCheckTodo(e, todo.id)}
      />
      <div style={{ fontWeight: 'bold' }}>{todo.title}</div>
      <div>{todo.description}</div>
      <button
        style={{
          border: '2px solid #f03e3e',
          backgroundColor: '#fff',
          color: '#f03e3e',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '2rem',
          width: '2rem',
          padding: '1rem',
          borderRadius: '50%',
          fontSize: '1rem',
          cursor: 'pointer',
        }}
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ❌
      </button>
    </li>
  );
}

export default Todo;
