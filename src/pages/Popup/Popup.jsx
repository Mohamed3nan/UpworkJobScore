// import React from 'react';
// import logo from '../../assets/img/logo.svg';
// import Greetings from '../../containers/Greetings/Greetings';
// import './Popup.css';

// const Popup = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/pages/Popup/Popup.jsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React!
//         </a>
//       </header>
//     </div>
//   );
// };

// export default Popup;

import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.png';
import './Popup.css';

const ScoreCircle = ({ color, score, label }) => (
  <div className={`score-circle ${color}`}>
    <span className="score">{score}</span>
    <span className="label">{label}</span>
  </div>
);

const Popup = () => {
  const [minScore, setMinScore] = useState('0');

  useEffect(() => {
    loadMinScore();
  }, []);

  const loadMinScore = () => {
    chrome.storage.sync.get({ minScore: '0' }, (result) => {
      console.log('Loaded minScore:', result.minScore);
      setMinScore(result.minScore.toString());
    });
  };

  const handleMinScoreChange = (e) => {
    const newMinScore = e.target.value;
    setMinScore(newMinScore);
    console.log('Slider moved to:', newMinScore);
    // Remove the storage set operation from here
  };

  const handleMinScoreCommit = () => {
    const numericScore = parseFloat(minScore) || 0;
    chrome.storage.sync.set({ minScore: numericScore }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving minScore:', chrome.runtime.lastError);
      } else {
        console.log('minScore saved:', numericScore);
      }
    });
  };

  const handleRefresh = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id, {}, () => {
          if (chrome.runtime.lastError) {
            console.error('Error refreshing page:', chrome.runtime.lastError.message);
          } else {
            console.log('Page refresh initiated');
          }
        });
      } else {
        console.error('No active tab found');
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Upwork Job Score</h1>
        <p className="description">These scores represent the overall quality of job postings on Upwork.</p>
        <div className="score-circles">
          <ScoreCircle color="red" score="-3.0" label="Poor" />
          <ScoreCircle color="yellow" score="3.0-5.0" label="Average" />
          <ScoreCircle color="light-green" score="5.0-7.0" label="Good" />
          <ScoreCircle color="green" score="7.0+" label="Excellent" />
        </div>
        <div className="score-input-container">
          <label htmlFor="min-score">Hide jobs with score below: {minScore}</label>
        </div>
        <div className="min-score-setting">
          <input
            type="range"
            id="min-score"
            name="min-score"
            min="0"
            max="10"
            step="0.1"
            value={minScore}
            onChange={handleMinScoreChange}
            onMouseUp={handleMinScoreCommit}
            onTouchEnd={handleMinScoreCommit}
          />
        </div>
        <div className="refresh-icon-container">
          <span className="refresh-icon" title="Refresh page" onClick={handleRefresh}>
            &#x27f3;
          </span>
        </div>
      </header>
      <footer className="App-footer">
        <div className="footer-links">
          <a href="https://github.com/Mohamed3nan/UpworkJobScore" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className="separator">|</span>
          <a href="https://chrome.google.com/webstore/detail/your-extension-id" target="_blank" rel="noopener noreferrer">Rate!</a>
          <p className="footer-credit">Made with ♥ by Anan</p>
        </div>
      </footer>
    </div>
  );
};

export default Popup;
