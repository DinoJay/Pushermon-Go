import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import { Card, CardFrontPreview } from './Card';

import styles from './CardStack.scss';

// import dummyData from '../../../../server/dummyData';

// TODO: change, too complex
// const margin = x => (x ** 2) / (-2.02244 + (0.256652 * x) + (0.00492707 * (x ** 2)));

// const colors = ['#3f51b5', '#5cc2f1', '#fff59d', '#9993c1', '#9993c1',
//   '#e88a63', '#91c794', '#565f77', '#9d62c5', '#EA9292', '#7c79ce'];


// <li class="stack__item stack__item--current" >

const Frame = (props) => {
  let pos = {};
  if (props.x) {
    pos = { left: `${props.x}px` };
  } else if (props.y) {
    pos = { top: `${props.y}px` };
  }

  const style = {
    opacity: 1,
    pointerEvents: 'auto',
    position: 'absolute'
    // zIndex: z,
    // transform: `translate3d(${props.x}, ${props.y}px, ${props.z}px)`
    // left: `${props.x}px`,
  };
  const trans = { transition: `0.2s ${props.x ? 'left' : 'top'}, 0.2s background-position, 0.1s border-color` };

  return (

    <li
      className={styles.stack__item}
      style={{ ...style, ...pos, ...trans }}
      onMouseEnter={() => props.hoverHandler(props.index)}
      onMouseLeave={() => props.hoverHandler(props.index)}
    >
      {props.children}
    </li>
  );
};

Frame.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  hoverHandler: PropTypes.func.isRequired,
  children: PropTypes.element,
  index: PropTypes.number.isRequired
};

Frame.defaultProps = {
  z: 0,
  x: 0,
  y: 0,
  children: <Card />
};


class Stack extends React.Component {
  constructor(props) {
    super(props);
    this.hoverHandler = this._hoverHandler.bind(this);
    this.state = {
      cards: props.cards,
      focussedFrame: null
    };
  }

  _hoverHandler(index) {
    this.setState(prevState => ({ focussedFrame: prevState.focussedFrame !== index ? index : null }));
  }

  render () {
    let pos = 0;
    const Items = this.state.cards.map((ch, i) => {
      let offset = 0;
      // TODO: edge cases
      const focussedFrame = this.state.focussedFrame;
      if (focussedFrame && focussedFrame > i) offset = -250;
      if (focussedFrame && focussedFrame < i) offset = 250;

      pos = this.props.scale(i) + offset;
      return (
        <Frame
          x={pos}
          z={this.state.cards.length - i}
          hoverHandler={this.hoverHandler}
          index={i}
        >
          {React.cloneElement(this.props.element,
            { ...ch, index: i, hoverHandler: this.hoverHandler })}
        </Frame>);
    }

    );
    return (
      <ul
        className={`row ${styles.stack} ${styles['stack--yuda']}`}
      >
        {this.state.cards.length > 0 ? Items : <div> No collected cards!</div>}
      </ul>
    );
  }
}


Stack.propTypes = {
  element: PropTypes.element,
  scale: PropTypes.func,
  cards: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number.isRequired
  }).isRequired).isRequired
};

Stack.defaultProps = {
  cards: [],
  element: <CardFrontPreview />,
  scale: () => 0
};

export default Stack;
