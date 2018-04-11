import React from 'react'
import MapContainer from '../containers/MapContainer'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return(
      <div className="Home">
        <MapContainer />
      </div>
    );
  }
}
export default Home;