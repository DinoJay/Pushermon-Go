import React from 'react';
import * as d3 from 'd3';

import styles from './Card.scss';
import colorClasses from '../colorClasses';

const mediaTypes = ['game', 'hyperlink', 'photo', 'video'];

const mediaScale = d3.scaleOrdinal()
                     .domain(mediaTypes)
                     .range(['fa-gamepad', 'fa-link', 'fa-camera', 'fa-video-camera']);

console.log('mediaScale', mediaScale('hyperlink'));
const colorScale = d3.scaleLinear()
    .domain(d3.range(colorClasses.length))
    .range(colorClasses)
    .clamp(true);

const CardDetail = ({ place, decksOfFriends, description, location, feedback, media, creator, cardSets }) => <div>
  <table className="w3-table w3-striped w3-bordered">
    <tr className=""><td>Location:</td><td>{`${place} (${Object.values(location).join(',')})`}</td></tr>
    <tr className=""><td>Description:</td><td>{description}</td></tr>
    <tr className=""><td>In deck of friends:</td><td>{decksOfFriends.join(', ')}</td> </tr>
    <tr className=""><td>Media</td><td>{media.map(m => <i style={{ marginRight: '10px' }} className={`fa ${mediaScale(m)} fa-6`} aria-hidden="true" />)}</td> </tr>
    <tr className=""><td>Creator</td><td><img className="w3-hide-small w3-circle" src="https://api.adorable.io/avatars/49/jan.png" style={{ height: '30px' }} /></td></tr>
    <tr className=""><td>Card Sets</td>
      <td> {cardSets.map(c => <span key={c} className={`w3-tag ${colorScale(Math.random() * 30)}`}>{c}</span>)} </td>
    </tr>
    <tr className=""><td>Feedback</td>
      <td>
        {
          feedback.map(fb => (
            <div key={fb.user} className="w3-row" style={{ paddingBottom: '10px' }}>
              <div className="w3-col s1"><img className="w3-hide-small w3-circle" src={`https://api.adorable.io/avatars/49/${fb.user}.png`} alt={fb.user} style={{ height: '30px' }} /></div>
              <div className="w3-col s11">{fb.text}</div>
            </div>
          )
        )
        }
      </td>
    </tr>
  </table>
  <div className="">
    <a href="#">Acquire!</a>
  </div>
</div>;

CardDetail.propTypes = {
  place: React.PropTypes.string.isRequired,
  location: React.PropTypes.object,
  description: React.PropTypes.string.isRequired,
  decksOfFriends: React.PropTypes.array.isRequired,
  feedback: React.PropTypes.array.isRequired,
  media: React.PropTypes.array.isRequired,
  creator: React.PropTypes.string.isRequired,
  cardSets: React.PropTypes.array.isRequired
};

CardDetail.defaultProps = {
  key: 'asa',
  description: 'What so special about the location, describe it',
  location: { latitude: 50.828797, longitude: 4.352191 },
  place: 'Park next to my Home',
  decksOfFriends: ['Nils', 'Kiran', 'Babba', '(some friends who already obtained the card)'],
  creator: 'Jan',
  media: [
      { type: 'photo', src: 'todo' },
      { type: 'hyperlink', src: 'https://en.wikipedia.org/wiki/Arthur_De_Greef_(composer)' },
      { type: 'game', src: 'todo' }
  ],
  feedback: [
    {
      user: 'Nils',
      img: 'https://placeholdit.imgix.net/~text?txtsize=6&txt=50%C3%9750&w=50&h=50',
      text: 'I did not know that he was such a famous composer'
    },
    {
      user: 'Babba',
      text: 'What a nice park, strange, that they put a mask on his face!'
    }
  ],
  cardSets: ['Brussels VIP', 'Music challenge (Cards can be specific sets)']
};


const CardCont = ({ key, title, closeHandler, tags, xpPoints, img, children }) => {
  let Closer;
  if (closeHandler !== undefined) {
    Closer = <span onClick={closeHandler} className="w3-container w3-closebtn">&times;</span>;
  }

  return (
    <div key={key} className={`w3-card-4 ${colorScale(Math.random() * 30)}`}>
      {Closer}
      <div className="w3-container">
        <h1>{title}</h1>
        <div className="w3-row-padding">
          <div className="w3-col s4"><span className="w3-badge w3-xlarge w3-green">Exp {xpPoints}</span></div>
          <div className="w3-col s4">{tags.map(t => <span key={t} className={`w3-tag ${colorScale(Math.random() * 30)}`}>{t}</span>)}</div>
        </div>
      </div>
      <div className="w3-container">
        <img style={{ maxHeight: '320px' }} src={img} alt="Card cap" />
      </div>
      <footer className="w3-container">
        {children}
      </footer>
    </div>);
};

CardCont.propTypes = {
  // id: React.PropTypes.number,
  key: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  tags: React.PropTypes.array.isRequired,
  img: React.PropTypes.string.isRequired,
  xpPoints: React.PropTypes.number.isRequired,
  closeHandler: React.PropTypes.func,
  children: React.PropTypes.array
};

CardCont.defaultProps = {
  key: 'asa',
  title: 'Example Title POI',
  tags: ['Art', 'Culture', 'Comics', 'Music', '(Example tags)'],
  img: 'https://placeimg.com/640/480/arch',
  xpPoints: 100,
  // TODO: remove in future to component
  closeHandler: () => (null),
  children: <CardDetail />
};

const Card = props => <CardCont {...props}> <CardDetail {...props} /> </CardCont>;


export { Card, CardCont };
