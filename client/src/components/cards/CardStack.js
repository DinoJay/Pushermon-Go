import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { Card, CardFrontPreview } from './Card';

import { forceSurface } from 'd3-force-surface';
import styles from './CardStack.scss';

// import dummyData from '../../../../server/dummyData';

// TODO: change, too complex
// const margin = x => (x ** 2) / (-2.02244 + (0.256652 * x) + (0.00492707 * (x ** 2)));

// const colors = ['#3f51b5', '#5cc2f1', '#fff59d', '#9993c1', '#9993c1',
//   '#e88a63', '#91c794', '#565f77', '#9d62c5', '#EA9292', '#7c79ce'];


// <li class="stack__item stack__item--current" >

const Frame = (props) => {
  let pos = {};
  if (props.horizontal) {
    pos = { left: `${props.pos}px` };
  } else if (props.vertical) {
    pos = { top: `${props.pos}px` };
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
      onMouseLeave={() => props.hoverHandler(null)}
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
    const width = props.width;
    const height = props.height;
    const offsetX = 200;
    const tagBox = [
      { from: { x: (width / 2) - offsetX, y: 0 }, to: { x: (width / 2) - offsetX, y: height } },
      { from: { x: (width / 2) + offsetX, y: 0 }, to: { x: (width / 2) + offsetX, y: height } },
      { from: { x: (width / 2) - offsetX, y: height }, to: { x: (width / 2) + offsetX, y: height } },
      { from: { x: (width / 2) - offsetX, y: 0 }, to: { x: (width / 2) + offsetX, y: 0 } }
    ];

    function aggregateByTags(data) {
      const spreadData = _.flatten(data.map(d => d.tags.map((t) => {
        const copy = _.cloneDeep(d);
        copy.tag = t;
        return copy;
      })));
      return d3.nest()
    .key(d => d.tag)
    .entries(spreadData);
    }

    const tags = aggregateByTags(props.cards)
      .map((d) => {
        d.r = 50;
        d.x = width / 2;
        d.y = height / 2;
        return d;
      });

    this.state = { tags, tagBox };
  }

  componentDidMount() {
    const simulation = d3.forceSimulation(this.state.tags)
      .force('collide', d3.forceCollide(d => d.r).strength(0.1))
      .alphaMin(0.3)
      // .force('charge', d3.forceManyBody(200))
    // .force('bbox', forceContainer([[0, yOffset], [width, height - yOffset]]))
    .force('container', forceSurface()
      .surfaces(this.state.tagBox)
      .oneWay(false)
    .radius(d => d.r)
    )
    // .force('center', d3.forceCenter(width / 2, height / 2))
    .on('end', () => this.setState({ tags: simulation.nodes() }));
  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  render() {
    const cards = this.props.cards;
    const tags = this.state.tags;
    const tagBox = this.state.tagBox;
    console.log('tags', tags);
    const size = this.props.horizontal ? this.props.width : this.props.height;

    const dom = d3.range(0, cards.length);
    const scale = d3.scaleBand(dom)
        .domain(dom)
        .range([0, size]);

    const newCards = this.props.cards.map((ch, i) => {
      let offset = 0;
      const focussedFrame = this.props.focussedFrame;
      if (focussedFrame && focussedFrame > i) offset = -250;
      if (focussedFrame && focussedFrame < i) offset = 250;
      ch.pos = scale(i) + offset;
      return ch;
    });

    const Items = this.props.cards.map((ch, i) => (
      <Frame
        pos={newCards[i].pos}
        {...this.props}
        z={this.props.cards.length - i}
        hoverHandler={(index) => {
          this.props.hoverHandler(index, newCards);
        }}
        index={i}
      >
        {React.cloneElement(this.props.element, { ...ch })}
      </Frame>
    )
);

    const svgStyle = {
      pointerEvents: 'none',
      width: `${this.props.width}px`,
      height: `${this.props.height}px`,
      left: 0,
      top: 0
    };

    const links = _.flatten(cards.map((c, i) => {
      const targets = tags.filter(t => c.tags.includes(t.key));
      return targets.map(t => ({ source: c, target: t }));
    }));

    const tagCircles = tags.map(t =>
      <circle r={t.r} cx={t.x} cy={t.y} fill="blue" />
    );

    return (
      <div>
        <ul className={`row ${styles.stack}`} >
          {this.props.cards.length > 0 ? Items : <div> No collected cards!</div>}
        </ul>
        <svg style={svgStyle} >
          <g>
            {tagCircles}
          </g>
          <g>
            {tagBox.map(d =>
              <line
                className={styles.bboxLine}
                x1={d.from.x} y1={d.from.y}
                x2={d.to.x} y2={d.to.y}
              />
            )}
          </g>
          <g>
            {
              links.map((d) => {
                const props = this.props.horizontal ? { x1: d.source.pos, y1: 30 } : { y1: 30, x1: d.source.pos };
                return (<line
                  className={styles.bboxLine}
                  {
                  ...props
                }
                  x2={d.target.x} y2={d.target.y}
                />);
              }
            )
            }
          </g>
        </svg>
      </div>
    );
  }
}


Stack.propTypes = {
  element: PropTypes.element,
  hoverHandler: PropTypes.func,
  cards: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number.isRequired
  }).isRequired).isRequired
};

Stack.defaultProps = {
  cards: [],
  element: <CardFrontPreview />,
  hoverHandler: () => null,
  scale: () => 0,
  x: true,
  y: false,
  size: 600
};

export default Stack;
