import io from 'socket.io-client';
const socket = io({ closeOnBeforeunload: true });

export default socket;