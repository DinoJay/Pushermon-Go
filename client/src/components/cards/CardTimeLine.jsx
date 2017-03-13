import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import labella from 'labella';
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


const CircleMap = (props) => {
  const style = {
    // maxHeight: props.height,
    // maxWidth: props.width,
    position: 'absolute',
    transform: `translate(${props.x}px,${props.y}px)`
  };

  return (
    <div className={styles.circleCont}>
      <MapGL
        width={200}
        height={200}
        latitude={37.7577}
        longitude={-122.4376}
        zoom={8}
        mapboxApiAccessToken={accessToken}
        onChangeViewport={(viewport) => {
          const { latitude, longitude, zoom } = viewport;
        }}
      />
    </div>
  );
};


const Entry = (props) => {
  const style = {
    maxHeight: props.height,
    maxWidth: props.width,
    position: 'absolute',
    transform: `translate(${props.x}px,${props.y}px)`
  };

  console.log('Notification', Notification);
  const switchElement = {
    card: <CardMini zoomHandler={props.zoomHandler} />,
    notification: <Notification />,
    map: <CircleMap />
  };

  return (
    <li className={`${styles.item}`} style={style} >
      <CardStack
        {...props}
        cards={props.values}
        event={type => switchElement[type]}
      />
    </li>
  );
};

Entry.propTypes = {
  // z: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['card', 'map']).isRequired,
  zoomHandler: PropTypes.func
};

Entry.defaultProps = {
  x: 200,
  y: 0,
  width: 200,
  height: 350
};


class TimeLine extends React.Component {
  constructor(props) {
    super(props);

    const cs = props.cards.map((c) => {
      c.date = parseDate(c.date);
      return c;
    }).sort((a, b) => a.date - b.date);

    const cardsByDate = aggregate(cs, d3.timeDay);
    console.log('aggr', cardsByDate);

    const y = d3.scaleTime()
      .domain(d3.extent(cardsByDate, c => c.date))
      .range([0, props.height - 420]);

    cardsByDate.forEach((c) => {
      c.y = y(c.date);
      c.node = new labella.Node(c.y, props.entryHeight, c);
    });

    new labella.Force({
      minPos: -10
    })
     .nodes(cardsByDate.map(c => c.node))
     .compute();

    this.state = { cardsByDate, selectedEvent: null };
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render () {
    console.log('selectedEvent', this.state.selectedEvent);
    const svgStyle = {
      pointerEvents: 'none',
      width: `${this.props.width}px`,
      height: `${this.props.height + 300}px`,
      left: 0,
      top: 0
    };
    const offsetX = 140;

    const Entries = this.state.cardsByDate.map(c =>
      <Entry
        {...c}
        width={this.props.entryWidth}
        height={this.props.entryHeight}
        x={this.props.layerGap + offsetX}
        y={c.node.currentPos - (this.props.entryHeight / 3)}
        zoomHandler={e => this.setState({ selectedEvent: e })}
      />
    );

    const EventTypes = this.state.cardsByDate.map(c => (
      <span className={styles.event} style={{ transform: `translate(${offsetX}px, ${c.y}px)` }} >
        <i className={`fa ${TypeIconScale(c.values[0].type)}`} aria-hidden="true" />
      </span>
    ));


    const Time = this.state.cardsByDate.map(c => (
      <span className={styles.time} style={{ transform: `translate(${0}px, ${c.y}px) ` }} >
        <time className="" >{formatLabelTime(c.date)}</time>
      </span>
    ));

    const renderer = new labella.Renderer({
      layerGap: this.props.layerGap,
      nodeHeight: Entry.defaultProps.height,
      direction: 'right'
    });

    const paths = this.state.cardsByDate.map(c => (
      <path {...c} d={renderer.generatePath(c.node)} stroke={'gold'} strokeWidth={4} fill={'none'} />
    ));

    let ModalContent;
    if (this.state.selectedEvent !== null) {
      ModalContent = <Card {...this.state.selectedEvent} collected closeHandler={() => this.setState({ selectedEvent: null })} />;
    } else {
      ModalContent = null;
    }
    return (
      <div className={`w3-container W3-row ${styles.timeLine}`} >
        <ul className="">
          { Entries }
        </ul>
        <span> {EventTypes} </span>
        <span> {Time} </span>
        <svg style={svgStyle} >
          <g transform={`translate(${offsetX}, 0)`} >
            <line
              y2={this.props.height}
              className={styles.line}
            />
            {paths}
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
  layerGap: 200,
  entryWidth: Entry.defaultProps.width,
  entryHeight: Entry.defaultProps.height
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
