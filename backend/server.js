
import "dotenv/config";
// dotenv.config();

import { createServer } from 'http';
// const app = require('./app');
import app from './app.js'
import { Server } from 'socket.io';
import { startWeeklyMoviesCron } from "./src/jobs/weeklymovies.job.js";


const port = process.env.PORT || 3001;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",     // dev stage 
    methods: ['GET', 'POST'],
  },
});


global.io = io;
startWeeklyMoviesCron();
// socket init
// initSocket(io);

server.listen(port, () => {
  console.log(`server is running on port ${port}`);

  
});
