import React from 'react';
// import Immutable from 'immutable';

import MapGL from 'react-map-gl';
// import rasterTileStyle from 'raster-tile-style';
import Pusher from 'pusher-js';
import ngeohash from 'ngeohash';

import ChallengeCard from './components/challenges/ChallengeCard';

import ChallengesOverlay from './components/map-layers/ChallengesOverlay';
import UserMarkerOverlay from './components/map-layers/UserMarkerOverlay';

// const tileSource = '//tile.stamen.com/toner/{z}/{x}/{y}.png';

// const mapStyle = rasterTileStyle([tileSource]);


const accessToken = 'pk.eyJ1Ijoiam1hdXNoYWciLCJhIjoiY2l2ODkyaDl1MDAwdTJvbnlmbHdvODM0MiJ9.rLkNA-rO4xq0O4_xIeqXVg';

const pusher = new Pusher('cc379270b195d3a20931', {
  cluster: 'eu',
  encrypted: true
});

function isInMapBounds(coords, mapBounds) {
  const lng = parseFloat(coords.longitude);
  const lat = parseFloat(coords.latitude);
      // const mapBounds = map.getBounds();
  const boundsCheck = (lng > mapBounds.getWest() && lng < mapBounds.getEast()
      && lat < mapBounds.getNorth() && lat > mapBounds.getSouth());

  if (boundsCheck) {
    return true;
  }
  return false;
}

const Modal = ({ challenge }) => (
  <div
    className="modal fade" id="myModal" tabIndex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true"
  >
    <div className="modal-dialog" role="document">
      {challenge}
    </div>
  </div>
);

// Modal.propTypes = {
//   challenge: React.PropTypes.object.isRequired
// };


export default class App extends React.Component {
  constructor(props) {
    console.log('willMount', props);
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: 0,
        longitude: 0,
        // mapStyle: Immutable.fromJS(mapStyle),
        zoom: 20
      },
      challenges: [],
      challenge: null
    };
  }

  componentDidMount() {
    console.log('didMount');
    const self = this;
    window.addEventListener('resize', () => {
      this.setState({
        viewport: Object.assign({}, self.state.viewport, {
          width: window.innerWidth,
          height: window.innerHeight
        })
      });
    });

    const watchPosId = navigator.geolocation.watchPosition((pos) => {
      // map.setCenter([pos.coords.longitude, pos.coords.latitude]);
      console.log('watch pos', pos.coords);
      const newViewPort = Object.assign({}, self.state.viewport, {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });

      self.setState({ viewport: newViewPort });
    }, d => console.log('error watch pos', d), { timeout: 1000000 });

    const curPosId = navigator.geolocation.getCurrentPosition((pos) => {
      console.log('cur pos', pos.coords);
      const newViewPort = Object.assign({}, self.state.viewport, {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });

      self.setState({ viewport: newViewPort });
    },
      d => console.log('error cur pos', d),
      { maximumAge: 0, enableHighAccuracy: true });

    this.setState({ curPosId, watchPosId });
  }

  componentDidUpdate() {
  }

  cardClickHandler(d) {
    console.log('cardClickHandler', d);
    jQuery('.modal').modal('show');
    this.setState({ challenge: <ChallengeCard {...d} /> });
  }

  _onChangeViewport(viewport) {
    const vp = {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: viewport.zoom
    };
    // TODO: expose less
    const mapBounds = viewport.map.getBounds();
    //
    const geoHashes = ngeohash.bboxes(mapBounds._sw.lat, mapBounds._sw.lng,
    mapBounds._ne.lat, mapBounds._ne.lng, 6);

    let currentGeoHashes = [];
    currentGeoHashes.forEach((geohash) => {
      if (!geoHashes.includes(geohash)) {
        // Unsubscribe from any hash we've moved out of
        pusher.unsubscribe(geohash);
        console.log('Unsubscribe');
      }
    });
    currentGeoHashes = currentGeoHashes
      .filter(geohash => geoHashes.includes(geohash));

    // const challenges = [];
    geoHashes.forEach((geohash) => {
      if (!currentGeoHashes.includes(geohash)) {
        // Subscribe to any new hashes we've moved into
        currentGeoHashes.push(geohash);
        pusher.subscribe(geohash)
          .bind('encounter', (d) => {
            console.log('subscribe');
            if (isInMapBounds(d.coords, mapBounds)) {
              navigator.vibrate(1000);
              console.log('d.coords', d.coords);
              // const ch = {
              //   latitude: parseFloat(d.coords.latitude),
              //   longitude: parseFloat(d.coords.longitude)
              // };
              d.latitude = parseFloat(d.coords.latitude);
              d.longitude = parseFloat(d.coords.longitude);

              this.setState({ challenges: this.state.challenges.concat([d]) });
              console.log('encounter');
            } else {
      // TODO: Show arrow indicators
            }
          });
      }
    });

    this.setState({
      viewport: vp
    });
  }

  _userMove(pos, point) {
    const viewport = Object.assign({}, this.state.viewport, {
      latitude: pos.lat,
      longitude: pos.lng
    });

    this.setState({
      viewport
    });
  }


  // componentWillUnmount() {
  //   console.log('unmount', this);
  //
  // }

  componentWillUnmount() {
    console.log('unmount', this);

    window.addEventListener('resize', () => {});
    navigator.geolocation.watchPosition(() => {}, () => {}, { timeout: 1 });
    navigator.geolocation.getCurrentPosition(() => {}, () => {}, { timeout: 1 });
    console.log('curPosId', this.state);
    // console.log('watchPosId', this.state.watchPosId);
    navigator.geolocation.clearWatch(this.state.watchPosId);
  }

  render() {
    return (
      <div key={`${location.pathname}${location.search}`}>
        <Modal challenge={this.state.challenge} />

        <MapGL
          {...this.state.viewport}
          mapboxApiAccessToken={accessToken}
          onChangeViewport={this._onChangeViewport.bind(this)}
          onClick={this._userMove.bind(this)}
          isDragging={false}
          startDragLngLat={null}
        >
          <ChallengesOverlay
            {...this.state.viewport}
            cardClickHandler={this.cardClickHandler.bind(this)}
            challenges={this.state.challenges}
          />
          <UserMarkerOverlay
            {...this.state.viewport}
            location={{ latitude: this.state.viewport.latitude, longitude: this.state.viewport.longitude }}
            id={'exampleUser'}
          />
        </MapGL>
      </div>
    );
    // return r.div([
    //   r(MapGL, Object.assign({}, this.state.viewport,
    //     { mapboxApiAccessToken: accessToken },
    //
    //     {
    //       onChangeViewport: this._onChangeViewport
    //     }), [
    //       r(Overlay, Object.assign({}, this.state.viewport, { locations }))
    //     ])
    // ]);
  }
}
