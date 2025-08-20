export interface IRoomMemberRef {
    user: string;
    roomRole: 'admin' | 'member';
    joinTimestamp: number;
}

export interface IRoom {
    _id: string;
    name: string;
    code: string;
    owner: string | null;
    members: IRoomMemberRef[];
    currentMemberCount: number;
    messages: string[];
    memberLimit: number;
    isSystemGenerated: boolean;
    createdAt: number;
    updatedAt: number;
}


