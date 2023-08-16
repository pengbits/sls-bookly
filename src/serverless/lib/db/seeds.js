import {connectAndExecute} from '../db'
import Author from '../../models/Author'
import GetAuthorsMock from '../../../../mocks/get-authors.mock'


// mandatory naming-conventions in use:
// key 'MyModel' - capitalized name
// GetMyModelMock - mock request response
// GetMyModelMock.mymodel - array of model attrs/payload
// 

const seedable_models = {
  Author
}

const seedable_mocks = {
  'Author': GetAuthorsMock.authors
}

export const SeedModel = async (key) => {
  const model = seedable_models[key]
  if(!model) throw new Error('couldn\'t seed '+key)
  console.log(`|seeds| SeedModel(${key})`)
  const {modelName}   = model
  const instanceName  = modelName.toLowerCase()
  
  
  const fixtures = (seedable_mocks[key] || []).map((item) => {
    const {_id,__v, ...attrs} = item
    return item
  })

  return await connectAndExecute(() => {
    return model.deleteMany({})
      .then(() => {
        console.log(`|seeds| deleted all ${instanceName}s from db...`)
        console.log(`|seeds| loading ${fixtures.length} ${instanceName}s into db...`)
      })
      .then(() => {
        return model.insertMany(fixtures)
      })
  })
}