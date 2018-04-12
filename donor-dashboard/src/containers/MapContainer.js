import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Map from '../components/Map.js';
import {fetchProjects} from '../actions/map';
import {GoogleApiWrapper} from 'google-maps-react';

const mapStateToProps = ({map}) => ({
  center: map.center,
  zoom: map.zoom,
  projects: map.projects,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchProjects,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)