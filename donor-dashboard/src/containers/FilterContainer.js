import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Filter from '../components/Filter.js';
// import {fetchProjects, onMapClicked, onMarkerClick} from '../actions/filter';

const mapStateToProps = ({filter}) => ({

});

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter)