import { combineReducers } from 'redux';
import challenges from './challenges';
import visibilityFilter from './visibilityFilter';

const todoApp = combineReducers({
  challenges,
  visibilityFilter
});

export default todoApp;
