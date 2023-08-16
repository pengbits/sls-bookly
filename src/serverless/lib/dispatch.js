import {success,failure} from './responses'
import {getConnection} from './db'

export const dispatch = async (event, context, callback) => {
  try {
    const result = await callback(event)
    return success({
      success:true,
      ...result
    })
  }
  
  catch (error) {
    const client = await getConnection()
    client.close()
    
    return failure({ 
      error: error.message
    })
  }
}