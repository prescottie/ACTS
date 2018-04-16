import React from "react";
import {Map as MapEl, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class Map extends React.Component {

  // state = {
  //   showingInfoWindow: false,
  //   activeMarker: {},
  //   selectedPlace: {},
  // };
  
 
  // onMarkerClick = (props, marker, e) =>
  //   this.setState({
  //     selectedPlace: props,
  //     activeMarker: marker,
  //     showingInfoWindow: true
  //   });
 
  // onMapClicked = (props) => {
  //   if (this.state.showingInfoWindow) {
  //     this.setState({
  //       showingInfoWindow: false,
  //       activeMarker: null
  //     })
  //   }
  // };
  
  componentDidMount() {
    this.props.fetchProjects();
  }

  swithXBtn = () => {
      const iwOuter = document.getElementsByClassName('gm-style-iw')[0];
      iwOuter.nextElementSibling.firstChild.setAttribute('src', '/close.png');
      iwOuter.nextElementSibling.firstChild.style.width = '24px';
      iwOuter.nextElementSibling.firstChild.style.height = '24px';
      iwOuter.nextElementSibling.firstChild.style.left = '0px';
      iwOuter.nextElementSibling.firstChild.style.top = '0px';
      iwOuter.nextElementSibling.style.width = '24px';
      iwOuter.nextElementSibling.style.height = '24px';
      iwOuter.previousElementSibling.children[1].style.display = 'none';
      iwOuter.previousElementSibling.children[3].style.display = 'none';
      iwOuter.nextElementSibling.style.right = '56px';
      iwOuter.nextElementSibling.style.top = '24px';
      iwOuter.nextElementSibling.firstChild.style.opacity = '1';

      iwOuter.previousElementSibling.children[2].children[0].firstChild.style.borderLeft = '1.1px solid #506187 '
      iwOuter.previousElementSibling.children[2].children[0].firstChild.style.zIndex = '1'
      iwOuter.previousElementSibling.children[2].children[1].firstChild.style.borderRight = '1.1px solid #506187 '
      iwOuter.previousElementSibling.children[2].children[1].firstChild.style.zIndex = '1'
  }

  render() {
    const {projects, onMarkerClick, onMapClicked, activeMarker, zoom, center, showingInfoWindow, google, selectedPlace} = this.props;
    const style = {
      width: '80%',
      height: '100%'
    };
 
    const markers = projects.map((p, i) => {
      return (
          <Marker 
            data-proj-type={p.type_id}
            data-description={p.description}
            data-lat={p.location.x}
            data-lng={p.location.y}
            name={p.name}
            onClick={onMarkerClick}
            position={{lat: p.location.x, lng: p.location.y}}
          />
      );
    });

    return (
      <MapEl style={style} google={google} zoom={zoom} initialCenter={center} onClick={onMapClicked}>
        {markers}
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}
          onOpen={this.swithXBtn}>
            <div className="iw">
              <h2 className="iw-title">{activeMarker.name}</h2>
              <div className="iw-content">
                <img className="iw-pic" alt="Project Picture" src='/tapstand.png' width='100' height='80'/>
                <p>{activeMarker['data-description']}</p>
                <p>Coordinates: {activeMarker['data-lat']}, {activeMarker['data-lat']}</p>
              </div>
            </div>
        </InfoWindow>
      </MapEl>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAHvWhmOxhlD6zVfTQAq_Wva3bjKgaTL2w'
})(Map);
