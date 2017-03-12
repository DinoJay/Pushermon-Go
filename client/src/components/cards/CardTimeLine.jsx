import React, { PropTypes } from 'react';
import ReactDom from 'react-dom';
import * as d3 from 'd3';
import labella from 'labella';

import { CardMini } from './Card';
import CardStack from './CardStack';

import styles from './CardTimeLine.scss';

const timeFormatStr = '%d/%m/%Y %H:%M';
const parseDate = d3.timeParse(timeFormatStr);

const Entry = (props) => {
  const style = {
    opacity: 1,
    pointerEvents: 'auto',
    maxHeight: props.height,
    maxWidth: props.width,
    // zIndex: z,
    transform: `translateY(${props.y}px)`
  };

  return (
    <li
      className={`${styles.item}`}
      style={style}
    >
      <CardStack {...props} ><CardMini /></CardStack>
    </li>
  );
};

Entry.propTypes = {
  // z: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

Entry.defaultProps = {
  y: 0,
  width: 200,
  height: 300
};


class TimeLine extends React.Component {
  constructor({ cards, width, height }) {
    super({ cards, width, height });

    const cs = cards.map((c) => {
      c.date = parseDate(c.date);
      return c;
    }).sort((a, b) => a.date - b.date);

    const y = d3.scaleTime()
      .domain(d3.extent(cs, c => c.date))
      .range([0, height]);

    cs.forEach((c) => {
      c.y = y(c.date);
      c.node = new labella.Node(c.y, Entry.defaultProps.height, c);
    });

    new labella.Force({
      minPos: -10
    })
     .nodes(cs.map(c => c.node))
     .compute();

    // renderer.layout(nodes);

    this.state = {
      cards: cs
    };
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render () {
    const svgStyle = {
      pointerEvents: 'none',
      width: `${this.props.width}px`,
      height: `${this.props.height + 300}px`,
      left: 0,
      top: 0
    };
    const offset = 30;
    const lineStyle = {
      strokeWidth: '2px',
      stroke: '#C2A53C'
    };

    const Items = this.state.cards.map(c =>
      <Entry
        {...c}
        width={this.props.entryWidth}
        height={this.props.entryHeight}
        y={c.node.currentPos}
        ref={c.key}
      />
    );

    const dots = this.state.cards.map(c => (
      <circle cy={c.y} r={5} />
    ));

    const renderer = new labella.Renderer({
      layerGap: 220,
      nodeHeight: Entry.defaultProps.height,
      direction: 'right'
    });

    const paths = this.state.cards.map(c => (
      <path {...c} d={renderer.generatePath(c.node)} stroke={'gold'} strokeWidth={2} fill={'none'} />
    ));
 // Draw path from point on the timeline to the label rectangle
  // linkLayer.selectAll('path.link')
  //   .data(nodes)
  // .enter().append('path')
  //   .classed('link', true)
  //   .attr('d', function(d){return renderer.generatePath(d);})
  //   .style('stroke', color)
  //   .style('stroke-width',2)
  //   .style('opacity', 0.6)
  //   .style('fill', 'none');
    return (
      <div className={`w3-container W3-row ${styles.timeLine}`} >
        <div className={'w3-col s4'} >
          <svg style={svgStyle} >
            <g transform={`translate(${offset}, 0)`} >
              <line
                y2={this.props.height}
                style={lineStyle}
              />
              {dots}
              {paths}
            </g>
          </svg>
        </div>
        <ul className="w3-col s8">
          { Items }
        </ul>
      </div>
    );
  }
}

TimeLine.defaultProps = {
  width: 600,
  height: 1500,
  entryWidth: Entry.defaultProps.width,
  entryHeight: Entry.defaultProps.height
};


TimeLine.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  cards: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number.isRequired
  }).isRequired).isRequired
};

export default TimeLine;
