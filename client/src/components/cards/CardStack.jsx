import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import { Card, CardFrontPreview } from './Card';

import styles from './CardStack.scss';

import dummyData from '../../../../server/dummyData';

// TODO: change, too complex
// const margin = x => (x ** 2) / (-2.02244 + (0.256652 * x) + (0.00492707 * (x ** 2)));

// const colors = ['#3f51b5', '#5cc2f1', '#fff59d', '#9993c1', '#9993c1',
//   '#e88a63', '#91c794', '#565f77', '#9d62c5', '#EA9292', '#7c79ce'];


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
      className={`w3-threequarter ${styles.stack__item} ${styles['stack__item--current']}`}
      style={style}
    >
      {props.children}
    </li>
  );
};

StackItem.propTypes = {
  z: PropTypes.number.isRequired,
  closeHandler: PropTypes.func
};

StackItem.defaultProps = {
  z: 0,
  closeHandler: a => a,
  children: <Card />
};


class Stack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: props.cards
    };
  }
  render () {
    const updState = () => this.setState(prevState => ({ cards: prevState.cards.slice(0, prevState.cards.length - 1) }));
    const Items = this.state.cards.map((ch, i) =>
      <StackItem
        {...ch}
        z={this.state.cards.length - i}
        closeHandler={updState}
      >
        {this.props.children}
      </StackItem>
    );
    return (
      <div style={null}>
        <ul
          className={`row ${styles.stack} ${styles['stack--yuda']}`}
          style={{
            perspective: '500px',
            perspectiveOrigin: `50% ${-50}%`
          }}
        >
          {this.state.cards.length > 0 ? Items : <div> No collected cards!</div>}
        </ul>
      </div>
    );
  }
}


Stack.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number.isRequired
  }).isRequired).isRequired
};

Stack.defaultProps = {
  cards: dummyData,
  children: <CardFrontPreview />
};

export default Stack;
