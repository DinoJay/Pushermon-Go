import React from 'react';

import styles from './Card.scss';
import imgSrc from './example_challenge.jpg';

const Card = (props) => {
  const cardStyle = {
    borderColor: 'gold',
    maxWidth: '30rem',
    backgroundColor: 'white'
  };
  return (
    <div className={styles.Card} style={cardStyle}>
      <div className={styles.header}>
        <div className="row">
          <div className="col float-left">{props.challenge}</div>
          <div className="col float-right">{props.xpPoints}</div>
        </div>
      </div>
      <img className={`${styles.challengeImgTop} card-block`} src={imgSrc} alt="Challenge cap" />

      <div className="card-block">
        <h4 className="card-title">{props.title}</h4>
        <p className="card-text" >
          {props.description}
        </p>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Location: {props.place}</li>
        <li className="list-group-item">Difficulty: {props.difficulty}</li>
        <li className="list-group-item">Content-Type: {props.contentType}</li>
        <li className="list-group-item">
          In deck of friends: {props.decksOfFriends.join(', ')}
        </li>
      </ul>
      <div className="card-block">
        <a href="#" className="card-link">Acquire!</a>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  place: React.PropTypes.string.isRequired,
  contentType: React.PropTypes.string.isRequired,
  difficulty: React.PropTypes.string.isRequired,
  // TODO: change in future to component
  challenge: React.PropTypes.string,
  xpPoints: React.PropTypes.number.isRequired,
  decksOfFriends: React.PropTypes.array.isRequired
};

Card.defaultProps = {
  title: 'The evil detective',
  description: 'You defended the evil detective from taking over the control of the blackmarket!',
  place: 'Brussels, Marolles',
  contentType: 'Art, Culture, Comics',
  // TODO: change in future to component
  challenge: 'Quiz',
  difficulty: 'hard',
  img: imgSrc,
  xpPoints: 100,
  decksOfFriends: ['Nils', 'Kiran', 'Babba']
};


const CardPreview = (props) => {
  const cardStyle = {
    borderColor: 'gold',
    maxWidth: '30rem'
  };
  return (
    <div className={styles.Card} style={cardStyle}>
      <div className={styles.header}>
        <div className="row">
          <div className="col float-left">{props.challenge}</div>
          <div className="col float-right">{props.xpPoints}</div>
        </div>
      </div>
      <img className={`${styles.challengeImgTop} mx-auto d-block`} src={imgSrc} alt="Challenge cap" />
      <div className="card-block">
        <h5 className="card-title">{props.title}</h5>
        <p className="card-text" >
          {props.description}
        </p>
      </div>
      <div className="card-block">
        <a href="#" className="card-link">Acquire!</a>
      </div>
    </div>
  );
};

CardPreview.propTypes = {
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  // TODO: change in future to component
  challenge: React.PropTypes.string,
  xpPoints: React.PropTypes.number.isRequired
};

CardPreview.defaultProps = {
  title: 'The evil detective',
  description: 'You defended the evil detective from taking over the control of the blackmarket!',
  place: 'Brussels, Marolles',
  contentType: 'Art, Culture, Comics',
  // TODO: change in future to component
  challenge: 'Quiz',
  difficulty: 'hard',
  img: imgSrc,
  xpPoints: 100,
  decksOfFriends: ['Nils', 'Kiran', 'Babba']
};

export { Card, CardPreview };
