
import express from 'express';
import *as http from 'http';
import * as Websocket from 'ws';
import { WebscocketConnection } from './lib/ws';


const main = async () => {
const app = express();
const server = http.createServer(app);
const websocket = new Websocket.Server({server, path: '/ws'});

WebscocketConnection(websocket);

const port = 8000;


server.listen(port, () => {
    console.log('Server started on port 8000');
})
}

export {main}