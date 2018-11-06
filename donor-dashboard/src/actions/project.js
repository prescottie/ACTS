import axios from 'axios';
import firebase from '../firebase';

const storage = firebase.storage();
const storageRef = storage.ref();
const db = firebase.firestore();

export const PROJECTS_UPDATE = 'PROJECTS_UPDATE';

export const projectUpdate = (project) => {
  return {type: PROJECTS_UPDATE, project};
};

export const fetchProject = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`http://localhost:3001/api/v1/projects/${id}`);
    console.log(res);
    dispatch(projectUpdate(res.data));
  } catch (error) {
    console.error(error);
  }
};

export const deletePhotos =(urls) => async (dispatchEvent) => {
  return Promise.all(urls.map((url) => {
    const frontSplitUrl = url.split('/o/');
    const endSplitUrl = frontSplitUrl[1].split('?');
    const decodedURI = decodeURI(endSplitUrl[0]);
    const imageRef = storageRef.child(decodedURI);
    imageRef.delete().then(function() {
      // File deleted successfully
      console.log('DELETION SUCCESS');
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log('Error: ', error);
    });
  }));
};

export const sendSponsorPhoto = (projectID, photo) => async (dispatchEvent) => {
  console.log('SENDING PHOTO TO: ', projectID);
  const sponsorPhotoRef = storageRef.child(`project-${projectID}-sponsor-${photo.name}`);
  sponsorPhotoRef.put(photo).then(function(snapshot) {
    sponsorPhotoRef.getDownloadURL().then(function(url) {
      db.collection('projects').doc(projectID).set({
        sponsor_photo: url,
      }, {merge: true});
    });
  });
};
