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
    // console.log('self', self);
    // const scale = 0.5; // self.zoom;
    return (
      this.challenges.map((ch, i) => {
        const pixel = opt.project([ch.coords.longitude, ch.coords.latitude]);
        return (
          <button
            key={i}
            className={styles.card}
            style={{
              transform: `translate(${pixel[0]}px, ${pixel[1]}px)`
            }}
            onClick={() => self.cardClickHandler(ch)}
          >
            <i className="fa fa-fw fa-question fa-2x" />
          </button>
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
