// import React from 'react';
//
// import mapboxgl from 'mapbox-gl';
// import Pusher from 'pusher-js';
// import MapGL from 'react-map-gl';
//
//
// import 'bootstrap/dist/js/bootstrap';
//
// import ExampleOverlay from './components/map/Main';
//
// // import * as d3 from 'd3';
//
// import ChallengeCard from './components/ChallengeCard';
// // import Comp from './components/Comp';
//
// // import React from 'react';
// // import ReactDOM from 'react-dom';
//
// // import style from './global_styles/App.scss';
//
// const accessToken = 'pk.eyJ1Ijoiam1hdXNoYWciLCJhIjoiY2l2ODkyaDl1MDAwdTJvbnlmbHdvODM0MiJ9.rLkNA-rO4xq0O4_xIeqXVg';
//
// const pusher = new Pusher('cc379270b195d3a20931', {
//   cluster: 'eu',
//   encrypted: true
// });
//
//
// function createSprite(data) {
//   const monsterIcon = new Image();
//   monsterIcon.src = data.sprite;
//   monsterIcon.height = 50;
//   monsterIcon.width = 50;
//   monsterIcon.dataset.expires = data.expires;
//   // monsterIcon.dataset.pokemon = data.id;
//   // monsterIcon.dataset.name = data.name[0].toUpperCase() + data.name.substring(1);
//   // monsterIcon.dataset.hp = data.hp;
//   // monsterIcon.dataset.types = data.types.join(', ');
//   // monsterIcon.classList.add('sprite');
//   monsterIcon.classList.add('game');
//   return monsterIcon;
// }
//
// function update(map, coordinates) {
//   console.log('update');
//   function isInMapBounds(lngLat) {
//     const lng = parseFloat(lngLat[0]);
//     const lat = parseFloat(lngLat[1]);
//     const mapBounds = map.getBounds();
//     const boundsCheck = (lng > mapBounds.getWest() && lng < mapBounds.getEast()
//       && lat < mapBounds.getNorth() && lat > mapBounds.getSouth());
//
//     if (boundsCheck) {
//       return true;
//     }
//     return false;
//   }
//
//   function encounter(data) {
//     const marker = new mapboxgl.Marker(createSprite(data))
//       .setLngLat(data.coordinates)
//       .addTo(map);
//
//     console.log('Encounter!');
//     // If encounter is within visible map
//     if (isInMapBounds(data.coordinates)) {
//       navigator.vibrate(1000);
//     } else {
//       // TODO: Show arrow indicators
//     }
//   }
//
//   const point = {
//     type: 'Point',
//     coordinates
//   };
//
//   // TODO: animation
//   // function animateMarker(timestamp) {
//   //   map.getSource('user').setData(point);
//   //   requestAnimationFrame(animateMarker);
//   // }
//
//   // animateMarker(0);
//   // map.getSource('user').setData(point);
//
//   map.resize().setMaxBounds();
//
//   map.flyTo({ center: coordinates });
//   const me = document.getElementById('me');
//   console.log('me', me);
//   const markerMe = new mapboxgl.Marker(me)
//             .setLngLat(coordinates)
//             .addTo(map);
//
//   const mapBounds = map.getBounds();
//   const geoHashes = ngeohash.bboxes(mapBounds._sw.lat, mapBounds._sw.lng,
//     mapBounds._ne.lat, mapBounds._ne.lng, 6);
//
//   console.log('geoHashes', geoHashes);
//
//   let currentGeoHashes = [];
//   currentGeoHashes.forEach((geohash) => {
//     if (!geoHashes.includes(geohash)) {
//         // Unsubscribe from any hash we've moved out of
//       pusher.unsubscribe(geohash);
//       console.log('Unsubscribe');
//     }
//   });
//   currentGeoHashes = currentGeoHashes.filter(geohash => geoHashes.includes(geohash));
//   geoHashes.forEach((geohash) => {
//     if (!currentGeoHashes.includes(geohash)) {
//         // Subscribe to any new hashes we've moved into
//       console.log('Subscribe', geohash);
//       currentGeoHashes.push(geohash);
//       pusher.subscribe(geohash).bind('encounter', encounter);
//     }
//   });
// }
//
//
// class Map extends React.Component {
//   static propTypes() {
//     return {
//       width: React.PropTypes.number.isRequired,
//       height: React.PropTypes.number.isRequired
//     };
//   }
//   componentDidMount() {
//     const map = new mapboxgl.Map({
//       container: 'map',
//       style: 'mapbox://styles/jmaushag/cixls68am001d2rqsyzmlv0g3',
//       zoom: 20,
//       minZoom: 18,
//       maxZoom: 20,
//       dragPan: false,
//       pitch: 60, // pitch in degrees
//       bearing: -60 // bearing in degrees
//     });
//
//     const point = {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [0, 0]
//       }
//     };
//       // map.on('zoomend', update);
//       // map.on('rotateend', update);
//     map.on('load', () => {
//       map.addSource('user', { type: 'geojson', data: point });
//
//       map.addLayer({
//         id: 'user',
//         type: 'circle',
//         source: 'user',
//         paint: {
//           'circle-radius': 18,
//           'circle-color': 'Brown',
//           'circle-opacity': 0.4
//         }
//       });
//
//       map.addLayer({
//         id: '3d-buildings',
//         source: 'composite',
//         'source-layer': 'building',
//         filter: ['==', 'extrude', 'true'],
//         type: 'fill-extrusion',
//         minzoom: 15,
//         paint: {
//           'fill-extrusion-color': '#aaa',
//           'fill-extrusion-height': {
//             type: 'identity',
//             property: 'height'
//           },
//           'fill-extrusion-base': {
//             type: 'identity',
//             property: 'min_height'
//           },
//           'fill-extrusion-opacity': 0.6
//         }
//       });
//
//       // Brussels lngLat TODO: remove
//       map.setCenter([4.3517, 50.8503]);
//
//       // TODO: delete, only for testing
//       map.on('click', (e) => {
//         update(map, [e.lngLat.lng, e.lngLat.lat]);
//       });
//
//       navigator.geolocation.watchPosition((pos) => {
//         map.setCenter([pos.coords.longitude, pos.coords.latitude]);
//         update(map, [pos.coords.longitude, pos.coords.latitude]);
//       });
//
//
//       navigator.geolocation.getCurrentPosition((pos) => {
//         const coordinates = [pos.coords.longitude, pos.coords.latitude];
//         update(map, coordinates);
//       }, () => {}, { enableHighAccuracy: true });
//     });
//
//
//   // Remove all expired sprites
//     // (function removeExpired() {
//     //   const now = (new Date()).getTime();
//     //   const allSprites = document.querySelectorAll('[data-expires]');
//     //   for (const sprite of allSprites) {
//     //     if (sprite.dataset.expires < now) {
//     //       sprite.remove();
//     //     }
//     //   }
//     //   requestAnimationFrame(removeExpired);
//     // }());
//
//     document.querySelector('body').addEventListener('click', (event) => {
//       if (event.target.classList.contains('game')) {
//         jQuery('.modal').modal('show');
//       }
//     });
//     // modal.querySelector('.modal-close a').addEventListener('click', hide);
//   }
//   render() {
//     return (
//       <div>
//         <div id="me" />
//         <div
//           className="modal fade" id="myModal" tabIndex="-1" role="dialog"
//           aria-labelledby="exampleModalLabel" aria-hidden="true"
//         >
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
//                 <button type="button" className="close" data-dismiss="modal" aria-label="Close">
//                   <span aria-hidden="true">&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <ChallengeCard />
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary" data-dismiss="modal">
//                   Close
//                 </button>
//                 <button type="button" className="btn btn-primary">Save changes</button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <MapGL
//           width={700}
//           height={450}
//           latitude={4.3517}
//           longitude={-50.8503}
//           zoom={11}
//           mapStyle={'mapbox://styles/jmaushag/cixls68am001d2rqsyzmlv0g3'}
//           mapboxApiAccessToken={accessToken}
//         >
//           <ExampleOverlay />
//         </MapGL>
//       </div>
//     );
//   }
// }
//
// Map.defaultProps = {
//   width: 1000,
//   height: 1000,
//   id: 'map'
// };


