import { ECONNRESET } from "constants";
import { Router } from "mediasoup/node/lib/types";
import { json } from "stream/consumers";
import WebSocket from "ws"
import { createWorker } from "./worker";

let mediasoupRouter: Router;
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
        default:
            break;
}

        ws.send('Hi this my websocket application demo!!');
    })
})

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

}

export {WebscocketConnection}