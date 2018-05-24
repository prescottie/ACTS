import React from "react";
import MapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import ControlPanel from './ControlPanel';
import ProjectPin from './ProjectPin';
import ProjectInfo from './ProjectInfo';

const TOKEN = "pk.eyJ1Ijoid2luZS1tYXBzIiwiYSI6ImNqaDg4a2VjNDBoM2cyd3F4c25oMnN2MzYifQ.zHiHDDxiarb4jgK32Ya5tw"
const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

class Map extends React.Component {

  // state = {
  //   showingInfoWindow: false,
  //   activeMarker: {},
  //   selectedPlace: {},
  // };
  constructor(props){
    super(props);
    this.state = {
      viewport: {
        latitude: -0.390580,
        longitude: 30.181807,
        zoom: 8,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500,
      },
      popupInfo: null
    };
  }
  
 
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
    window.addEventListener('resize', this._resize);
    this.props.fetchProjects();
    this._resize();
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    });
  };

  _updateViewport = (viewport) => {
    this.setState({viewport});
  }

  _renderProjectMarker = (project, index) => {
    return (
      <Marker key={`marker-${index}`}
        longitude={project.location.y}
        latitude={project.location.x} >
        <ProjectPin size={20} onClick={() => this.setState({popupInfo: project})} />
      </Marker>
    );
  }

  _renderPopup() {
    const {popupInfo} = this.state;

    return popupInfo && (
      <Popup tipSize={5}
        anchor="top"
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        onClose={() => this.setState({popupInfo: null})} >
        <ProjectInfo info={popupInfo} />
      </Popup>
    );
  }
  

  render() {
    const {viewport} = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/noahrosen/cjhku3m4g0pfs2rpfg0rfv6yf"
        onViewportChange={this._updateViewport}
        mapboxApiAccessToken={TOKEN} >
          {this.props.projects.map(this._renderProjectMarker)}
          <div className="nav" style={navStyle}>
            <NavigationControl onViewportChange={this._updateViewport} />
          </div>
          {/* <ControlPanel containerComponent={this.props.containerComponent} /> */}
      </MapGL>
    )
  }
}

export default Map;
