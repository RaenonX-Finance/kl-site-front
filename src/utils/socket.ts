import {io} from 'socket.io-client';

import {DataSocket} from '../types/socket/type';


export const getDataUrl = (): string => {
  return process.env.NODE_ENV === 'production' ?
    'wss://data.kl-law.net' :
    'ws://localhost:8000';
};

export const generateSocketClient = (): DataSocket => {
  return io(getDataUrl(), {path: '/ws/socket.io/'});
};