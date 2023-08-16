// import handler from '../handler'
import {listAuthors,showAuthor} from './authors'
import {SeedModel} from '../lib/db/seeds'
import getAuthorsMock from '../../../mocks/get-authors.mock'

// beforeAll(async () => {
//   await SeedModel('Author').then(xhr => console.log('|authors| Seeded db with author data'))
// })

describe('serverless', () => {
  describe('authors.list', () => {
    test('there is a list of authors', async () => {
      // const response = await handler.list()
      // const json     = JSON.parse(response.body || {})
      // expect(json.success)
      // expect(json.authors.length).toBeGreaterThan(0)
      const {authors} = await listAuthors()
      expect(authors.length).toBeGreaterThan(0)
    })
  })
  
  describe('authors.get', () => {
    test('there are details for an author', async () => {
      const expectedAuthor = withExpectedAuthor()
      const pathParameters = {id: expectedAuthor._id}
      const {author} = await showAuthor({pathParameters})
      expect(author.vendorId ).toEqual(expectedAuthor.vendorId)
      expect(author.name ).toEqual(expectedAuthor.name)
    })
  })
})

const withExpectedAuthor = () => {
  const {authors} = getAuthorsMock
  const {length}  = authors
  const i = Math.floor(Math.random() * length)
  return authors[i]
}