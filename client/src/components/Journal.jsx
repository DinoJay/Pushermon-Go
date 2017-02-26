import React from 'react';
import Header from './Footer';
import AddTodo from '../containers/AddTodo';
import VisibleTodoList from '../containers/VisibleTodoList';

export default () => (
  <div className="container">
    <Header />
    <VisibleTodoList />
  </div>
);
