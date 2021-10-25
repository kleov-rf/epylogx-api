import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { dbConnection } from '../database/config'

class epyServer {
  public app: express.Application
  public port: string
  server: import('http').Server
  io: Server
  paths: {
    admins: string
    auth: string
    categories: string
    chats: string
    manager: string
    podcasts: string
    posts: string
    store: string
    users: string
  }

  constructor() {
    // First we create our express app with its port
    this.app = express()
    this.port = process.env.PORT ?? '8080'

    // Then we assign both our express and sockets servers in this.server
    // allowing them to stablish connections.
    this.server = createServer(this.app)
    this.io = require('socket.io')(this.server)

    // These are our api paths
    this.paths = {
      admins: '/api/admins',
      auth: '/api/auth',
      categories: '/api/categories',
      chats: '/api/chats',
      manager: '/api/manager',
      podcasts: '/api/podcasts',
      posts: '/api/posts',
      store: '/api/store',
      users: '/api/users',
    }

    // Connect to database
    this.connectToDB()

    // Middlewares
    this.middlewares()

    // Routes
    this.routes()
  }

  async connectToDB() {
    await dbConnection()
  }

  middlewares() {
    // CORS
    this.app.use(cors())

    // Read and body parsing
    this.app.use(express.json())

    // File upload settings
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    )
  }

  routes() {
    this.app.use(this.paths.admins, require('../routes/admins').default)
    this.app.use(this.paths.auth, require('../routes/auth').default)
    this.app.use(this.paths.categories, require('../routes/categories').default)
    this.app.use(this.paths.chats, require('../routes/chats').default)
    this.app.use(this.paths.manager, require('../routes/manager').default)
    this.app.use(this.paths.podcasts, require('../routes/podcasts').default)
    this.app.use(this.paths.posts, require('../routes/posts').default)
    this.app.use(this.paths.store, require('../routes/store').default)
    this.app.use(this.paths.users, require('../routes/users').default)
  }

  sockets() {}

  listen() {
    // We run our express-socket server and print
    // its link in console
    this.server.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`)
    })
  }
}

export default epyServer
