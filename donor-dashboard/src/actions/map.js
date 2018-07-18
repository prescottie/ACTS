import axios from 'axios';

export const PROJECTS_UPDATE = 'PROJECTS_UPDATE';
export const MARKER_UPDATE = 'MARKER_UPDATE';
export const MAP_UPDATE = 'MAP_UPDATE';

export const markerUpdate = (props, marker) => {
  return {type: MARKER_UPDATE, props, marker }
}

export const mapUpdate = (props) => {
  return {type: MAP_UPDATE}
}

export const projectsUpdate = (projects) => {
  return {type: PROJECTS_UPDATE, projects}
}

export const onMarkerClick = (props,marker) => async (dispatch) => {
  dispatch(markerUpdate(props,marker));
}

export const onMapClicked = (props) => async (dispatch) => {
  // console.log(props.showingInfoWindow)
  if(props.showingInfoWindow) {
    dispatch(mapUpdate(props));
  }
}


export const fetchProjects = () => async (dispatch) => {
  try {
    const res = await axios.get('http://localhost:3001/api/v1/projects');
    // console.log(res);
    dispatch(projectsUpdate(res.data));
  } catch (error) {
    console.error(error);
  }
}
