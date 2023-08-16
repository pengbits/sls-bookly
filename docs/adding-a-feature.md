# Adding a Feature

[home](../README.md)

## introduction
Adding a feature to the application could mean any number of things, but for our purposes lets assume we are talking about a new endpoint, one that would be handled by a new lambda in the aws enviroment.There are only two endpoints in Bookly at the moment, one for fetching an Author's details and one for returning the full list of Authors. How about a way to add a new author to the database?

_note: if you'd rather not follow this tutorial, there's a branch with the CREATE implemented at `feature/try-POST-authors`_

It's very tempting to just start whacking away at our server code, but let's think about our approach for a minute. Perhaps we can take the time to spec out the feature first, by sketching some tests that describe the desired behavior. 

_Note: while i'm a big fan of TDD or Test-Driven-Development, I stopped short of introducing the [Jest plugins](https://github.com/bencompton/jest-cucumber) that allow for [cucumber](https://cucumber.io/docs/gherkin/)-style testing in this project, although we could always do so in the future. Since this is just regular Jest, writing a 'feature' is a little loose. Without cucumber's  `Given / When / Then` constructs being first-class citizens, it's up to the author to group the tests into a structure that makes sense - for some examples look at the author tests in `src/client/redux` and `src/serverless/handlers`_


## Getting Started with Tests
Where to begin? Tests are stored next to the application code that they are asserting against. There are tests for the backend in `src/serverless/handlers` and for the client in `src/client/redux`. I tend to focus on the redux layer when writing front-end tests, because with redux being the _source of all truth_, I feel it gives you the most bang for your buck... but there are many schools of thought around testing and if you want to write tests against other areas of the application, you can add tests in `src/client/components` or anywhere else you see fit.

Let's start with the back-end. That way we'll know the endpoint that supports the new functionality will be up and running for the client to consume before we even touch any front-end code.

Navigate to `src/serverless/handlers` and look at `authors.js` and `authors.test.js`. There are only two tests there at the moment, one for each endpoint:

```
describe('serverless', () => {
  describe('authors.list', () => {
    ...
  })
  
  describe('authors.get', () => {
    ...
  })
})
```

Let's add a new test for our (as yet unwritten) create method, under the other two `describe` blocks:

```
//in `src/serverless/handlers/authors.test.js`

  describe('authors.create', () => {
    test('create an author', async() => {
      const response = await createAuthor({
        "name"  : "Ottessa Moshfegh",
        "about" : "Ottessa Moshfegh is a fiction writer from New England. Her first book, McGlue, a novella, won the Fence Modern Prize in Prose and the Believer Book Award...",
        "vendorId" : "3276202"
      })
    })
  })
```

For convenience's sake, I have just defined the atrributes inline, but we would probably want this assigned to a variable or loaded from a mock file, or both. However, it does happen to be legit data from [goodreads.com](http://www.goodreads.com) - the vendorId is a goodreads id and I scraped the bio from https://www.goodreads.com/author/show/3276202.Ottessa_Moshfegh. All of the authors in the database/mocks have corresponding entries on goodreads, which is the source of the data.

Let's hop over to the terminal and run the test. _Hint: you can use Jest's options to filter by filename or testname, quite handy when you want to jump to the area you're working on_

```
$ npm run test

FAIL  src/serverless/handlers/authors.test.js
 serverless
   authors.list
     ✓ there is a list of authors (166ms)
   authors.get
     ✓ there are details for an author (7ms)
   authors.create
     ✕ create an author (1ms)

 ● serverless › authors.create › create an author

   ReferenceError: createAuthor is not defined

```

The tests failed! and of course they did, as we added a reference to a method that doesn't exist yet. Let's whip that `createAuthor` into shape. Open up the handler code at `src/serverless/handlers/authors.js`

##Writing the new Handler code 

```
export const listAuthors = async (event, context) => {
  const authors = await connectAndExecute(() => AuthorModel.find({}))
  return {authors}
}

export const showAuthor = async (event, context) => {
  const {id}   = event.pathParameters
  const author = await connectAndExecute(() => AuthorModel.findById(id))
  return {author}
}
```

