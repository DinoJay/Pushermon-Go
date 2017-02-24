import { connect } from 'react-redux';
import { toggleChallenge } from '../actions';
import TodoList from '../components/TodoList';

const getVisibleChallenges = (todos, filter) => {
  switch (filter) {
  case 'SHOW_ALL':
    return todos;
  case 'SHOW_COMPLETED':
    return todos.filter(t => t.completed);
  case 'SHOW_ACTIVE':
    return todos.filter(t => !t.completed);
  // skip default
  }
};

const mapStateToProps = state => ({
  todos: getVisibleChallenges(state.todos, state.visibilityFilter)
});

const mapDispatchToProps = dispatch => ({
  onTodoClick: (id) => {
    dispatch(toggleChallenge(id));
  }
});

const VisibleChallengeList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

export default VisibleChallengeList;
