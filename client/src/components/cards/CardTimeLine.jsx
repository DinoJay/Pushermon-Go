import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import MapGL from 'react-map-gl';

import { Card, CardMini } from './Card';
import CardStack from './CardStack';
import Notification from '../Notification';

import Modal from '../utils/Modal';

import styles from './CardTimeLine.scss';

const timeFormatStr = '%d/%m/%Y %H:%M';
const formatTime = d3.timeFormat(timeFormatStr);
const formatLabelTime = d3.timeFormat('%d/%m/%Y');
const parseDate = d3.timeParse(timeFormatStr);

console.log('parseDate', parseDate('01/04/2012 00:00'));

const TypeIconScale = d3.scaleOrdinal()
                        .domain(['card', 'map', 'notification'])
                        .range(['fa-gamepad', 'fa-globe', 'fa-exclamation']);


const accessToken = 'pk.eyJ1Ijoiam1hdXNoYWciLCJhIjoiY2l2ODkyaDl1MDAwdTJvbnlmbHdvODM0MiJ9.rLkNA-rO4xq0O4_xIeqXVg';

function aggregate(data, timeInterval) {
  return d3.nest()
    .key(d => formatTime(timeInterval(d.date)))
    .entries(data)
    .map((e) => {
      e.date = parseDate(e.key);
      return e;
    });
}


class TimeLine extends React.Component {
  constructor(props) {
    super(props);

    const cards = props.cards.map((c) => {
      c.date = parseDate(c.date);
      return c;
    }).sort((a, b) => a.date - b.date);

    const dom = d3.range(0, cards.length);
    console.log('dom', dom);
    const y = d3.scaleBand(dom)
      .domain(dom)
      .range([0, 500]);

    console.log('y 1', y(2));

    this.state = { scale: y, cards, selectedEvent: null, transform: { x: 0, y: 0, k: 1 } };
    // this.progZoom = programmaticZoom;
  }

  componentDidMount() {
    console.log('this.comp', this.comp);
    // const zoom = d3.zoom()
    // .scaleExtent([1, 40])
    // .translateExtent([[-100, -100], [this.props.width, this.props.height]])
    // .on('zoom', () => {
    //   console.log('d3.event.transform', d3.event.transform);
    //   const trans = d3.event.transform;
    //   this.setState({ transform: trans });
    //   // d3.select('#timeline').style('transform', `translate(${trans.x}px, ${trans.y}px)scale(${trans.k})`);
    // });

    // d3.select('#timeline').call(zoom);
  }

  componentDidUpdate() {
  }

  render () {
    console.log('selectedEvent', this.state.selectedEvent);
    const svgStyle = {
      pointerEvents: 'none',
      width: `${this.props.width}px`,
      height: `${this.props.height}px`,
      left: 0,
      top: 0
    };
    const offsetX = 140;

    let ModalContent;
    if (this.state.selectedEvent !== null) {
      ModalContent =
        (<Card
          {...this.state.selectedEvent}
          collected
          closeHandler={() => this.setState({ selectedEvent: null })}
        />);
    } else {
      ModalContent = null;
    }
    return (
      <div
        ref={(c) => { this.comp = c; }} id="timeline"
        className={`w3-container W3-row ${styles.timeLine}`}
      >
        <div>
          <CardStack
            {...this.state}
            element={<CardMini />}
            zoomHandler={e => this.setState({ selectedEvent: e })}
          />
        </div>
        <svg style={svgStyle} >
          <g transform={`translate(${offsetX}, 0)`} >
            <line
              y2={this.props.height}
              className={styles.line}
            />
          </g>
        </svg>
        <Modal content={ModalContent} />
      </div>
    );
  }
}

TimeLine.defaultProps = {
  width: 600,
  height: 2800,
  layerGap: 200
};


TimeLine.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  layerGap: PropTypes.number,
  entryWidth: PropTypes.number,
  entryHeight: PropTypes.number,
  cards: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number.isRequired
  }).isRequired).isRequired
};

export default TimeLine;
