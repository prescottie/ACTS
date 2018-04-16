import axios from 'axios';

export const PROJECTS_UPDATE = 'PROJECTS_UPDATE';

export const projectUpdate = (project) => {
  return {type: PROJECTS_UPDATE, project}
}

export const fetchProject = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`http://localhost:3001/api/v1/projects/${id}`);
    console.log(res);
    dispatch(projectUpdate(res.data));
  } catch (error) {
    console.error(error);
  }
}