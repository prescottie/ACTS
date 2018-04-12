import React from "react";
import {Map as MapEl, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class Map extends React.Component {
  constructor(props){
    super(props);
  }

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };
  
 
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
 
  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };
  
  componentDidMount() {
    this.props.fetchProjects();
  }

  render() {
    const {projects} = this.props;
    const markers = projects.map((p, i) => {
      return (
          <Marker 
            data-proj-type={p['ID']}
            name={p.Name}
            onClick={this.onMarkerClick}
            position={{lat: p.Latitude, lng: p.Longitude}}
          />

      );
    });

    return (
      <MapEl google={this.props.google} zoom={this.props.zoom} initialCenter={this.props.center} onClick={this.onMapClicked}>
        {markers}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </MapEl>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAHvWhmOxhlD6zVfTQAq_Wva3bjKgaTL2w'
})(Map);
