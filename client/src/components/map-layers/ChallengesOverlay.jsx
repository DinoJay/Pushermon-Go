import React from 'react';
import styles from './ChallengesOverlay.scss';
// const window = require('global/window');
import DIVOverlay from './div.react';

export default class ChalllengesOverlay extends React.Component {
  static propTypes() {
    return {
      // locations: React.PropTypes.array.isRequired,
      cardClickHandler: React.PropTypes.func.isRequired
    };
  }


  redraw(opt) {
    const self = this;
    const width = 20;
    const height = 30;
    console.log('width', width);
    // console.log('self', self);
    // const scale = 0.5; // self.zoom;
    return (
      this.cards.map((c) => {
        const pixel = opt.project([c.location.longitude, c.location.latitude]);
        console.log('pixel', pixel);
        return (
          <div
            key={c.key}
            className={`${styles.card} w3-button`}
            style={{
              width: `${width}px`,
              height: `${height}px`,
              transform: `translate(${pixel[0] - (width / 2)}px, ${pixel[1] - (height / 2)}px)`
            }}
            onTouchStart={() => self.cardClickHandler(c)}
            onClick={() => self.cardClickHandler(c)}
          >
            <i className="fa fa-fw fa-question fa-2x" />
          </div>
        );
      })

    );
  }


  render() {
    return <DIVOverlay {...this.props} redraw={this.redraw} />;
  }
    // width: React.PropTypes.number.isRequired,
    // height: React.PropTypes.number.isRequired,
    // longitude: React.PropTypes.number.isRequired,
    // latitude: React.PropTypes.number.isRequired,
    // zoom: React.PropTypes.number.isRequired,
    // isDragging: React.PropTypes.bool.isRequired
  // }

}

// module.exports = React.createClass({
//
//   displayName: 'ExampleOverlay',
//
//   propTypes: {
//     locations: React.PropTypes.array.isRequired
//     // width: React.PropTypes.number.isRequired,
//     // height: React.PropTypes.number.isRequired,
//     // longitude: React.PropTypes.number.isRequired,
//     // latitude: React.PropTypes.number.isRequired,
//     // zoom: React.PropTypes.number.isRequired,
//     // isDragging: React.PropTypes.bool.isRequired
//   },
//
//   render: function render() {
//     return r(DIVOverlay, Object.assign({}, this.props, {
//       redraw: function redraw(opt) {
//         return r.g(this.props.locations.map((location) => {
//           const pixel = opt.project([location.longitude, location.latitude]);
//           return r.circle({
//             cx: pixel[0],
//             cy: pixel[1],
//             r: 10,
//             style: {
//               fill: 'rgba(231, 76, 60, 0.4)',
//               pointerEvents: 'all',
//               cursor: 'pointer'
//             },
//             onClick: function onClick() {
//               window.location.href = `https://en.wikipedia.org${location.wiki}`;
//             }
//           });
//         }));
//       }.bind(this)
//     }));
//   }
// });
