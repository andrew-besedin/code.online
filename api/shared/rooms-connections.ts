

interface RoomsConnections {
    [key: string]: {
        roomId: string;
        userId: string;
    }
}

export const roomsConnections: RoomsConnections[] = [];