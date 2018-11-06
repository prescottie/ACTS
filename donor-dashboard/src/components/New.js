import React from 'react'
import firebase from '../firebase'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Select from '@material-ui/core/Select';
import { Redirect } from 'react-router-dom';

var db = firebase.firestore();

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

class New extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      projects: 0,
      formName: "",
      formDescription: "",
      formProjType: null,
      formPopulation: "",
      formLon: "",
      formLat: "",
      formCompletionDate: "",
      formPhotos: [],
      formSponsorPhoto: false,
      formSponsor: "",
      formID: "",
      succesOpen: false,
      errorOpen: false,
      Transition: null,
    }
  }

  componentDidMount() {
    db.collection("projects").get().then(function(querySnapshot) {      
      this.setState({projects: querySnapshot.size}); 
    }.bind(this));
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
      case "sponsor":
        return this.setState({formSponsor: e.target.value})
        break;
    }
  }

  handlePhotoChange = (e) => {
    this.setState({formPhotos: this.state.formPhotos.concat(Array.from(e.target.files))})
  }

  handleSponsorPhotoChange = e => {
    const { formSponsorPhoto, photosToDelete } = this.state;
    if(typeof formSponsorPhoto === 'string') {
      photosToDelete.push(formSponsorPhoto);
    }
    this.setState({formSponsorPhoto: e.target.files[0], photosToDelete})
  }

  handleSave = () => {
    const { formName, formDescription, formPhotos, formCompletionDate, formLon, formLat, formPopulation, formProjType, formID, projects, photosToDelete, formSponsor, formSponsorPhoto} = this.state;
      const storage = firebase.storage();
      const storageRef = storage.ref();
      const photosArray = [];
      return Promise.all(formPhotos.map(function(file) {
        const projectImageRef = storageRef.child(`project-${projects + 1}-${file.name}`);
        return projectImageRef.put(file).then(function(snapshot) {
          projectImageRef.getDownloadURL().then(function(url) {
            photosArray.push(url);
          })
        })
      })).then(()=> {
        setTimeout(()=> {
          console.log(photosArray);
          db.collection("projects").doc(`${projects + 1}`).set({
            name: formName,
            description: formDescription,
            completion_date: new Date(formCompletionDate),
            location: [formLon, formLat],
            population: formPopulation,
            project_type: this.giveProjType(formProjType),
            sponsor: formSponsor,
            photos: photosArray.length ? photosArray : null
          }, {merge: true})
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
              })
              if(formSponsorPhoto) { 
                this.props.sendSponsorPhoto(`${projects + 1}`, formSponsorPhoto)
              }
              this.props.history.push(`/admin`)
          }.bind(this))
          .catch(function(error) {
              this.handleSnack(TransitionUp, "errorOpen");
              console.error("Error adding document: ", error);
          });
        }, 700)
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
  
  render() {
    return(
      <div className="New">
       <Paper className="project-paper">
          <Grid container spacing={24}>
            <Grid item xs={2}>
            <Button variant="fab" aria-label="Back" onClick={()=>this.props.history.push('/admin')}>
              <ArrowBackIcon />
            </Button>
            </Grid>
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
                  <Grid item xs={4}>
                    <TextField
                      id="standard-sponsor"
                      label="Sponsor"
                      fullWidth
                      name='sponsor'
                      onChange={this.handleChange}
                      margin="normal"
                      value={this.state.formSponsor}
                    />
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2} >
                    <input
                      accept="image/*"
                      style={{display:"none"}}
                      id="contained-button-file-2"
                      onChange={this.handleSponsorPhotoChange}
                      name="sponsor_photo"
                      type="file"
                    />
                    <label htmlFor="contained-button-file-2">
                      <Button variant="contained" component="span" >
                        <span style={{marginRight: "4px"}}>upload logo</span>  
                        <CloudUploadIcon />
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={2}></Grid>
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
      </div>
    );
  }
}
export default New;