import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './reducers';
import TodoApp from './components/TodoApp';

const store = createStore(todoApp);

export default () => (
  <Provider store={store}>
    <TodoApp />
  </Provider>
);
