import React from 'react'
import firebase from '../firebase'
import moment from 'moment'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {FirestoreCollection}  from "react-firestore";
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import AddIcon from '@material-ui/icons/Add';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Select from '@material-ui/core/Select';

class Admin extends React.Component {
  constructor() {
    super()

    this.state = {
      email: "",
      password: "",
      userEmail: false,
      dialog: false,
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
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        this.setState({userEmail: user.email})
        // console.log(user);
      } else {
        // No user is signed in.
        console.log("NO USER LOGGED IN")
      }
    }.bind(this));
  }
  
  handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      if(errorCode) {
        console.log(errorCode)
      }
      if(errorMessage) {
        console.log(errorMessage)
      }
    });
    this.setState({email:"", password:""})
  }

  handleSignout = () => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log("LOGOUT SUCCESS");
      this.setState({userEmail: false})
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    }.bind(this));
  }

  handleLoginChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { userEmail } = this.state;
    const { classes, count, page, rowsPerPage, theme } = this.props;
    return(
      <div className="Admin">
        { !userEmail ? <Grid container spacing={24} justify="center">
          <form className="login-form">
            <Paper className="login-paper">
              <Grid item xs={12}><h2>Login</h2></Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-email"
                  label="Email"
                  name="email"
                  value={this.state.email}
                  onChange={(e)=>this.handleLoginChange(e)}
                  style= {{ padding: "10px"}}
                />
              </Grid>
              <Grid item xs={12}>
              <TextField
                id="standard-pass"
                label="Password"
                type="password"
                value={this.state.password}
                onChange={(e)=>this.handleLoginChange(e)}
                name="password"
                style= {{ padding: "10px"}}
              />
              </Grid>
              <Button variant="contained" color="primary" onClick={this.handleLogin}>Login</Button>
            </Paper>
          </form>
        </Grid>
        :
        <div>
          <Grid container spacing={16} justify="flex-end">
            <Paper elevation={2} style={{marginRight:"5px"}}>
              <p style={{padding: "10px"}}>
                Signed in as: <b>{userEmail}</b>
              </p>
            </Paper>
            <Button variant="contained" color="secondary" onClick={this.handleSignout}>Signout</Button>
          </Grid>
          <Grid container spacing={16}>
          <FirestoreCollection
            path="projects"
            render={({ isLoading, data }) => {
              return isLoading ? (
                <Grid container justify="center" alignItems='center'>
                  <CircularProgress color="secondary" />
                </Grid>
              ) : (
                <div className="all-projects">
                  <div className="projects-header-container">
                    <h1 className="projects-header">Projects</h1>
                    <Link to={`/new`}>
                      <Button variant="fab" color="primary"  className='add-project' aria-label="Add" onClick={()=>this.setState({dialog:true})} >
                        <AddIcon />
                      </Button>
                    </Link>
                  </div>
                  <Paper justify='center'>
                    <Table >
                      <TableHead>
                        <TableRow>
                          <TableCell>Project ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Project Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Completion Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map(project => {
                          // console.log(project)
                          return (
                            <TableRow key={project.id} hover className='project-table-row' component={Link} to={`/projects/${project.id}`}>
                              <TableCell>
                                {project.id}
                              </TableCell>
                              <TableCell>{project.name}</TableCell>
                              <TableCell>{project.project_type}</TableCell>
                              <TableCell>{project.status}</TableCell>
                              <TableCell>{moment.unix(project.completion_date.seconds).local().format("LL")}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Paper>
                </div>
              );
            }}
          />
          </Grid>
        </div>
        }
      </div>
    );
  }
}
export default Admin;