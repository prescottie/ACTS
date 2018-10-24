import axios from 'axios';
import firebase from '../firebase';

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

export const deletePhotos =(urls) => async (dispatchEvent) => {
  const storage = firebase.storage();
  const storageRef = storage.ref();

  return Promise.all(urls.map(url => {
    const frontSplitUrl = url.split('/o/');
    const endSplitUrl = frontSplitUrl[1].split("?");
    const decodedURI = decodeURI(endSplitUrl[0]);
    console.log(decodedURI)
   const imageRef = storageRef.child(decodedURI);
   imageRef.delete().then(function() {
      // File deleted successfully
      console.log("DELETION SUCCESS");
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log("Error: ", error);
    });
  }))
}