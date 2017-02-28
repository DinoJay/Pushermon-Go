import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import { CardPreview } from './Card';


import styles from './CardStack.scss';

// TODO: change, too complex
// const margin = x => (x ** 2) / (-2.02244 + (0.256652 * x) + (0.00492707 * (x ** 2)));

const colors = ['#3f51b5', '#5cc2f1', '#fff59d', '#9993c1', '#9993c1',
  '#e88a63', '#91c794', '#565f77', '#9d62c5', '#EA9292', '#7c79ce'];

const colorScale = d3.scaleLinear()
    .domain(d3.range(colors.length))
    .range(colors)
    .clamp(true);


// <li class="stack__item stack__item--current" >

const StackItem = ({ onClick, completed, text, z }) => {
  const style = {
    opacity: 1,
    pointerEvents: 'auto',
    // zIndex: z,
    transform: `translate3d(0px, 0px, ${z * -50}px)`,
    backgroundColor: colorScale(z),
    borderWidth: '2px',
    borderColor: 'black'
  };

  return (
    <li
      className={`${styles.stack__item} ${styles['stack__item--current']}`}
      onClick={onClick}
      style={style}
    >
      <CardPreview />
    </li>
  );
};

StackItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  z: PropTypes.number.isRequired
};


const Stack = ({ cards, onChClick }) => {
  const Items = cards.slice(0, 20).map((ch, i) =>
    <StackItem
      key={ch.id}
      {...ch}
      z={cards.length - i}
      onClick={() => onChClick(ch.id)}
    />
    );
  return (
    <div style={{ overflow: 'hidden' }}>
      <ul
        className={`row ${styles.stack} ${styles['stack--yuda']}`}
        style={{
          perspective: '500px',
          perspectiveOrigin: `50% ${-50}%`,
          marginTop: `${75}px`
        }}
      >
        {cards.length > 0 ? Items : <div> No collected cards!</div>}
      </ul>
    </div>
  );
};

Stack.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired
};

export default Stack;
