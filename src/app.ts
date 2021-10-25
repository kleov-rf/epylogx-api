// First we call dotenv to make use of it
require('dotenv').config()

import epyServer from "./models/server"

// We create new instance of our model epyServer
const server = new epyServer()

// Then we execute our server and make it
// listen to its port.
server.listen()