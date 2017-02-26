import { connect } from 'react-redux';
import { toggleChallenge } from '../actions';
import ChallengeList from '../components/ChallengeList';

const getVisibleChallenges = (challenges, filter) => {
  switch (filter) {
  case 'SHOW_ALL':
    return challenges;
  case 'SHOW_COMPLETED':
    return challenges.filter(t => t.completed);
  case 'SHOW_ACTIVE':
    return challenges.filter(t => !t.completed);
  // skip default
  }
};

const mapStateToProps = state => ({
  challenges: getVisibleChallenges(state.challenges, state.visibilityFilter)
});

const mapDispatchToProps = dispatch => ({
  onTodoClick: (id) => {
    dispatch(toggleChallenge(id));
  }
});

const VisibleChallengeList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChallengeList);

export default VisibleChallengeList;
