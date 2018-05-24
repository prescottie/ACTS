// import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Map from '../components/Map2.js';
import {fetchProjects, onMapClicked, onMarkerClick} from '../actions/map';

const mapStateToProps = ({map}) => ({
  center: map.center,
  zoom: map.zoom,
  projects: map.projects,
  activeMarker: map.activeMarker,
  selectedPlace: map.selectedPlace,
  showingInfoWindow: map.showingInfoWindow,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchProjects,
  onMapClicked,
  onMarkerClick,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)