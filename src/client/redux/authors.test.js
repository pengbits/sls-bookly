import moxios from 'moxios'
import axios from 'axios'

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse } from  '../mockStore'
import getAuthorsMock from '../../../mocks/get-authors.mock'
import getAuthorMock  from '../../../mocks/get-author.mock'

// reducers
// reducers
import rootReducer from './index'
import { 
  getAuthors, GET_AUTHORS,
  getAuthor,  GET_AUTHOR
} from './authors'

let store,
  beforeState,
  afterState,
  expectedAuthor
;

beforeEach(function(){ 
  moxios.install()
  getInitialState()
})

afterEach(function(){ 
  moxios.uninstall() 
})

const getInitialState = () => {
  store = mockStore(rootReducer())
  beforeState = store.getState()
  afterState = undefined
}


describe('client', () => {
  describe('authors.list', () => {
    test('there is a list of authors', async () => {
      
      // given there are authors in the database
      expect(getAuthorsMock.authors.length).toBeGreaterThan(1)

      // when i render the author-list
      
      // then there will be a fetch to the server
      respondWithMockResponse(moxios, getAuthorsMock)
      afterState = await store.dispatch(getAuthors()).then(() => {
        return resultingState(store, rootReducer)
      })
      
      // when it loads
      expectActions(store, [
        `${GET_AUTHORS}_PENDING`,
        `${GET_AUTHORS}_FULFILLED`
      ])
      
      // then there will be authors in the list
      expect(afterState.authors.list.length).toBeGreaterThan(0)
    })
  })
  
  describe('authors.details', () => {
    test('there are details for an author', async ()  => {
      // given there are authors in the database
      // and there is a valid author id
      const expectedAuthor = {
        _id : getAuthorMock.author._id,
        name: "Esi Edugyan"
      }
      // when I render the author details
      // then there will be a fetch to the server
      respondWithMockResponse(moxios, getAuthorMock)
      afterState = await store.dispatch(getAuthor({id: expectedAuthor._id})).then(() => {
        return resultingState(store, rootReducer)
      })
      
      // when it loads
      expectActions(store, [
        `${GET_AUTHOR}_PENDING`,
        `${GET_AUTHOR}_FULFILLED`
      ])
      
      // then the view will be populated with some Author attributes', () => {
      expect(afterState.authors.loading).toBe(false)
      for(const k in expectedAuthor) {
        expect(afterState.authors.details[k]).toEqual(expectedAuthor[k])
      }
    })
  })
})