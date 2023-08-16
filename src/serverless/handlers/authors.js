'use strict';

import mongoose from 'mongoose'
import { success,failure } from "../lib/responses"
import AuthorModel from '../models/Author.js'
import { getConnection, connectAndExecute } from '../lib/db'

export const listAuthors = async (event, context) => {
  const authors = await connectAndExecute(() => AuthorModel.find({}))
  return {authors}
}

export const showAuthor = async (event, context) => {
  const {id}   = event.pathParameters
  const author = await connectAndExecute(() => AuthorModel.findById(id))
  return {author}
}
