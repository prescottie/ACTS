import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Home from './containers/HomeContainer'
import Counter from './containers/CounterContainer'
import About from './components/About'
import Navbar from './components/Navbar'
import './App.css';

class App extends Component {


  render() {
    return (
      <div className="App">
        <Navbar />
        <main className="Main">
          <Route exact path="/" component={Home} />
          <Route exact path="/counter" component={Counter} />
          <Route exact path="/about-us" component={About} />
        </main>
    </div>
    );
  }
}

export default App;
