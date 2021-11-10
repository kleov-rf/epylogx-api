// First we call dotenv to make use of it
require('dotenv').config()

import { Server } from "./models"

// We create new instance of our model epyServer
const server = new Server()

// Then we execute our server and make it
// listen to its port.
server.listen()