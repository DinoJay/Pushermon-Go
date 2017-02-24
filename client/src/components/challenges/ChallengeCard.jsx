import React from 'react';

import styles from './ChallengeCard.scss';
import imgSrc from './example_challenge.jpg';


  // <div className={styles.card}>
  //   <div className={styles.health}>
  //       888 Experience Points
  //     </div>
  //   <img
  //     alt="ChallengeCard-Pic" src=
  //     className={`${styles.hero} img-thumbnail`}
  //   />
  //   <h1> The evil detective </h1>
  //   <label>Summary</label><b>You defended the evil detective from taking over the control of the blackmarket!</b>
  //   <label>Location</label><b>Marolles, Brussels</b>
  //   <label>Difficulty</label><b>213</b>
  //   <label>Ties</label><b>62</b>
  //   <label>Win Percentage</label><b>60%</b>
  //   <label>People failed</label><b>General &quot;Thunderbolt&quot;</b>
  //   <label>People won</label><b>Jade-Jaws, Green Goliath</b>
  //   <label>Content Type</label><b>Art, Culture, Comics</b>
  //   <label>Did You Know</label><b>The detective is actually part of the
  //   <a href=" ">Blacksad comic series! </a> </b>
  //   <div className={styles.strengths}>
  //     <h2>
  //         Badges
  //       </h2>
  //   </div>
  //   <div className={styles.weaknesses}>
  //     <h2>
  //         Rating
  //       </h2>
  //   </div>
  //
  //   <br className={styles.clear} />
  //   <br />
  //   <img alt="badges" className={styles.badges} src="https://s-media-cache-ak0.pinimg.com/originals/b0/98/6a/b0986a29be2f46451c4865370c4b286a.png" />
  //   <img alt="stars" className={styles.rating} src="http://css-stars.com/wp-content/uploads/2013/12/4-stars.jpg" />
  // </div>


const ChallengeCard = (props) => {
  const cardStyle = {
    borderColor: 'gold',
    maxWidth: '30rem'
  };
  return (
    <div className="card" style={cardStyle}>
      <div className="card-header">
        <div className="row">
          <div className="col float-left">{props.challenge}</div>
          <div className="col float-right">{props.xpPoints}</div>
        </div>
      </div>
      <img className={styles.challengeImgTop} src={imgSrc} alt="Challenge cap" />
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

ChallengeCard.propTypes = {
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

ChallengeCard.defaultProps = {
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

export default ChallengeCard;
