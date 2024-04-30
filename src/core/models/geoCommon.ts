export interface ISuggestLocation {
    name: string;
    lat: number;
    lng: number;
    placeId: string;
    waypointId: string;
    boundingBox: [string, string, string, string];
}

export enum FindRouteStatus {
    NOT_FOUND,
    FOUND,
    LOOKING,
    NOT_YET,
}
export interface IInstructionItem {
    type: string;
    distance: number;
    time: number;
    road: string;
    direction: string;
    index: number;
    mode: string;
    modifier: string;
    text: string;
}

export interface IInstructionObject {
    instructions: IInstructionItem[];
    totalDistance: number;
    totalTime: number;
}

export interface IMaker {
    locationPoint: ILocationPoint;
    name?: string;
    description?: string;
}

export interface ILocationPoint {
    lng: number;
    lat: number;
}

export interface IMap {
    className?: string;
    waypoints: ISuggestLocation[];
    setInstructionObject: React.Dispatch<React.SetStateAction<IInstructionObject>>;
}
