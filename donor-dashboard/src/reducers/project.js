import {PROJECT_UPDATE} from '../actions/project'


const initialState = {
  project: {},
}

export default (state = initialState, action = {}) => {
  switch(action.type){
    case PROJECT_UPDATE:
    return {
      ...state,
      project: action.project,
    }
    default: return state;
  }
};