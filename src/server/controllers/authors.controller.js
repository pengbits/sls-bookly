import { Router } from 'express'
import {listAuthors, showAuthor} from '../../serverless/handlers/authors'

// actions
// ----------------------------------------------------------------------------
const list = async (req,res) => {
  const authors = await listAuthors()
  respondWith(res, authors)
} 

const get = async (req,res,next) => {
  const author = await showAuthor({pathParameters:req.params})
  respondWith(res, author)
}


// helpers
// ----------------------------------------------------------------------------
const respondWith = (res, payload) => {
  res.status(200)
  .json({
    success:true, 
    ...payload
  })
}

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