Here we have two async functions, which aren't much more than wrappers around the mongoose model calls. Adding a create should be easy enough. One problem is that I can't remember where the form data or json that the POST sends over would get stored in the event object. (For example, look at how the id from the url gets send as `event.pathParameters` for the showAuthor case). Fear not, plenty of great examples out there, let's check out the [rest api mongodb example](https://github.com/serverless/examples/blob/master/aws-node-rest-api-mongodb/handler.js) on the serverless repo...

```
// in https://github.com/serverless/examples/blob/master/aws-node-rest-api-mongodb/handler.js
module.exports.createUser = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const user = new UserModel({
    name: data.name,
    firstname: data.firstname,
    ...
  })
}
```
    
Aha! `event.body`. that makes a lot of sense. Let's try adding a function that expects `event.body` to contain author attributes, and uses them to populate a new mongoose model:

```
//in src/serverless/authors.js
export const createAuthor = async (event, context) => {
  const attrs    = event.body || {}
  const model    = new AuthorModel(attrs)
  const response = await connectAndExecute(() => model.save())
  return {success:true, id:model.id} 
}

# and in src/authors.test.js
import {listAuthors,showAuthor,createAuthor} from './authors'
```

hit save and jest should re-run our tests

```

  ● serverless › authors.create › create an author

    ValidationError: Author validation failed: vendorId: Path `vendorId` is required., name: Path `name` is required.

```

## Getting Tests to Pass

Looks like the attributes aren't being sent over in the right shape, as we neglected to tuck them into a `body` key in the call to createAuthor. Let's make that change now...

```
const response = await createAuthor({
  "body" : {
    "name"  : "Ottessa Moshfegh",
    "about" : "Ottessa Moshfegh is a ....",
    "vendorId" : "3276202"
  }
})
```

... and re-run tests.

```
$ // no output
```

hmm tests passed but we don't really know if anything happened -  because we don't have any assertions yet! Let's add an assertion around what we expect to get back from the server after a successful CREATE. If you look at our handler code you can see we're providing a `success` boolean and the `id` of the newly created record itself in the response. These properties are easy enough to assert against with two `expect` statements:

```
//in src/authors.test.js
describe('authors.create', () => {
  test('create an author', async() => {
    const response = await createAuthor({
      "body" : {
        "name"  : "Ottessa Moshfegh",
        "about" : "Ottessa Moshfegh is a fiction writer from New England. Her first book, McGlue, a novella, won the Fence Modern Prize in Prose and the Believer Book Award...",
        "vendorId" : "3276202"
      }
    })
    expect(response.success).toBe(true)
    expect(response.id).not.toBe(undefined)
  })
})

```
Now, hit save and jest should re-run the test in the terminal:

```
PASS  src/serverless/handlers/authors.test.js
 serverless
   authors.list
     ✓ there is a list of authors (88ms)
   authors.get
     ✓ there are details for an author (8ms)
   authors.create
     ✓ create an author (15ms)

```

Nice!. We can also open a browser and look at the list of authors at http://localhost:5000/authors and see if our entry appears there. _Spoiler Alert: it does!_

However, testing our handler code is just the begining - we still have to connect the handler to the express server and chuck some actual JSON at it.

TODO - should we extend our test coverage to the controller/server responses themselves, rather than just the models?

## Wiring the Handler to the Express Controller

```
//in src/server/controllers/authors.controller.js

const list = async (req,res) => {
  const authors = await listAuthors()
  respondWith(res, authors)
} 

const get = async (req,res,next) => {
  const author = await showAuthor({pathParameters:req.params})
  respondWith(res, author)
}

```
once again, two async functions, and the bottom, some kind of convenience method that wraps them up before exporting: 

```
const dispatch = (method) => (res,req,next) => {
  method(res,req).catch(e => {
    console.log('error!')
    next(e)
  })
}

export default {
  list    : dispatch(list),
  get     : dispatch(get)
}
```

let's add a create endpoint

```
const create = async (req,res,next) => {
  const json = JSON.parse(req.body)
  console.log(json)
  const author = await createAuthor({body: json})
  respondWith(res, author)
}
```

and at the bottom, add the create() to the exported object:

