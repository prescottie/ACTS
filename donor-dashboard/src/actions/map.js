import axios from 'axios';

export const PROJECTS_UPDATE = 'projects/UPDATE';

export const projectsUpdate = (projects) => {
  return {type: PROJECTS_UPDATE, projects}
}

export const fetchProjects = () => async (dispatch) => {
  try {
    const res = await axios.get('/projects.json');

    dispatch(projectsUpdate(res.data));
  } catch (error) {
    console.error(error);
  }
}