import { ECONNRESET } from "constants";
import { Producer, Router, Transport } from "mediasoup/node/lib/types";
import { json } from "stream/consumers";
import WebSocket from "ws"
import { createWebRtcTransport } from "./createWebrtcTransport";
import { createWorker } from "./worker";

let mediasoupRouter: Router;
let producerTransport: Transport;
let producer: Producer;

const WebscocketConnection = async (websock: WebSocket.Server) => {

    try{
mediasoupRouter = await createWorker();
    }catch(error){
        throw error;
    }

    websock.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        console.log("message ->", message);

const jsonValidation = isJsonString(message);
if(!jsonValidation){
    console.log("json error");
    return;
}
const event = JSON.parse(message);
switch(event.type){
    case 'getRouterRtpCapabilities':
        onRouterRtpCapabilities(event,ws)
        break;
        case 'createProducerTransport':
            onCreateProducerTransport(event,ws);
            break;
        case 'connectProducerTransport':
            onConnectProducerTransport(event,ws);
        case 'produce':
            onProduce(event,ws, websock); 
        default:
            break;
}
        ws.send('Hi this my websocket application demo!!');
    })
});

const onProduce = async (event:any, ws:WebSocket, websocket: WebSocket.Server) => {
    const {kind, rtpParameters} = event;
    producer = await producerTransport.produce({kind, rtpParameters});
    const resp = {
        id: producer.id
    }
    send(ws,'produce', resp);
    broadcast(websocket, 'newProducer', 'new user');
}

const onConnectProducerTransport = async (event:any, ws:WebSocket) => {
    await producerTransport.connect({dtlsParameters: event.dtlsParameters});
    send(ws, 'producerConnected',' producer conneted!');
}
    const onCreateProducerTransport = async (event:string, ws:WebSocket) => {
    try {
        const { transport, params} = await createWebRtcTransport(mediasoupRouter);
        producerTransport = transport;
        send(ws,"producerTransportCreated", params);

    } catch (error) {
       console.log(error); 
       send(ws, "error", error);
    }
}


    const onRouterRtpCapabilities = (event :string, ws:WebSocket) => {
        send(ws, "routerCapabilities", mediasoupRouter.rtpCapabilities);
    };

    const isJsonString = (str:string) => {
        try{
            JSON.parse(str);
        }
        catch (error){
            return false;
        }
        return true;
    }

    const send = (ws:WebSocket, type: string, msg:any) => {
        const message = {
            type,
            data:msg
        }
        const resp = JSON.stringify(message);
        ws.send(resp);
    }

    const broadcast = (ws: WebSocket.Server, type: string, msg: any) => {
        const message = {
            type,
            data: msg
        }
        const resp = JSON.stringify(message);
        ws.clients.forEach((client) => {
            client.send(resp);
        })
    }

}

export {WebscocketConnection}