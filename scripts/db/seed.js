import {SeedModel} from '../../src/serverless/lib/db/seeds'

// add to this as needed
const SeedAll = async () => {
  await SeedModel('Author')
}

SeedAll()

