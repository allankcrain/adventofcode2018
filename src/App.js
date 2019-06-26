import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';

import Calibration from './Pages/Calibration'; // Day 1
import InventoryManagementSystem from './Pages/InventoryManagementSystem'; // Day 2

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/calibration">Day 1: Chronal Calibration</Link></li>
            <li><Link to="/inventoryManagementSystem">Day 2: Inventory Management System</Link></li>
          </ul>
        </nav>

        <Route path="/calibration" component={Calibration} />
        <Route path="/inventoryManagementSystem" component={InventoryManagementSystem} />
      </div>
    </Router>
  );
}

export default App;
