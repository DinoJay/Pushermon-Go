import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import { Card } from './Card';


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

const StackItem = (props) => {
  const style = {
    opacity: 1,
    pointerEvents: 'auto',
    // zIndex: z,
    transform: `translate3d(0px, 0px, ${props.z * -50}px)`
  };

  return (
    <li
      className={`${styles.stack__item} ${styles['stack__item--current']}`}
      onClick={props.onClick}
      style={style}
    >
      <Card {...props} />
    </li>
  );
};

StackItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  z: PropTypes.number.isRequired
};


const Stack = ({ cards, onChClick }) => {
  console.log('Stack', cards);
  const Items = cards.map((ch, i) =>
    <StackItem
      {...ch}
      z={cards.length - i}
      onClick={() => onChClick(ch.id)}
    />
    );
  return (
    <div style={null}>
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
    key: PropTypes.number.isRequired
  }).isRequired).isRequired
};

export default Stack;
