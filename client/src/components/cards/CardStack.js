import React, { PropTypes } from "react";
import * as d3 from "d3";
import _ from "lodash";
import { Card, CardFrontPreview } from "./Card";

import { forceSurface } from "d3-force-surface";
import styles from "./CardStack.scss";

// import dummyData from '../../../../server/dummyData';

// TODO: change, too complex
// const margin = x => (x ** 2) / (-2.02244 + (0.256652 * x) + (0.00492707 * (x ** 2)));

// const colors = ['#3f51b5', '#5cc2f1', '#fff59d', '#9993c1', '#9993c1',
//   '#e88a63', '#91c794', '#565f77', '#9d62c5', '#EA9292', '#7c79ce'];

// <li class="stack__item stack__item--current" >

const Frame = props => {
  const pos = {};
  // if (props.horizontal) {
  //   if (props.top) { pos = { left: `${props.pos}px` }; } else pos = { left: `${props.pos}px`, top: 100 };
  // } else if (props.vertical) {
  //   pos = { top: `${props.pos}px`, right: props.right ? 0 : null };
  // }

  const style = {
    opacity: 1,
    pointerEvents: "auto",
    position: "absolute",
    ...props.orientation
    // zIndex: z,
    // transform: `translate3d(${props.x}, ${props.y}px, ${props.z}px)`
    // left: `${props.x}px`,
  };
  const trans = {
    transition: `0.2s ${props.horizontal
      ? "left"
      : "top"}, 0.2s background-position, 0.1s border-color`
  };

  return (
    <li
      className={styles.stack__item}
      style={{ ...style, ...pos, ...trans }}
      onClick={() => props.hoverHandler(props.index)}
    >
      {props.children}
    </li>
  );
};

Frame.propTypes = {
  vertical: PropTypes.bool,
  pos: PropTypes.number,
  horizontal: PropTypes.bool,
  hoverHandler: PropTypes.func.isRequired,
  children: PropTypes.element,
  index: PropTypes.number.isRequired
};

Frame.defaultProps = {
  vertical: true,
  horizontal: true,
  pos: 0,
  children: <Card />
};

class Stack extends React.Component {
  constructor(props) {
    super(props);
    const width = props.width;
    const height = props.height;
    const offsetX = 200;
    const tagBox = [
      {
        from: { x: width / 2 - offsetX, y: 0 },
        to: { x: width / 2 - offsetX, y: height }
      },
      {
        from: { x: width / 2 + offsetX, y: 0 },
        to: { x: width / 2 + offsetX, y: height }
      },
      {
        from: { x: width / 2 - offsetX, y: height },
        to: { x: width / 2 + offsetX, y: height }
      },
      {
        from: { x: width / 2 - offsetX, y: 0 },
        to: { x: width / 2 + offsetX, y: 0 }
      }
    ];

    function aggregateByTags(data) {
      const spreadData = _.flatten(
        data.map(d =>
          d.tags.map(t => {
            const copy = _.cloneDeep(d);
            copy.tag = t;
            return copy;
          })
        )
      );
      return d3.nest().key(d => d.tag).entries(spreadData);
    }

    const allCards = props.firstCluster.concat(props.secCluster);

    const tags = aggregateByTags(allCards).map(d => {
      d.r = 50;
      d.x = width / 2;
      d.y = height / 2;
      return d;
    });

    this.state = { allCards, tags, tagBox };
  }

