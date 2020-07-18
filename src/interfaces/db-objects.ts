import { IActor, isActor, IActivity } from 'commune-common/definitions/interfaces'

export enum APStatus {
    normal = "normal",
    pending = "pending",
    canceled = "canceled",
    forbid = "forbid"
}

interface IDbActorInternal {
    passwordHash: string
    isLocal: boolean
    isAdmin: boolean
    privateKey: string
    domain: string
    status: APStatus
}

interface IDbActivityInternal {
    recipients: string[]
    status: APStatus
}

export interface IDbActor extends IActor {
    internal?: IDbActorInternal
}

export interface IDbActivity extends IActivity {
    internal?: IDbActivityInternal
}