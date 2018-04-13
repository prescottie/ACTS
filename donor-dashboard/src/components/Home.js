import React from 'react'
import MapContainer from '../containers/MapContainer'
import FilterContainer from '../containers/FilterContainer'

class Home extends React.Component {
  
  render() {
    return(
      <div className="Home">
        <MapContainer />
        <FilterContainer />
      </div>
    );
  }
}
export default Home;