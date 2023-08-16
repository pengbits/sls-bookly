const {config} = require('dotenv'); config()
const mongoose = require('mongoose');
const Promise  = require('bluebird')
mongoose.Promise = Promise;

const mongoUrlString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/bookly`;



let cachedClient = null

export const getConnection = async () => {
  return cachedClient ? Promise.resolve(cachedClient) : 
    new Promise((resolve, reject) => {
      console.log('|db| db.getConnection: connecting to mongo....')
      mongoose.connect(mongoUrlString, {useNewUrlParser: true, useUnifiedTopology:true }) // supress warning in jest
      const db = mongoose.connection
      
      db.on('error', (error) => {
        console.log("|db| ERROR\n" + JSON.stringify(error, null, 2))
        reject(error);
        return
      })
      
      db.once('open', async() => {
        console.log('|db| db.getConnection: Success! mongo client received')
        cachedClient = {
          db: () => mongoose.connection.db,
          close: () => mongoose.connection.close()
        }
        
        resolve(cachedClient)
      })
    })
}

export const connectAndExecute = async (fn) => {
  const client = await getConnection()
  const result = await fn() 
  await conditionalCloseConnection(client)
  return result
}

const conditionalCloseConnection = async (client) => {
  // we need to immediately close the db in the lambda context,
  // or the command will never signal completion and it'll just hang in local invocations,
  // but in the express server (used in development context) this makes for punishingly slow response times
  // so we check the environment to see if we need to close the connection or not...
  // console.log(`db.conditionalClose: EXECUTION_CONTEXT=${process.env.EXECUTION_CONTEXT}`);
  if( process.env.EXECUTION_CONTEXT == 'express'){
    return new Promise(resolve => resolve())
  } else {
    return await client.close()
  }
}