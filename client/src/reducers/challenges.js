const challenge = (state = {}, action) => {
  switch (action.type) {
  case 'ADD_CHALLENGE':
    return {
      id: action.id,
      text: action.text,
      completed: false
    };
  case 'TOGGLE_CHALLENGE':
    if (state.id !== action.id) {
      return state;
    }
    return Object.assign({}, state, {
      completed: !state.completed
    });

  default:
    return state;
  }
};

const challenges = (state = [], action) => {
  switch (action.type) {
  case 'ADD_CHALLENGE':
    return [
      ...state,
      challenge(undefined, action)
    ];
  case 'TOGGLE_CHALLENGE':
    return state.map(t =>
        challenge(t, action)
      );
  default:
    return state;
  }
};

export default challenges;
