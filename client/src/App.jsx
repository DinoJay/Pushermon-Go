import React from 'react';

import mapboxgl from 'mapbox-gl';
import Pusher from 'pusher-js';
import './global_styles/app.scss';
// import Comp from './components/Comp';

// import React from 'react';
// import ReactDOM from 'react-dom';

// import style from './global_styles/App.scss';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam1hdXNoYWciLCJhIjoiY2l2ODkyaDl1MDAwdTJvbnlmbHdvODM0MiJ9.rLkNA-rO4xq0O4_xIeqXVg';

const pusher = new Pusher('cc379270b195d3a20931', {
  cluster: 'eu',
  encrypted: true
});


function createSprite(data) {
  const monsterIcon = new Image();
  monsterIcon.src = data.sprite;
  monsterIcon.height = 50;
  monsterIcon.width = 50;
  monsterIcon.dataset.expires = data.expires;
  monsterIcon.dataset.pokemon = data.id;
  monsterIcon.dataset.name = data.name[0].toUpperCase() + data.name.substring(1);
  monsterIcon.dataset.hp = data.hp;
  monsterIcon.dataset.types = data.types.join(', ');
  monsterIcon.classList.add('sprite');
  monsterIcon.classList.add('pokemon');
  return monsterIcon;
}

function update(map, coordinates) {
  function isInMapBounds(lngLat) {
    const lng = parseFloat(lngLat[0]);
    const lat = parseFloat(lngLat[1]);
    const mapBounds = map.getBounds();
    const boundsCheck = (lng > mapBounds.getWest() && lng < mapBounds.getEast()
      && lat < mapBounds.getNorth() && lat > mapBounds.getSouth());

    if (boundsCheck) {
      return true;
    }
    return false;
  }

  function encounter(data) {
    const marker = new mapboxgl.Marker(createSprite(data))
      .setLngLat(data.coordinates)
      .addTo(map);

    console.log('Encounter!');
    // If encounter is within visible map
    if (isInMapBounds(data.coordinates)) {
      navigator.vibrate(1000);
    } else {
      // TODO: Show arrow indicators
    }
  }

  const point = {
    type: 'Point',
    coordinates
  };

  // TODO: animation
  // function animateMarker(timestamp) {
  //   map.getSource('user').setData(point);
  //   requestAnimationFrame(animateMarker);
  // }

  // animateMarker(0);
  map.getSource('user').setData(point);

  map.resize().setMaxBounds();

  map.flyTo({ center: coordinates });

  const mapBounds = map.getBounds();
  const geoHashes = ngeohash.bboxes(mapBounds._sw.lat, mapBounds._sw.lng,
    mapBounds._ne.lat, mapBounds._ne.lng, 6);

  console.log('geoHashes', geoHashes);

  let currentGeoHashes = [];
  currentGeoHashes.forEach((geohash) => {
    if (!geoHashes.includes(geohash)) {
        // Unsubscribe from any hash we've moved out of
      pusher.unsubscribe(geohash);
      console.log('Unsubscribe');
    }
  });
  currentGeoHashes = currentGeoHashes.filter(geohash => geoHashes.includes(geohash));
  geoHashes.forEach((geohash) => {
    if (!currentGeoHashes.includes(geohash)) {
        // Subscribe to any new hashes we've moved into
      console.log('Subscribe', geohash);
      currentGeoHashes.push(geohash);
      pusher.subscribe(geohash).bind('encounter', encounter);
    }
  });
}

class Map extends React.Component {
  static propTypes() {
    return {
      width: React.PropTypes.number.isRequired,
      height: React.PropTypes.number.isRequired
    };
  }
  componentDidMount() {
    console.log('start pos');

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/jmaushag/cixls68am001d2rqsyzmlv0g3',
      zoom: 20,
      minZoom: 18,
      maxZoom: 20,
      dragPan: false
    });

    const point = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    };
      // map.on('zoomend', update);
      // map.on('rotateend', update);
    map.on('load', () => {
      map.addSource('user', { type: 'geojson', data: point });

      map.addLayer({
        id: 'user',
        type: 'circle',
        source: 'user',
        paint: {
          'circle-radius': 18,
          'circle-color': 'Brown',
          'circle-opacity': 0.4
        }
      });

      map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': {
            type: 'identity',
            property: 'height'
          },
          'fill-extrusion-base': {
            type: 'identity',
            property: 'min_height'
          },
          'fill-extrusion-opacity': 0.6
        }
      });

      // Brussels lngLat TODO: remove
      map.setCenter([4.3517, 50.8503]);

      // TODO: delete, only for testing
      map.on('click', (e) => {
        update(map, [e.lngLat.lng, e.lngLat.lat]);
      });

      navigator.geolocation.watchPosition((pos) => {
        map.setCenter([pos.coords.longitude, pos.coords.latitude]);
        update(map, [pos.coords.longitude, pos.coords.latitude]);
      });


      navigator.geolocation.getCurrentPosition((pos) => {
        const coordinates = [pos.coords.longitude, pos.coords.latitude];
        update(map, coordinates);
        // hideLoading();
      });
    }, () => {}, { enableHighAccuracy: true });


  // Remove all expired sprites
    // (function removeExpired() {
    //   const now = (new Date()).getTime();
    //   const allSprites = document.querySelectorAll('[data-expires]');
    //   for (const sprite of allSprites) {
    //     if (sprite.dataset.expires < now) {
    //       sprite.remove();
    //     }
    //   }
    //   requestAnimationFrame(removeExpired);
    // }());
  }
  render() {
    return (
      <div
        id={this.props.id}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

Map.defaultProps = {
  width: 1000,
  height: 1000,
  id: 'map'
};

export default Map;
