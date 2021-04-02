const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const IMG_DIR = path.join(__dirname,'public','images') 



const app = express()
const contactsRouter = require('./contacts/contacts.routes')
const authRouter = require('./auth/auth.routes')
const uploadRouter = require('./auth/upload.routes')
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
dotenv.config()



const runServer = async () => {
  try {
    // Connection to MongoDB
    await mongoose.connect(process.env.DB_URI, {
      promiseLibrary: global.Promise,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    console.log('Database connection is successful')

    app.use(logger(formatsLogger))
    app.use(cors())
    app.use(express.json())

    app.use(express.static(IMG_DIR));
    
    app.use('/auth', authRouter)
    app.use('/api/contacts', contactsRouter)
    app.use('/users',uploadRouter)

    app.use((req, res) => {
      res.status(404).json({ message: 'Contact is not found' })
    })

    app.use((err, req, res, next) => {
      res.status(500).json({ message: err.message })
    })
  } catch (err) {
    process.exit(1)
  }
}

runServer()

module.exports = app
