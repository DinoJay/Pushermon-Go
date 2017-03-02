import React from 'react';
import * as d3 from 'd3';
import { Provider } from 'react-redux';
import { createStore } from 'redux';


// import imgSrc from './components/example_challenge.jpg';


import todoApp from './reducers';
import Journal from './components/Journal';

const exampleCard = {
  title: 'The peculiar story of Arthur De Greef',
  key: Math.random() * 100,
  tags: ['Art', 'Culture', 'Comics', 'Music'],
  img: 'https://unsplash.it/600/300/?random',
  xpPoints: 100,
  // TODO: remove in future to component
  closeHandler: () => (null),
  description: 'What so special about the location, describe it',
  location: { latitude: 50.828797, longitude: 4.352191 },
  place: 'Park next to my Home',
  decksOfFriends: ['Nils', 'Kiran', 'Babba', '(some friends who already obtained the card)'],
  creator: 'Jan',
  media: [
    'photo',
    'hyperlink',
    'game'
  ],
  feedback: [
    {
      user: 'Nils',
      text: 'I did not know that he was such a famous composer'
    },
    {
      user: 'Babba',
      text: 'What a nice park, strange, that they put a mask on his face!'
    }
  ],
  cardSets: ['Brussels VIP', 'Music challenge']
};

// const createDummyData = limit => d3.range(limit).map((i) => {
// });


const defaultState = {
  cards: [exampleCard]
};

const store = createStore(todoApp, defaultState);

export default () => (
  <Provider store={store}>
    <Journal />
  </Provider>
);