  componentDidMount() {
    const simulation = d3
      .forceSimulation(this.state.tags)
      .force("collide", d3.forceCollide(d => d.r).strength(0.4))
      .alphaMin(0.2)
      // .force('charge', d3.forceManyBody(200))
      // .force('bbox', forceContainer([[0, yOffset], [width, height - yOffset]]))
      .force(
        "container",
        forceSurface()
          .surfaces(this.state.tagBox)
          .oneWay(false)
          .radius(d => d.r)
      )
      // .force('center', d3.forceCenter(width / 2, height / 2))
      .on("end", () => this.setState({ tags: simulation.nodes() }));
  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  render() {
    const tags = this.state.tags;
    const tagBox = this.state.tagBox;
    const size = this.props.horizontal ? this.props.width : this.props.height;
    const allCards = this.state.allCards;

    const firstScale = d3
      .scaleBand()
      .domain(d3.range(0, this.props.firstCluster.length))
      .range([0, size]);

    const firstItems = this.props.firstCluster.map((c, i) => {
      let offset = 0;
      const focussedFrame = this.props.focussedFrame;
      if (focussedFrame && focussedFrame > i) offset = -250;
      if (focussedFrame && focussedFrame < i) offset = 250;
      c.pos = firstScale(i) + offset;
      return c;
    });

    const FirstCluster = firstItems.map((ch, i) => {
      const orientation = this.props.horizontal
        ? { left: `${ch.pos}px` }
        : { top: `${ch.pos}px` };
      return (
        <Frame
          {...this.props}
          z={firstItems.length - 1}
          orientation={orientation}
          hoverHandler={index => {
            this.props.hoverHandler(index);
          }}
          index={i}
        >
          {React.cloneElement(this.props.element, { ...ch })}
        </Frame>
      );
    });

    const secScale = d3
      .scaleBand()
      .domain(d3.range(0, this.props.secCluster.length))
      .range([0, size]);

    const secItems = this.props.secCluster.map((c, i) => {
      let offset = 0;
      const focussedFrame = this.props.focussedFrame;
      if (focussedFrame && focussedFrame > i) offset = -250;
      if (focussedFrame && focussedFrame < i) offset = 250;
      c.pos = secScale(i) + offset;
      return c;
    });

    const SecCluster = secItems.map((ch, i) => {
      let offset = 0;
      const focussedFrame = this.props.focussedFrame;
      if (focussedFrame && focussedFrame > i) offset = -250;
      if (focussedFrame && focussedFrame < i) offset = 250;
      const pos = secScale(i) + offset;
      let orientation = { top: `${pos}px`, right: 0 };
      if (this.props.horizontal) {
        orientation = { left: `${pos}px`, top: `${this.props.height - 220}px` };
      }

      return (
        <Frame
          {...this.props}
          z={secItems.length - i}
          orientation={orientation}
          hoverHandler={index => {
            this.props.hoverHandler(index);
          }}
          index={i}
        >
          {React.cloneElement(this.props.element, { ...ch })}
        </Frame>
      );
    });

    const svgStyle = {
      pointerEvents: "none",
      width: `${this.props.width}px`,
      height: `${this.props.height}px`,
      left: 0,
      top: 0
    };

    const links = _.flatten(
      allCards.map(c => {
        const targets = tags.filter(t => c.tags.includes(t.key));
        const l = targets.map(t => ({ source: t, target: c }));
        return l;
      })
    );

    return (
      <div
        style={{
          width: `${this.props.width}px`,
          height: `${this.props.height}px`
        }}
      >
        <ul className={`row ${styles.stack}`}>
          {this.props.firstCluster.length > 0
            ? FirstCluster
            : <div> No collected cards!</div>}
        </ul>
        <ul className={`row ${styles.stack}`}>
          {this.props.secCluster.length > 0
            ? SecCluster
            : <div> No collected cards!</div>}
        </ul>
        <svg style={svgStyle}>
          <g>
            {links.map(d => {
              const offset = 200;
              const props = this.props.horizontal
                ? { x1: d.target.pos, y1: offset }
                : { x1: offset, y1: d.target.pos };
              return (
                <line
                  className={styles.bboxLine}
                  {...props}
                  x2={d.source.x}
                  y2={d.source.y}
                />
              );
            })}
          </g>
          <g>
            {tagBox.map(d =>
              <line
                className={styles.bboxLine}
                x1={d.from.x}
                y1={d.from.y}
                x2={d.to.x}
                y2={d.to.y}
              />
            )}
          </g>
          <g>
            {tags.map(t =>
              <g transform={`translate(${t.x}, ${t.y})`}>
                <circle r={t.r} fill="blue" />
                <text
                  textAnchor="middle"
                  stroke="#51c5cf"
                  strokeWidth="1px"
                  dy=".3em"
                >
                  {t.key}
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>
    );
  }
}

Stack.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  focussedFrame: PropTypes.number,
  element: PropTypes.element,
  hoverHandler: PropTypes.func,
  vertical: PropTypes.bool,
  horizontal: PropTypes.bool,
  firstCluster: PropTypes.array,
  secCluster: PropTypes.array
};

Stack.defaultProps = {
  firstCluster: [],
  secCluster: [],
  focussedFrame: null,
  element: null,
  hoverHandler: () => null,
  vertical: true,
  horizontal: false,
  width: 800,
  height: 600
};

export default Stack;
