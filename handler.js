// handlers are stored with lib code and models inside src/server
import {
  listAuthors,
  showAuthor
} from './src/serverless/handlers/authors'

// dispatch wraps the handlers in boilerplate try/fail and triumphant json,
// convenient for the serverless use-case, but for testing, 
// we can just import the handler functions and assert against them directly...
import {
  dispatch
} from './src/serverless/lib/dispatch'


// these should be namespaced under 'authors' somehow
export const list = ((event, context) => dispatch(event, context, listAuthors))
export const show = ((event, context) => dispatch(event, context, showAuthor))

export default {
  list,
  show
}