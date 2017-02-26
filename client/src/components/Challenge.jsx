import React, { PropTypes } from 'react';
import * as d3 from 'd3';

import { PreviewChallenge } from './challenges/ChallengeCard';
import styles from './ChallengeList.scss';

const colors = ['#3f51b5', '#5cc2f1', '#fff59d', '#9993c1', '#9993c1',
  '#e88a63', '#91c794', '#565f77', '#9d62c5', '#EA9292', '#7c79ce'];

const colorScale = d3.scaleLinear()
    .domain(d3.range(colors.length))
    .range(colors)
    .clamp(true);


// <li class="stack__item stack__item--current" >

const StackEntry = ({ onClick, completed, text, z }) => {
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
      <PreviewChallenge />
    </li>
  );
};

StackEntry.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  z: PropTypes.number.isRequired
};

export default StackEntry;
