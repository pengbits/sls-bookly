import axios from 'axios'
// constants
export const GET_AUTHORS = 'authors/GET_AUTHORS'
export const GET_AUTHOR  = 'authors/GET_AUTHOR'

// action creators
// hard-coded port 5000 for local dev env, but this should really
// be passed into state from the env variables we are setting for other purposes
export const getAuthors = () => {
  return {
    type: GET_AUTHORS,
    payload: axios.get(`http://localhost:5000/authors`)
      .then(xhr => xhr.data.authors)
      .catch(e => {
        throw new Error(e)
      })
  }
}

export const getAuthor = ({id}) => {
  return {
    type: GET_AUTHOR,
    payload: axios.get(`http://localhost:5000/authors/${id}`)
      .then(xhr => xhr.data.author)
  }
}

// reducers
const initialState = {
  loading: false,
  list:[],
  details:{}
}


export const authors = (state=initialState, action={}) => {
  
  switch(action.type){
    case `${GET_AUTHORS}_FULFILLED`:
      return {
        ...state,
        list: action.payload.slice(0)
      }
    
    case `${GET_AUTHOR}_FULFILLED`:
      return {
        ...state,
        details: {...action.payload}
      }
  
    default:
      return state
  }
}    

export default authors