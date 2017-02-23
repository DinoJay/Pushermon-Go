import React from 'react';

import styles from './ChallengeCard.scss';

export default () => (
  <div className={styles.card}>
    <div className={styles.health}>
        888 Experience Points
      </div>
    <img
      alt="ChallengeCard-Pic" src="http://www.belgiumtheplaceto.be/photos/26569-bruxelles-parcoursbandedessineejacobs-blakeetmortimer-opt-jpremy.jpg"
      className={`${styles.hero} img-thumbnail`}
    />
    <h1> The evil detective </h1>
    <label>Summary</label><b>You defended the evil detective from taking over the control of the blackmarket!</b>
    <label>Location</label><b>Marolles, Brussels</b>
    <label>Difficulty</label><b>213</b>
    <label>Ties</label><b>62</b>
    <label>Win Percentage</label><b>60%</b>
    <label>People failed</label><b>General &quot;Thunderbolt&quot;</b>
    <label>People won</label><b>Jade-Jaws, Green Goliath</b>
    <label>Content Type</label><b>Art, Culture, Comics</b>
    <label>Did You Know</label><b>The detective is actually part of the
    <a href=" ">Blacksad comic series! </a> </b>
    <div className={styles.strengths}>
      <h2>
          Badges
        </h2>
    </div>
    <div className={styles.weaknesses}>
      <h2>
          Rating
        </h2>
    </div>

    <br className={styles.clear} />
    <br />
    <img alt="badges" className={styles.badges} src="https://s-media-cache-ak0.pinimg.com/originals/b0/98/6a/b0986a29be2f46451c4865370c4b286a.png" />
    <img alt="stars" className={styles.rating} src="http://css-stars.com/wp-content/uploads/2013/12/4-stars.jpg" />
  </div>
);
