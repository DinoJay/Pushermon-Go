import React from 'react';
import * as d3 from 'd3';
import { Provider } from 'react-redux';
import { createStore } from 'redux';


import todoApp from './reducers';
import Journal from './components/Journal';

const createDummyData = limit => d3.range(limit).map((i) => {
  const latitude = 0;
  const longitude = 0;
  return ({
    id: i,
    text: 'dummy',
    completed: false,
    title: 'The evil detective',
    description: 'You defended the evil detective from taking over the control of the blackmarket!',
    place: 'Brussels, Marolles',
    contentType: 'Art, Culture, Comics',
            // TODO: change in future to component
    coords: { latitude, longitude },
    challenge: 'Quiz',
    difficulty: 'hard',
    xpPoints: 100,
    decksOfFriends: ['Nils', 'Kiran', 'Babba']
  });
});


const defaultState = {
  challenges: createDummyData(4)
};

const store = createStore(todoApp, defaultState);

export default () => (
  <Provider store={store}>
    <Journal />
  </Provider>
);
