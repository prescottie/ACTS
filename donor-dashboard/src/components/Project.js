import React from 'react'
import firebase from '../firebase'
import {FirestoreDocument}  from "react-firestore";
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import ErrorIcon from '@material-ui/icons/Error';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment';

var db = firebase.firestore();

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

class Project extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      editing: false,
      formName: "",
      formDescription: "",
      formProjType: null,
      formPopulation: "",
      formLon: "",
      formLat: "",
      formCompletionDate: "",
      formPhotos: [],
      formID: "",
      uploadedPhotos: [],
      succesOpen: false,
      errorOpen: false,
      Transition: null,
      photosToDelete: [],
    }
  }

  handleEdit = (project) => {

    this.setState({
      editing: true,
      formID: project.id,
      formName: project.name,
      formDescription: project.description,
      formProjType: this.getProjType(project.project_type),
      formPopulation: project.population,
      formLon: project.location[0],
      formLat: project.location[1],
      formCompletionDate: moment.unix(project.completion_date.seconds).local().format("YYYY-MM-DD"),
      uploadedPhotos: project.photos ? this.state.uploadedPhotos.concat(project.photos) : [],
    })
  }

  handleChange = (e) => {
    switch(e.target.name) {
      case "name":
        return this.setState({formName: e.target.value})
        break;
      case "description":
        return this.setState({formDescription: e.target.value})
        break;
      case "project_type":
        return this.setState({formProjType: e.target.value})
        break;
      case "longitude":
        return this.setState({formLon: e.target.value})
        break;
      case "latitude":
        return this.setState({formLat: e.target.value})
        break;
      case "population":
        return this.setState({formPopulation: e.target.value})
        break;
      case "completion_date":
        return this.setState({formCompletionDate: e.target.value})
        break;
    }
  }

  handlePhotoChange = (e) => {
    this.setState({formPhotos: this.state.formPhotos.concat(Array.from(e.target.files))})
  }

  handleSave = () => {
    const { formName, formDescription, formPhotos, formCompletionDate, formLon, formLat, formPopulation, formProjType, formID, uploadedPhotos, photosToDelete} = this.state;
    this.props.deletePhotos(photosToDelete);
      const storage = firebase.storage();
      const storageRef = storage.ref();
      const photosArray = uploadedPhotos;
      return Promise.all(formPhotos.map(function(file) {
        const projectImageRef = storageRef.child(`project-${formID}-${file.name}`);
        return projectImageRef.put(file).then(function(snapshot) {
          projectImageRef.getDownloadURL().then(function(url) {
            photosArray.push(url);
          })
        })
      })).then(()=> {
        setTimeout(()=> {
          console.log(photosArray);
          db.collection("projects").doc(formID).set({
            name: formName,
            description: formDescription,
            completion_date: new Date(formCompletionDate),
            location: [formLon, formLat],
            population: formPopulation,
            project_type: this.giveProjType(formProjType),
            photos: photosArray.length ? photosArray : null
          })
          .then(function(docRef) {
              console.log("Document written with ID: ", docRef);
              this.setState({
                editing: false,
                formID: '',
                formName: '',
                formDescription: '',
                formProjType: '',
                formPopulation: '',
                formLon: '',
                formLat: '',
                formCompletionDate: '',
                formPhotos: [],
                succesOpen: true,
                Transition: TransitionUp,
                deleteDialog: false,
              })
          }.bind(this))
          .catch(function(error) {
              this.handleSnack(TransitionUp, "errorOpen");
              console.error("Error adding document: ", error);
          });
        }, 400)
      })
  }

  getProjType = (project_type) => {
    switch(project_type) {
      case "Tapstand":
        return 0;
        break;
      case "Source":
        return 1;
        break;
      case "Resevoir":
        return 2;
        break;
      case "Sediment Tank":
        return 3;
        break;
      case "Break Pressure Tank":
        return 4;
        break;
    }
  }
  giveProjType = (project_type) => {
    switch(project_type) {
      case 0:
        return "Tapstand";
        break;
      case 1:
        return "Source";
        break;
      case 2:
        return "Resevoir";
        break;
      case 3:
        return "Sediment Tank";
        break;
      case 4:
        return "Break Pressure Tank";
        break;
    }
  }

  handleSnack = (Transition, key) => () => {
    console.log("HANDINGL SNACK", key)
    this.setState({ [key]: true, Transition });
  };

  handleSuccessClose = () => {
    this.setState({ succesOpen: false });
  };
  handleErrorClose = () => {
    this.setState({ errorOpen: false });
  };

  handleAddPhotoClick = (photo) => {
    const { uploadedPhotos, photosToDelete } = this.state;
    const photoIndex = photosToDelete.indexOf(photo);
    if(photoIndex > -1) {
      photosToDelete.splice(photoIndex,1);
    }
    uploadedPhotos.push(photo);
    this.setState({uploadedPhotos, photosToDelete})
  }
  handleRemovePhotoClick = (photo) => {
    const { uploadedPhotos, photosToDelete } = this.state;
    const photoIndex = uploadedPhotos.indexOf(photo);
    if(photoIndex > -1) {
      uploadedPhotos.splice(photoIndex, 1);
    }
    photosToDelete.push(photo);
    this.setState({uploadedPhotos, photosToDelete})
  }

  handleDelete = () => {
    const { id } = this.props.match.params;
    db.collection("projects").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
        // this.setState({succesOpen: true})
    }).catch(function(error) {
        console.error("Error removing document: ", error);
        // this.setState({errorOpen: true})
    });
    this.props.history.push("/admin")
  }

  handleDialogClose = () => {
    console.log("CLOSING DIALOG");
    console.log(this);
    this.setState({deleteDialog: false});
  }

  render() {

    const { id } = this.props.match.params;
    const { editing, uploadedPhotos } = this.state;
    return(
      <div className="Project">
        <FirestoreDocument
          path={`projects/${id}`}
          render={({ isLoading, data }) => {
            return isLoading ? (
              <Grid container justify="center" alignItems='center'>
                  <CircularProgress color="secondary" />
                </Grid>
            ) : (
              <Grid container spacing={16}>
              { !editing ? 
                <Grid item xs={12}>
                  <Grid item xs={1}>
                    <Button variant="fab" aria-label="Back" style={{marginBottom: "20px"}} onClick={()=>this.props.history.push('/admin')}>
                      <ArrowBackIcon />
                    </Button>
                  </Grid>
                  <Grid item xs={11}>
                    <Paper className="project-paper">
                      <div className="project-page-header">
                        <h1>{data.name}</h1>
                        <Button variant="fab" color="secondary" aria-label="Edit"  onClick={(e)=>this.handleEdit(data)}>
                          <Icon>edit_icon</Icon>
                        </Button>
                        <Button variant="fab" style={{marginLeft: "5px"}} aria-label="Delete" onClick={()=>this.setState({deleteDialog:true})}>
                          <DeleteIcon />
                        </Button>
                        <Dialog
                          open={this.state.deleteDialog}
                          TransitionComponent={TransitionUp}
                          keepMounted
                          onClose={this.handleDialogClose}
                          aria-labelledby="alert-dialog-slide-title"
                          aria-describedby="alert-dialog-slide-description"
                        >
                          <DialogTitle id="alert-dialog-slide-title">
                            {"DELETE PROJECT"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                              Are you sure you want delete this project?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={this.handleDialogClose} color="primary">
                              Cancel
                            </Button>
                            <Button onClick={this.handleDelete} color="secondary">
                              Delete
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                      <p className="project-page-description">{data.description}</p>
                      <p><b>Project Type:</b> {data.project_type}</p>
                      <p><b>Location:</b> {data.location[0]}, {data.location[1]}</p>
                      <p><b>Population:</b> {data.population}</p>
                      <p><b>Completion Date:</b> {moment.unix(data.completion_date.seconds).local().format("LL")}</p>
                      {data.photos && <div className="project-photos">
                        <h2>PHOTOS</h2>
                        <div className="project-photos-container">
                          { data.photos.map(photo => {
                            return (
                              <div className= "project-photo-container">
                                <img className="project-photo" src={photo} width="200" height="200" />
                              </div>
                            )
                          })}
                        </div>
                      </div>}
                    </Paper>
                  </Grid>

                </Grid>
              :
              <Paper className="project-paper">
                <Grid container spacing={24}>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="standard-name"
                      label="Name"
                      name='name'
                      fullWidth
                      onChange={this.handleChange}
                      margin="normal"
                      value={this.state.formName}
                    />
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="standard-description"
                      label="Description"
                      fullWidth
                      multiline
                      name='description'
                      onChange={this.handleChange}
                      margin="normal"
                      value={this.state.formDescription}
                    />
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4}>
                  <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="project_type">Project Type</InputLabel>
                    <Select
                      value={this.state.formProjType}
                      onChange={this.handleChange}
                      name="project_type"
                      inputProps={{
                        name: 'project_type',
                        id: 'project_type',
                      }}
                    >
                      <MenuItem value={0}>Tapstand</MenuItem>
                      <MenuItem value={1}>Source</MenuItem>
                      <MenuItem value={2}>Resevoir</MenuItem>
                      <MenuItem value={3}>Sediment Tank</MenuItem>
                      <MenuItem value={4}>Break Pressure Tank</MenuItem>
                    </Select>
                  </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      id="standard-longitude"
                      label="Longitude"
                      name='longitude'
                      fullWidth
                      onChange={this.handleChange}
                      margin="normal"
                      value={this.state.formLon}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      id="standard-latitude"
                      label="Latitude"
                      name='latitude'
                      fullWidth
                      onChange={this.handleChange}
                      margin="normal"
                      value={this.state.formLat}
                    />
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="standard-population"
                      label="Population"
                      name='population'
                      fullWidth
                      onChange={this.handleChange}
                      margin="normal"
                      value={this.state.formPopulation}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="date"
                      label="Completion Date"
                      type="date"
                      onChange={this.handleChange}
                      defaultValue={this.state.formCompletionDate}
                      name="completion_date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2} >
                    <input
                      accept="image/*"
                      style={{display:"none"}}
                      id="contained-button-file"
                      onChange={this.handlePhotoChange}
                      name="photos"
                      multiple
                      type="file"
                    />
                    <label htmlFor="contained-button-file">
                      <Button variant="contained" component="span" >
                        <span style={{marginRight: "4px"}}>upload</span>  
                        <CloudUploadIcon />
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4}>
                    <Paper className="photos-to-upload" style={{backgroundColor: "rgb(127, 216, 188)"}}>
                      <h2>Photos to Upload</h2>
                      <span className="number-of-photos">{this.state.formPhotos.length}</span>
                    </Paper>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  {data.photos && 
                    <Grid item xs={8}>
                      <div className="project-photos">
                        <h2>PHOTOS</h2>
                        <div className="project-photos-container">
                          { data.photos.map(photo => {
                            if(uploadedPhotos.includes(photo)) {
                              return (
                                <div className="edit-project-photo-container" onClick={()=>this.handleRemovePhotoClick(photo)}>
                                  <img className="project-photo" src={photo} width="100" height="100" />
                                  <CheckIcon class="photo-check"/>
                                </div>
                              )
                            } else {
                              return (
                                <div className="edit-project-photo-container removed" onClick={()=>this.handleAddPhotoClick(photo)}>
                                  <img className="project-photo" src={photo} width="100" height="100" />
                                  <CancelIcon class="photo-removed"/>
                                </div>
                              )
                            }
                          })}
                        </div>
                      </div>
                    </Grid> 
                  }
                </Grid>
                <Grid container spacing={24} justify="flex-end" className="form-buttons">
                  <Grid item >
                    <Button variant="contained" color="secondary" onClick={()=>this.setState({editing: false})}>
                      <span style={{marginRight: "4px"}}>cancel</span>
                      <CancelIcon />
                    </Button>
                  </Grid>
                  <Grid item >
                    <Button variant="contained" color="primary" onClick={this.handleSave}>
                      <span style={{marginRight: "4px"}}>Save</span>
                      <SaveIcon />
                    </Button>
                  </Grid>
                  <Grid item  xs={2}></Grid>
                </Grid>
              </Paper>
              }
                <Snackbar
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  open={this.state.succesOpen}
                  onClose={this.handleSuccessClose}
                  TransitionComponent={this.state.Transition}
                  ContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                  message={<div className="snack-div"><CheckIcon style={{color: "#51e288"}}></CheckIcon><span id="message-id">Upload Successful!</span></div>}
                />
                <Snackbar
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  open={this.state.errorOpen}
                  onClose={this.handleErrorClose}
                  TransitionComponent={this.state.Transition}
                  ContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                  message={<div className="snack-div" ><ErrorIcon style={{color: "#e25151"}}></ErrorIcon><span id="message-id">Upload Error</span></div>}
                />
              </Grid>
            );
          }}
        />
      </div>
    );
  }
}
export default Project;