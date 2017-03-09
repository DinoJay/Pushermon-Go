import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import { Card } from './Card';

import styles from './CardStack.scss';

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
      <Card {...props} closeHandler={props.closeHandler} />
    </li>
  );
};

StackItem.propTypes = {
  z: PropTypes.number.isRequired,
  closeHandler: PropTypes.func
};

StackItem.defaultProps = {
  z: 0,
  closeHandler: a => a
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

export default Stack;
