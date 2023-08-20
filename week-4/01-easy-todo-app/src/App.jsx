import { useEffect, useState } from 'react';
import { fetchAllTodos } from './misc/utils';
import AddTodoForm from './components/AddTodoForm';
import Header from './components/Header';
import TodoList from './components/TodoList';

function App() {
  const [todos, setTodos] = useState([]);

  // fetch all todos from server
  useEffect(() => {
    try {
      fetchAllTodos().then((todos) => setTodos(todos));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div
      style={{
        margin: '5rem',
        borderRadius: '10px',
        boxShadow: '0px 0px 21px 7px rgba(0,0,0,0.08)',
        padding: '2rem',
      }}
    >
      <Header />
      <AddTodoForm setTodos={setTodos} />
      <TodoList todos={todos} setTodos={setTodos} />
    </div>
  );
}

export default App;
