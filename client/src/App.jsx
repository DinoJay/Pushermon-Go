import React from 'react';

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
function update(map, source, location) {
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

  source.setData({
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: location
      }
    }]
  });

  map.resize().setMaxBounds();

  map.flyTo({ center: location });

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

// function initialLoad(location) {
//   return { map, source };
// }


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


    navigator.geolocation.getCurrentPosition((position) => {
      console.log('current pos', position);
      const coords = [position.coords.longitude, position.coords.latitude];

      const source = new mapboxgl.GeoJSONSource({
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: coords
            }
          }]
        }
      });
      map.setCenter(coords);

      // map.on('zoomend', update);
      // map.on('rotateend', update);
      map.on('load', () => {
        map.addSource('me', source);
        map.addLayer({
          id: 'me',
          type: 'symbol',
          source: 'me',
          layout: {
            'icon-image': 'circle-15'
          }
        });

        map.on('click', (e) => {
          const center = map.getCenter();
          console.log('click', e, 'center', center);
          update(map, source, [e.lngLat.lng, e.lngLat.lat]);
      // initialLoad([e.lngLat.lng, e.lngLat.lat]);
        // var features = map.queryRenderedFeatures(e.point, { layers: ['places'] });
        // map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        });

        navigator.geolocation.watchPosition((pos) => {
          update(map, source, [pos.coords.longitude, pos.coords.latitude]);
        });
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
        // className={style.Comp}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

Map.defaultProps = {
  width: 1000,
  height: 1000
};

export default Map;

// export default () => (
//   <div>
//     <h1>It Works!</h1>
//     <p>This React project just works including <span className="redBg">module</span> local styles.</p>
//     <p>Example Comp!</p>
//   </div>
//   );
