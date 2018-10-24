import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Project from '../components/Project.js';
import {fetchProject, deletePhotos} from '../actions/project';

const mapStateToProps = ({project}) => ({

});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  deletePhotos
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Project)