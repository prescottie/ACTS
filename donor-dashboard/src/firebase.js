import firebase from 'firebase';
const config = {
  apiKey: "AIzaSyDKE67gyXHioqDq1w_vWnn-sZLzCIeYaPE",
  authDomain: "donor-dashboard-1523321520302.firebaseapp.com",
  databaseURL: "https://donor-dashboard-1523321520302.firebaseio.com",
  projectId: "donor-dashboard-1523321520302",
  storageBucket: "donor-dashboard-1523321520302.appspot.com",
  messagingSenderId: "279127597310"
};
firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true
});
export default firebase;