import React, { useReducer, useState } from 'react';
import './App.css';

// Actions
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';
const SET_FILTER = 'SET_FILTER';

const FILTERS = {
  ALL: 'ALL',
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING'
};

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text: action.text, completed: false }]
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        )
      };
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.filter
      };
    default:
      return state;
  }
};

const initialState = {
  todos: [],
  filter: FILTERS.ALL
};

// View
function TodoApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState('');

  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === FILTERS.COMPLETED) return todo.completed;
    if (state.filter === FILTERS.PENDING) return !todo.completed;
    return true;
  });

  const addTodo = () => {
    if (input.trim()) {
      dispatch({ type: ADD_TODO, text: input });
      setInput('');
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">To-Do List</h1>

      <div className="todo-input-wrapper">
        <input
          className="todo-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task"
        />
        <button className="add-button" onClick={addTodo}>Add</button>
      </div>

      <div className="filter-buttons">
        {Object.values(FILTERS).map(f => (
          <button
            key={f}
            className={state.filter === f ? 'active' : ''}
            onClick={() => dispatch({ type: SET_FILTER, filter: f })}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="todo-list">
  {filteredTodos.map(todo => (
    <li key={todo.id} className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => dispatch({ type: TOGGLE_TODO, id: todo.id })}
      />
      <span
        className={`todo-text ${todo.completed ? 'completed' : ''}`}
        onClick={() => dispatch({ type: TOGGLE_TODO, id: todo.id })}
      >
        {todo.text}
      </span>
      <button className="delete-button" onClick={() => dispatch({ type: DELETE_TODO, id: todo.id })}>
        Delete
      </button>
    </li>
  ))}
</ul>

    </div>
  );
}

export default TodoApp;
