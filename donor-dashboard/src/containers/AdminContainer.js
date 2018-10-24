// import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Admin from '../components/Admin.js';
import {changeForm} from '../actions/admin';
import firebase from '../firebase'

const mapStateToProps = ({admin}) => ({
  formName: admin.formName,
  formDescription: admin.formDescription,
  formProjType: admin.formProjType,
  formPopulation: admin.formPopulation,
  formLon: admin.formLon,
  formLat: admin.formLat,
  formCompletionDate: admin.formCompletionDate,
  formPhotos: admin.formPhotos,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeForm
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin)