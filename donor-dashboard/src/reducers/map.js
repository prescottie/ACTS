import {PROJECTS_UPDATE, MARKER_UPDATE, MAP_UPDATE} from '../actions/map'


const initialState = {
  center:  [30.181807,-0.390580],
  zoom: 8,
  projects: [],
  width: window.innerWidth,
  height: window.innerHeight,
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