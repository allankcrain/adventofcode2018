import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavBar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';

import './App.css';

import Calibration from './Pages/Calibration'; // Day 1
import InventoryManagementSystem from './Pages/InventoryManagementSystem'; // Day 2
import SliceIt from './Pages/SliceIt'; // Day 3

function App() {
  return (
    <Router>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      />

      <div className="App">
        <NavBar bg="light" expand="lg">
          <Nav className="mr-auto">
            <NavDropdown title="Days">
              <NavDropdown.Item href="/calibration">Day 1: Chronal Calibration</NavDropdown.Item>
              <NavDropdown.Item href="/inventoryManagementSystem">Day 2: Inventory Management System</NavDropdown.Item>
              <NavDropdown.Item href="/sliceIt">Day 3: No Matter How You Slice It</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </NavBar>

        <Route path="/calibration" component={Calibration} />
        <Route path="/inventoryManagementSystem" component={InventoryManagementSystem} />
        <Route path="/sliceIt" component={SliceIt} />
      </div>
    </Router>
  );
}

export default App;
