import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';

import Calibration from './Pages/Calibration';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/calibration">Day 1: Chronal Calibration</Link></li>
          </ul>
        </nav>

        <Route path="/calibration" component={Calibration} />
      </div>
    </Router>
  );
}

export default App;
