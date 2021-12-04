import { RtpCodecCapability } from 'mediasoup/node/lib/RtpParameters';
import { TransportListenIp } from 'mediasoup/node/lib/Transport';
import { WorkerLogTag } from 'mediasoup/node/lib/Worker';
import  os from 'os';

export const config = {
    listenIp: '0.0.0.0',
    listenPort: 3016,

    mediasoup: {
        numWorkers: Object.keys(os.cpus()).length,
        worker: {
            rtcMinPort: 10000,
            rtcMaxPort: 10100,
            logLevel: 'debug',
            logTags: [
                'info',
                'ice',
                'dlts',
                'rtp',
                'srtp',
                'rtcp',
            ] as WorkerLogTag[],
        },
        router: {
            mediaCodes:[
                {
                    kind:'audio',
                    mimType: 'audio/opus',
                    clockRate: 48000,
                    channela: 2
                },
                {
                    kind:'video',
                    mimeType: 'video/VP8',
                    clockRate: 90000,
                    parameters: {
                        'x-google-start-bitrate': 1000
                    }
                },
            ] as RtpCodecCapability[]
        },
        //web rtc transport settings
        webRtcTransport: {
            listenIps:[
                {
                    ip: '0.0.0.0',
                    announcedIp:'127.0.0.1'
                },
            ] as TransportListenIp[],
            maxIncomeBitrate:150000,
            initialAvailableOutgoingBitrate: 100000,
        },
    }
} as const;