const accessToken = 'pk.eyJ1Ijoiam1hdXNoYWciLCJhIjoiY2l2ODkyaDl1MDAwdTJvbnlmbHdvODM0MiJ9.rLkNA-rO4xq0O4_xIeqXVg';

import Immutable from 'immutable';
import React from 'react';
import r from 'r-dom';

import MapGL from 'react-map-gl';
import rasterTileStyle from 'raster-tile-style';

import locations from 'example-cities';

import ChallengesOverlay from './components/map/ChallengesOverlay';
import UserMarkerOverlay from './components/map/UserMarkerOverlay';

const tileSource = '//tile.stamen.com/toner/{z}/{x}/{y}.png';

const mapStyle = rasterTileStyle([tileSource]);


// class Comp extends React.Component {
//
// }

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: 0,
        longitude: 0,
        // mapStyle: Immutable.fromJS(mapStyle),
        zoom: 1
      },
      userPos: { latitude: 0, longitude: 0 }
    };
  }

  componentDidMount() {
    const self = this;
    window.addEventListener('resize', () => {
      this.setState({
        viewport: Object.assign({}, self.state.viewport, {
          width: window.innerWidth,
          height: window.innerHeight
        })
      });
    });

    navigator.geolocation.watchPosition((pos) => {
      // map.setCenter([pos.coords.longitude, pos.coords.latitude]);
      this.setState({ userPos: pos.coords });
    });

    navigator.geolocation.getCurrentPosition((pos) => {
      this.setState({ userPos: pos.coords });
    }, () => {}, { enableHighAccuracy: true });
  }

  _onChangeViewport(viewport) {
    console.log('viewport', viewport);
    const vp = {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: viewport.zoom
    };
    this.setState({ viewport: Object.assign({}, this.state.viewport, vp) });
  }

  _userMove(pos) {
    console.log('pos', pos);
    const viewport = this.state.viewport;
    viewport.longitude = pos.lng;
    viewport.latitude = pos.lat;
    this.setState({
      userPos: { latitude: viewport.latitude, longitude: viewport.longitude },
      viewport
    });
  }

  render() {
    return (
      <div>
        <MapGL
          {...this.state.viewport}
          mapboxApiAccessToken={accessToken}
          onChangeViewport={this._onChangeViewport.bind(this)}
          latitude={this.state.userPos.latitude}
          longitude={this.state.userPos.longitude}
          onClick={this._userMove.bind(this)}
          isDragging={false}
          startDragLngLat={null}
        >
          <ChallengesOverlay
            {...this.state.viewport}
            locations={locations}
          />
          <UserMarkerOverlay
            {...this.state.viewport}
            location={this.state.userPos}
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
