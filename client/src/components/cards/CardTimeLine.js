import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import _ from 'lodash';
// import MapGL from 'react-map-gl';

import { Card, CardMini } from './Card';
import CardStack from './CardStack';
// import Notification from '../Notification';

// import Modal from '../utils/Modal';

import cx from './CardTimeLine.scss';

const timeFormatStr = '%d/%m/%Y %H:%M';
const formatTime = d3.timeFormat(timeFormatStr);
// const formatLabelTime = d3.timeFormat('%d/%m/%Y');
const parseDate = d3.timeParse(timeFormatStr);

const TypeIconScale = d3.scaleOrdinal()
                        .domain(['card', 'map', 'notification'])
                        .range(['fa-gamepad', 'fa-globe', 'fa-exclamation']);


// function aggregateByTime(data, timeInterval) {
//   return d3.nest()
//     .key(d => formatTime(timeInterval(d.date)))
//     .entries(data)
//     .map((e) => {
//       e.date = parseDate(e.key);
//       return e;
//     });
// }


class TimeLine extends React.Component {
  constructor(props) {
    super(props);

    const cards = props.cards.map((c) => {
      c.date = parseDate(c.date);
      return c;
    }).sort((a, b) => a.date - b.date);


    this.state = { cards };
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);

    const width = 600; // el.getBoundingClientRect().width;
    const height = 800; // el.getBoundingClientRect().height;


    // .stop();

    // for (let i = 0; i < 150; ++i) simulation.tick();
  }

  componentDidUpdate() {
  }

  render () {
    console.log('this.state', this.state);

    // let ModalContent;
    // if (this.state.selectedEvent !== null) {
    //   ModalContent =
    //     (<Card
    //       {...this.state.selectedEvent}
    //       collected
    //       closeHandler={() => this.setState({ selectedEvent: null })}
    //     />);
    // } else {
    //   ModalContent = null;
    // }


    return (
      <div
        ref={(c) => { this.comp = c; }} id="timeline"
        className={`w3-row ${cx.cont}`}
      >
        <div><h1>Controls </h1></div>
        <div>
          <CardStack
            cards={this.state.cards}
            width={1200}
            height={800}
            vertical
            element={<CardMini />}
            focussedFrame={this.state.focussedFrame}
            hoverHandler={(focussedFrame, cards) => {
              this.setState({ focussedFrame, cards });
            }}
          />
        </div>
      </div>
    );
  }
}

TimeLine.defaultProps = {
  width: 1200,
  height: 1000,
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
