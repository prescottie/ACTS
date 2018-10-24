import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import MapContainer from './containers/MapContainer'
import AdminContainer from './containers/AdminContainer'
import ProjectContainer from './containers/ProjectContainer'
import New from './components/New'
import Navbar from './components/Navbar'
import './App.css';
import firebase from './firebase';
import { FirestoreProvider } from 'react-firestore';




class App extends Component {

  render() {
    return (
      <div className="App">
        <FirestoreProvider firebase={firebase}>
          <Navbar />
          <main className="Main">
            <Route exact path="/" component={MapContainer} />
            <Route exact path="/admin" component={AdminContainer} />
            <Route exact path="/new" component={New} />
            <Route exact path="/projects/:id" component={ProjectContainer} />
          </main>
        </FirestoreProvider>
      </div>
    );
  }
}

export default App;
