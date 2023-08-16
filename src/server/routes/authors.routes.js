import { Router } from 'express'
import controller from '../controllers/authors.controller'

export default () => {
  const api = Router();
  
  api.get('/'   ,     controller.list)
  api.get('/:id',     controller.get)
  
  return api
}