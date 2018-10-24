import {FORM_UPDATE} from '../actions/admin'

const initialState = {
  formName: "",
  formDescription: "",
  formProjType: null,
  formPopulation: "",
  formLon: "",
  formLat: "",
  formCompletionDate: "",
  formPhotos: [],
}

export default (state = initialState, action = {}) => {
  console.log(action.formValues)
  switch(action.type){
    case FORM_UPDATE:
      return {
        ...state,
        [action.formValues[0]]: action.formValues[1],
      }
    
    default: return state;
  }
};