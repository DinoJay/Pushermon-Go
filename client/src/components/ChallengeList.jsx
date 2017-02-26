import React, { PropTypes } from 'react';
import StackItem from './Challenge';

import styles from './ChallengeList.scss';

// TODO: change, too complex
// const margin = x => (x ** 2) / (-2.02244 + (0.256652 * x) + (0.00492707 * (x ** 2)));

const Stack = ({ challenges, onChClick }) => {
  const Items = challenges.slice(0, 20).map((ch, i) =>
    <StackItem
      key={ch.id}
      {...ch}
      z={challenges.length - i}
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
        {challenges.length > 0 ? Items : <div> No collected cards!</div>}
      </ul>
    </div>
  );
};

Stack.propTypes = {
  challenges: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onChClick: PropTypes.func.isRequired
};

export default Stack;
