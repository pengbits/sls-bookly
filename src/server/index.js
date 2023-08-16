import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
const port = 5000
import ErrorHandler from './middleware/error-handler'
import AuthorRoutes from './routes/authors.routes'
// import BookRoutes   from './routes/books.routes'
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use('/authors', AuthorRoutes())
app.get('/', (req, res) => res.json({
  success: true,
  name: 'bookly'
})) 

app.use(ErrorHandler)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))