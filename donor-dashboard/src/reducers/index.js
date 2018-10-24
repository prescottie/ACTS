import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import counter from './counter'
import map from './map'
import admin from './admin'

export default combineReducers({
  routing: routerReducer,
  counter,
  map,
  admin
})