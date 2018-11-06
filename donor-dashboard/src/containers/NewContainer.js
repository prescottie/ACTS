import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import New from '../components/New.js';
import { deletePhotos, sendSponsorPhoto} from '../actions/project';

const mapStateToProps = ({project}) => ({
  
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  deletePhotos,
  sendSponsorPhoto
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(New)