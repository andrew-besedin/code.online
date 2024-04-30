

interface RoomsConnections {
    [key: string]: {
        [key: string]: Set<string>;
    }
}

export const roomsConnections: RoomsConnections = {};