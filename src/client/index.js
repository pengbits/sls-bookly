import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

import ReactDOM from "react-dom";

//redux
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'

// redux-async
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware'

// app:redux
import rootReducer from './redux'
import './styles/index.scss'

// app:middleware

// app:components
import Nav from './components/Nav'
import AuthorList from './containers/AuthorListContainer'
import AuthorDetails from './containers/AuthorDetailsContainer'

const k = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
const opts = {'name':'Bookly','actionsBlacklist' : ['@@redux-form']} //['@@router/LOCATION_CHANGE','@@redux-form']} // these get noisy
const composeEnhancers = window[k] ? window[k](opts) : compose;

const initialState = rootReducer()
const store = createStore(
  rootReducer, 
  initialState, 
  composeEnhancers(
    applyMiddleware(
      promiseMiddleware,
      thunk
    )
  )
)


const AuthorDetailsWithParams = function(){
  const {id} = useParams();
  return <AuthorDetails id={id} />
}

const el = document.getElementById("container");
el ? ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <h1>Bookly</h1>
        <Nav />
      </div>
      <Switch>
        <Route path="/authors/:id">
          <AuthorDetailsWithParams />
        </Route>
        <Route path="/authors">
          <AuthorList />
        </Route>
      </Switch>
    </Router>
  </Provider>, 
  el
) : false;