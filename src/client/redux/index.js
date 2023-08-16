import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import { authors } from './authors'
import { environment } from './environment'

const rootReducer = combineReducers({
  authors,
  environment
})


export default rootReducer