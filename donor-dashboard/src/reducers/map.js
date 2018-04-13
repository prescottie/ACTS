import {PROJECTS_UPDATE, MARKER_UPDATE, MAP_UPDATE} from '../actions/map'


const initialState = {
  center: { lat: -0.390580, lng: 30.181807 },
  zoom: 8,
  projects: [],
  showingInfoWindow: false,
  activeMarker: {},
  selectedPlace: {},
}

export default (state = initialState, action = {}) => {
  switch(action.type){
    case PROJECTS_UPDATE:
      return {
        ...state,
        projects: action.projects,
      }
    case MARKER_UPDATE:
      return {
        ...state,
        activeMarker: action.marker,
        selectedPlace: action.props,
        showingInfoWindow: true,
      }
    case MAP_UPDATE:
      return {
        ...state,
        showingInfoWindow: false,
        activeMarker: null,
      }
    default: return state;
  }
};