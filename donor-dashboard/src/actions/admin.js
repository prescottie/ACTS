export const FORM_UPDATE = 'FORM_UPDATE';

export const formUpdate = (formValues) => {
  return {type: FORM_UPDATE, formValues}
}

export const changeForm = (e, currentPhotos) => async (dispatch) => {
  let formValues;
  switch(e.target.name) {
    case "name":
      return dispatch(formUpdate(["formName", e.target.value]))
      break;
    case "description":
      return dispatch(formUpdate(["formDescription", e.target.value]))
      break;
    case "project_type":
      return dispatch(formUpdate(["formProjType", e.target.value]))
      break;
    case "longitude":
      return dispatch(formUpdate(["formLon", e.target.value]))
      break;
    case "latitude":
      return dispatch(formUpdate(["formLat", e.target.value]))
      break;
    case "population":
      return dispatch(formUpdate(["formPopulation", e.target.value]))
      break;
    case "completion_date":
      return dispatch(formUpdate(["formCompletionDate", e.target.value]))
      break;
    case "photos":
      return dispatch(formUpdate(["formPhotos", currentPhotos.concat(Array.from(e.target.files))]))
      break;
  }
  // console.log(formValues)
  // dispatch(formUpdate(formValues));
  // try {
  //   const res = await axios.get(`http://localhost:3001/api/v1/projects/${id}`);
  //   console.log(res);
  //   dispatch(projectUpdate(res.data));
  // } catch (error) {
  //   console.error(error);
  // }
}

