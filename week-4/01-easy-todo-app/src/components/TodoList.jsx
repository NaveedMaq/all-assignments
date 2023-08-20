import Todo from './Todo';

function TodoList({ todos, setTodos }) {
  return (
    <ul
      style={{
        // backgroundColor: 'red',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        margin: 0,
        marginBottom: '1.2rem',
        padding: 0,
      }}
    >
      {todos.map((todo) => (
        <Todo todo={todo} setTodos={setTodos} key={todo.id} />
      ))}
    </ul>
  );
}

export default TodoList;
