import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import MapContainer from './containers/MapContainer'
import Navbar from './components/Navbar'
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Navbar />
        <main className="Main">
          <Route exact path="/" component={MapContainer} />
        </main>
    </div>
    );
  }
}

export default App;