```
export default {
  list    : dispatch(list),
  get     : dispatch(get),
  create  : dispatch(create)
}
```

and, now add the route in `src/serverless/routes/authors.routes.js`

```
import { Router } from 'express'
import controller from '../controllers/authors.controller'

export default () => {
  const api = Router();
  
  api.get('/'   ,     controller.list)
  api.get('/:id',     controller.get)
  // added this one
  api.post('/',       controller.create)
  
  return api
}
```

we should now be all set up to accept POSTS on the express server. fire up [postman](https://www.postman.com/) or [httpie](https://httpie.org/) and give it a go:

```
// just using a  phony vendorId that it distinct enough to jump out us when we eyeball the list...
$ echo '{"name"  : "Ottessa Moshfegh", "vendorId" : "555555"}' > tmp-create.json
$ http POST :5000/authors < tmp-create.json 

```

if you post the sample data with httpie, you should see something like this happy response in the terminal:

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 48
Content-Type: application/json; charset=utf-8
Date: Tue, 26 May 2020 14:05:50 GMT
ETag: W/"30-U+r90dYL1kb5DrhnWVdAHetTYD0"
X-Powered-By: Express

{
    "id": "5ecd223edd08ae12b8633a9f",
    "success": true
}
```


hop over and inspect the output at http://localhost:5000/authors, and you should see the addition in the list of authors with vendorId 555555! 

As mentioned, the express server is just an added convenience for working on the front-end. we still need to connect this handler code to the aws side of things in order for it be made available as a new lambda.

## adding the aws lambda for the feature
Open serverless.yml in your editor. There are two entries in the `functions` section; let's add a third. 

```
functions:
  list-authors:
    handler: 'handler.list'
    events:
      - http:
          path: authors
          method: get

  show-author:
    handler: 'handler.show'
    events:
      - http:
          path: "authors/{id}"
          method: get

```
under the show-author block, add the following:

```
  create-author:
    handler: 'handler.create'
    events:
      - http:
        path: authors
        method: post
```

Testing in the serverless context is primarly handled via `invoke-local` - which you can run in the command-line. However, instead of simply running the command right in the terminal, we have a pattern in place where each function to be invoked is saved in `scripts/invoke` as an executable file, with a companion json containing the mock event to pass as the argument to `invoke-local`:

```
// in scripts/invoke/show-author.json
{
  "pathParameters": {
    "id":"5d011be852235a8810e48dea"
  }
}
// in scripts/invoke/show-author.sh

method="show-author"

...

serverless invoke local $param \
  -p $filename \
  -e STAGE=local \
  -e EXECUTION_CONTEXT=lambda
```

_curious about the EXECUTION_CONTEXT flag? it's a workaround for the fact that the database connection should be closed when running in the aws context, but left open for a zippy express server context_

let's add a script to invoke our (still-nonexistent) create-author handler

```
$ cd scripts/invoke
$ cp create-author.sh && touch create-author.json
$ echo {} > create-author.json
$ chmod +x create-author.sh
```

Go ahead and edit create-author.sh so that it contains the command to `invoke-local`, using the other files for reference (if you copy and paste the contents of `show-author.sh`, you should just need to change the name of the `$method` variable to `create-author` in order to get it working). 

Now, 
`create-author.json`  really should contain some valid author attributes as a `body` key (the POST payload), but for now let's just leave an empty object w/ no children or attributes of any kind. _the `echo {} > ..`` command above does exactly this_
Don't forget to chmod +x so the script can be run from command-line. Let's hop over to the package.json and add our new invoke-local to the list of scripts:

```
// in package.json
"scripts": {
  "build": "sls webpack",
  "mongo": "mongod --config /usr/local/etc/mongod.conf",
  "invoke-list-authors":  "./scripts/invoke/list-authors.sh",
  "invoke-show-author":   "./scripts/invoke/show-author.sh"
  ,
  "invoke-create-author": "./scripts/invoke/create-author.sh"
```

Save package.json and jump back to the terminal, and cd up to the top level of the project so we can try it out.

```
$ cd ../..
$ npm run invoke-create-author

> sls-bookly@1.0.0 invoke-create-author /Users/dave/code/serverless/sls-bookly
> ./scripts/invoke/create-author.sh

Serverless: DOTENV: Loading environment variables from .env:
Serverless: Invoke webpack:validate
Serverless: Invoke webpack:compile
Serverless: Bundling with Webpack...
Time: 5460ms
Built at: 2020-05-26 21:11:30
         Asset      Size   Chunks                   Chunk Names
    handler.js  22.3 KiB  handler  [emitted]        handler
handler.js.map  13.9 KiB  handler  [emitted] [dev]  handler
...
  Type Error ---------------------------------------------
 
  TypeError: lambda is not a function
      at resolve (/Users/dave/.nvm/versions/node/v8.11.3/lib/node_modules/serverless/lib/plugins/aws/invokeLocal/index.js:785:30)
      at Promise._execute (/Users/dave/.nvm/versions/node/v8.11.3/lib/node_modules/serverless/node_modules/bluebird/js/release/debugga
```

Doh! we added the function to the `serverless.yml`, but we haven't actually updated the handler file itself. we need to add the create method and expose it in the list of exports.

``` 
// in handler.js
/// handlers are stored with lib code and models inside src/server
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

```

looks simple enough. let's add createAuthor to list of imports, define the function to wrap it with `dispatch`, and export it as `create`:

```
// handlers are stored with lib code and models inside src/server
import {
  listAuthors,
  showAuthor,
  createAuthor
} from './src/serverless/handlers/authors'

//...

export const list   = ((event, context) => dispatch(event, context, listAuthors))
export const show   = ((event, context) => dispatch(event, context, showAuthor))
export const create = ((event, context) => dispatch(event, context, createAuthor))

export default {
  list,
  show,
  create
}
```

and now back to the terminal to run the invoke:

```
Daves-MacBook-Air [feature/try-POST-authors] sls-bookly $ ./scripts/invoke/create-author.sh 
Serverless: DOTENV: Loading environment variables from .env:
:
:
[mongoose] external "mongoose" 42 bytes {handler} [built]
|db| db.getConnection: connecting to mongo....
|db| db.getConnection: Success! mongo client received
{
    "statusCode": 500,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    "body": "{\"error\":\"Author validation failed: vendorId: Path `vendorId` is required., name: Path `name` is required.\"}"
}

```
Okay, now we're getting a 500 error. Where I come from, we call that progress! Looks like the error is due to the nonexistent vendorId. This is probably a good time to flesh out that json we're sending over.

The lambda handler is expecting the POST payload to arrive in the event as regular json, so writing the mock data is pretty simple. We could take the same attributes from the tests we wrote in the Express context, but why not give a different author some shine?

```
// in scripts/invoke/create-author.json`
{
  "body" : {
    "name" : "Emma Straub",
    "vendorId" : "1983563",
    "about" : "Emma Straub is the New York Times‒bestselling author of the novels All Adults Here, Modern Lovers, The Vacationers, Laura Lamont's Life in Pictures, and the short story collection Other People We Married. Straub's work has been published in twenty countries, and she and her husband own Books Are Magic, an independent bookstore in Brooklyn, New York."
  }
}
```

That ought to do it. Hit save and run the npm script again, and we should get a happy response from the server:

```
Daves-MacBook-Air [feature/try-POST-authors] sls-bookly $ npm run invoke-create-author

> sls-bookly@1.0.0 invoke-create-author /Users/dave/code/serverless/sls-bookly
> ./scripts/invoke/create-author.sh

Serverless: DOTENV: Loading environment variables from .env:
...
[mongoose] external "mongoose" 42 bytes {handler} [built]
|db| db.getConnection: connecting to mongo....
|db| db.getConnection: Success! mongo client received
{
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    "body": "{\"success\":true,\"id\":\"5ece9ffed3f8611c0bc067c5\"}"
}
```

Outstanding! Of course, this is going to add this same author every time we run the script, and eventually our collection will be filled with duplicates. But we can always run `db:seed` to restore the db to a pristine condition.

View the complete implementation at `feature/try-POST-authors`

## Next Steps
- how about moving the dummy author data used in the tests in the express server create to an external file in `/src/mocks`?
- add the UPDATE author and DELETE author endpoints?

[home](../README.md)