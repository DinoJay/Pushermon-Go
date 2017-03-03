import React from 'react';
import * as d3 from 'd3';
import { Provider } from 'react-redux';
import { createStore } from 'redux';


// import imgSrc from './components/example_challenge.jpg';


import todoApp from './reducers';
import Journal from './components/Journal';

const ArthurDeGreefCard = {
  title: 'The peculiar story of Arthur De Greef',
  key: Math.random() * 100,
  tags: ['Art', 'Culture', 'Music'],
  img: 'https://unsplash.it/600/300/?random',
  xpPoints: 100,
  // TODO: remove in future to component
  closeHandler: () => (null),
  caption: 'A statue of Arthur de Greef',
  description: 'Pianist Arthur De Greef born in Louvain. He was a pupil of Frank Liszt. I do not why there is statue is placed here. There is music school with the same name not far.',
  location: { latitude: 50.828797, longitude: 4.352191 },
  place: 'Park next to my Home',
  decksOfFriends: ['Nils', 'Kiran', 'Babba', '(some friends who already obtained the card)'],
  creator: 'Jan',
  media: [
    {
      type: 'photo',
      name: 'franz-liszt---the-first-rock-star',
      src: ''
    },
    {
      type: 'hyperlink',
      name: 'franz-liszt---the-first-rock-star',
      src: ''
    },
    {
      type: 'game',
      name: 'franz-liszt---the-first-rock-star',
      src: ''
    }
  ],
  comments: [
    {
      user: 'Nils',
      text: 'I did not know that he was such a famous composer'
    },
    {
      user: 'Babba',
      text: 'What a nice park, strange, that they put a mask on his face!'
    }
  ],
  rating: [{
    user: 'Nils',
    value: 4
  }
  ],
  cardSets: ['european_composers'],
  linkedCards: ['Frank Liszt', 'Music school Arthur de Greef']
};


const FrankLisztCard = {
  title: 'The life of Frank Liszt',
  key: Math.random() * 100,
  tags: ['Art', 'Culture', 'classic', 'music'],
  img: 'http://www.wagner-heavymetal.com/uploads/4/4/7/3/44734409/5792753_orig.gif',
  caption: 'Frank Liszt meets Heavy Metal',
  xpPoints: 100,
  // TODO: remove in future to component
  closeHandler: () => (null),
  description: 'The first pop star of classical music. He made girls cry with his virtuosic piano play. Much like Jimi hendrix he redefined the way to play his instrument',
  location: { latitude: 49.944574, longitude: 11.580127 },
  place: 'Bayreuth, a city with a long history of classical music',
  decksOfFriends: ['Nils', 'Kiran'],
  creator: 'Jan',
  media: [
    { type: 'hyperlink',
      name: 'franz-liszt---the-first-rock-star',
      src: 'http://www.wagner-heavymetal.com/franz-liszt---the-first-rock-star.html' }
  ],
  comments: [
    {
      user: 'Nils',
      text: 'the band Phoenix dedicated an album to Liszt'
    }
  ],
  rating: [{
    user: 'Nils',
    value: 4
  }
  ],
  cardSets: ['european_composers', 'Music challenge'],
  linkedCards: ['Jimi Hendrix']
};

const jimiHendrixCard = {
  title: 'Jimi Hendrix in Belgium',
  key: Math.random() * 100,
  tags: ['Rock \'n \' Roll', 'Culture', 'music'],
  img: 'http://www.memoire60-70.be/Images/Chronique_1966_1972/Jimi_Hendrix_Belgium_67.jpg',
  caption: 'Jimi Hendrix au Twenty Club - 5 mars 1967',
  xpPoints: 50,
  // TODO: remove in future to component
  closeHandler: () => (null),
  description: 'The first pop star of classical music. He made girls cry with his virtuosic piano play. Much like Jimi hendrix he redefined the way to play his instrument',
  location: { latitude: 49.944574, longitude: 11.580127 },
  place: 'Bayreuth, a city with a long history of classical music',
  decksOfFriends: ['Nils', 'Kiran'],
  creator: 'Jan',
  media: [
    {
      type: 'hyperlink',
      name: 'Le Twenty Club',
      src: 'http://www.memoire60-70.be/Chronique_1960_1965/Twenty_Club_Relais_de_la_Poste.htm'
    },
    {
      type: 'video',
      name: 'Live at woodstock',
      src: 'https://www.youtube.com/watch?v=_PVjcIO4MT4'
    }
  ],
  comments: [
    {
      user: 'Nils',
      text: 'the band Phoenix dedicated an album to Liszt'
    }
  ],
  rating: [{
    user: 'Nils',
    value: 4
  }
  ],
  cardSets: ['european_composers', 'Music challenge'],
  linkedCards: ['Frank Liszt', 'Music school Arthur de Greef']
};


// const createDummyData = limit => d3.range(limit).map((i) => {
// });


const defaultState = {
  cards: [ArthurDeGreefCard, FrankLisztCard, jimiHendrixCard]
};

const store = createStore(todoApp, defaultState);

export default () => (
  <Provider store={store}>
    <Journal />
  </Provider>
);
