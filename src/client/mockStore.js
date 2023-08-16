import promiseMiddleware from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'

const middlewares = [
  promiseMiddleware,
  thunk
]

const mockStore = configureStore(middlewares)
export default mockStore

// helpers
export const expectActions = (store, expected) => {
  const actions = store.getActions();
  expect(actions).toHaveLength(expected.length)
  expect(actions.map(a => a.type)).toEqual(expected);  
}

// return state by running actions through the reducer
export const resultingState = (store, reducer, state) => {
  return store.getActions().reduce((state, action) => {
   return reducer(state, action)
 }, state || {})
}

export const respondWithMockResponse = (moxios, response) => {
  moxios.wait(() => {
    moxios.requests.mostRecent().respondWith({
      status: 200,
      response
    });
  });
}

export const respondWithMockFailure = (moxios, response) => {
  moxios.wait(() => {
    moxios.requests.mostRecent().respondWith({
      status: 404,
      response: { message: 'problem' },
    });
  });
}
