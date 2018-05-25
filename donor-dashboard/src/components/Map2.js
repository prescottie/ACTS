import React from "react";
import MapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';
// import ProjectPin from './ProjectPin';
import mapboxgl from 'mapbox-gl';
import ProjectInfo from './ProjectInfo';

// const TOKEN = "pk.eyJ1Ijoid2luZS1tYXBzIiwiYSI6ImNqaDg4a2VjNDBoM2cyd3F4c25oMnN2MzYifQ.zHiHDDxiarb4jgK32Ya5tw"
const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

class Map extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      viewport: {
        latitude: -0.390580,
        longitude: 30.181807,
        zoom: 8,
        bearing: 0,
        pitch: 0,
        width: 400,
        height: 400,
      },
      popupInfo: null
    };
  }
  

  componentDidMount() {
    
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2luZS1tYXBzIiwiYSI6ImNqaDg4a2VjNDBoM2cyd3F4c25oMnN2MzYifQ.zHiHDDxiarb4jgK32Ya5tw';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/wine-maps/cjhikq90z3vnc2sqj79vkja90',
      center: this.props.center,
      zoom: this.props.zoom
    });
    map.addControl(new mapboxgl.NavigationControl())
    // const popup = new mapboxgl.Popup()
    map.on('click', function (e) {
      // var coordinates = e.features[0].geometry.coordinates.slice();
      // var name = e.features[0].properties.name;
        const features = map.queryRenderedFeatures(e.point);
        const symbols = features.filter(feature => feature.layer.type === 'symbol');
        if(symbols.length > 0 && symbols[0].properties.id) {
          console.log(features[0])
         if(this.props.projects.length > 0) {
          var correctProject = this.props.projects.filter(proj => proj.id === features[0].properties.id)
          var coords = [correctProject[0].location.y, correctProject[0].location.x]
          console.log(correctProject)
          new mapboxgl.Popup()
            .setLngLat(coords)
            .setHTML(`<h2 class="iw-title">${correctProject[0].name}</h2>
                      <div class="iw-content">
                        ${correctProject[0].project_type_id === 1 ? "<img class='iw-pic' alt='Project Picture' src='/tapstand.png' width='100' height='80'/>" : ""}
                        <p>${correctProject[0].description}</p>
                      </div>`)
            .addTo(map);
         }
        }
    }.bind(this));
    window.addEventListener('resize', this._resize);
    this.props.fetchProjects();
    this._resize();
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    this._resize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    console.log(this.props)
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
      // <MapGL
      //   {...viewport}
      //   mapStyle="mapbox://styles/wine-maps/cjhikq90z3vnc2sqj79vkja90"
      //   onViewportChange={this._updateViewport}
      //   mapboxApiAccessToken={TOKEN} >
          
      //     <div className="nav" style={navStyle}>
      //       <NavigationControl onViewportChange={this._updateViewport} />
      //     </div>
      <div style={{height:window.innerHeight-60}} id="map"></div>
          // {/* <ControlPanel containerComponent={this.props.containerComponent} /> */}
      // </MapGL>
    )
  }
}

export default Map;
