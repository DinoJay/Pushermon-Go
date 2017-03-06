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

const colorClass = () => colorScale(Math.random() * 30);


const CardDetail = ({ place, description, location, caption, media, cardSets, linkedCards }) => (
  <div>
    <div className={`w3-container w3-margin w3-center ${styles.caption}`}>{caption}</div>
    <section className="w3-container w3-margin">
      <table className="w3-table w3-striped w3-bordered">
        <tr className=""><td>Location:</td><td>{`${place} (${Object.values(location).join(',')})`}</td></tr>
        <tr><td>Description:</td><td>
          <div className={styles.textClamp}>{description}</div>
        </td>
        </tr>
        <tr className=""><td>Media</td>
          <td>
            <div className="w3-row">
              {media.map(m =>
                <div key={m.src}>
                  <span className="w3-col" style={{ width: '20px' }}>
                    <i className={`fa ${mediaScale(m.type)} fa-3 w3-margin-right`} aria-hidden="true" />
                  </span>
                  <span className="w3-rest"> <a href={m.src}> { m.name } </a></span>
                </div>
          )}
            </div>
          </td>
        </tr>
        <tr>
          <td>Card Sets</td>
          <td> {cardSets.map(c => <span key={c} className={`w3-tag ${colorClass()}`}>{c}</span>)} </td>
        </tr>
        <tr>
          <td>linked Cards</td>
          <td> {linkedCards.map(c => <span key={c} className={`w3-tag ${colorClass()}`}>{c}</span>)} </td>
        </tr>
      </table>
    </section>
    <div className="w3-padding">
      <button className={`w3-padding w3-btn w3-block w3-xxlarge w3-round ${colorClass()}`}>
        <span style={{ marginLeft: '10px' }}> Collect! </span>
        <i className="fa fa-lock" aria-hidden="true" />
      </button>
    </div>
  </div>
);


CardDetail.propTypes = {
  place: React.PropTypes.string.isRequired,
  location: React.PropTypes.object,
  caption: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  friends: React.PropTypes.array.isRequired,
  media: React.PropTypes.array.isRequired,
  creator: React.PropTypes.string.isRequired,
  cardSets: React.PropTypes.array.isRequired,
  linkedCards: React.PropTypes.array.isRequired
};

CardDetail.defaultProps = {
  key: 'asa',
  description: 'What so special about the location, describe it',
  location: { latitude: 50.828797, longitude: 4.352191 },
  place: 'Park next to my Home',
  creator: 'Jan',
  media: [
      { type: 'photo', src: 'todo' },
      { type: 'hyperlink', src: 'https://en.wikipedia.org/wiki/Arthur_De_Greef_(composer)' },
      { type: 'game', src: 'todo' }
  ],
  cardSets: ['Brussels VIP', 'Music challenge (Cards can be specific sets)']
};


const CardCont = ({ key, title, closeHandler, tags, xpPoints, img, children }) => {
  let Closer;
  if (closeHandler !== undefined) {
    Closer = <span onClick={closeHandler} className="w3-container w3-closebtn">&times;</span>;
  }

  return (
    <div key={key} className={`w3-card-4 ${colorClass()}`} >
      {Closer}
      <section className="w3-margin w3-container">
        <h2>{title}</h2>
        <div className="w3-row">
          <div className="w3-col s4"><span className="w3-badge w3-round w3-xlarge w3-green" >Exp {xpPoints}</span></div>
          <div className="w3-col s8 w3-right-align">
            {tags.map(t => <span key={t} className={`w3-tag w3-xlarge ${colorClass()}`} style={{ float: 'right' }}>{t}</span>)}
          </div>
        </div>
      </section>
      <div className="w3-container">
        <img className="w3-row-padding w3-col s12 w3-center" src={img} alt="Card cap" />
      </div>
      {children}
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

const CardBack = ({ key, friends, creator }) => (
  <div key={key} style={{ height: '600px' }} className={`w3-card-4 ${colorClass()}`} >
    <div className="w3-card">
      <div className="w3-container w3-section">
        <h2>Comments </h2>
        {
          friends.map(fr => (
            <div key={fr.user} className="w3-row">
              <div className="w3-col s3 w3-circle" >
                <span className={styles.stamp}>{fr.user}</span>
              </div>
              <div className="w3-rest">
                <p className={styles.textClamp}> {fr.text} </p>
              </div>
            </div>
          )
        )
      }
      </div>
      <div className={'w3-container w3-section'}>
        <h2>Creator </h2>
        <div className={`w3-col ${styles.colSmallAvatar}`}>
          <div className="w3-col s4 w3-circle" >
            <span className={styles.stamp}>{creator}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
);

CardBack.propTypes = {
  key: React.PropTypes.string.isRequired,
  friends: React.PropTypes.array.isRequired
};

CardCont.defaultProps = {
  key: 'asa',
  friends: [
    {
      user: 'Nils',
      img: 'https://placeholdit.imgix.net/~text?txtsize=6&txt=50%C3%9750&w=50&h=50',
      text: 'I did not know that he was such a famous composer'
    },
    {
      user: 'Babba',
      text: 'What a nice park, strange, that they put a mask on his face!'
    }
  ]
};


const CardFront = props => <CardCont {...props}> <CardDetail {...props} /> </CardCont>;

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frontView: true
    };
  }
  render () {
    const sideToggler = !this.state.frontView ? styles.flipAnim : null;
    // const style = { position: !this.state.frontView ? 'absolute' : null };
    const ToggleCard = this.state.frontView ? <CardFront {...this.props} /> : <CardBack {...this.props} />;
    return (
      <div
        className={`${styles.flipContainer} ${sideToggler}`}
        onClick={() => this.setState({ frontView: !this.state.frontView })}
      >
        <div className={`${styles.flipper} ${sideToggler}`}>
          <div >
            {ToggleCard}
          </div>
        </div>
      </div>
    );
  }
}

export { Card, CardCont };
