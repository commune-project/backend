import { IActor, isActor, IActivity } from 'commune-common/definitions/interfaces'

interface IDbActorInternal {
    passwordHash: string
    isLocal: boolean
    isAdmin: boolean
    privateKey: string
    domain: string
}

interface IDbActivityInternal {
    recipients: string[]
}

export interface IDbActor extends IActor {
    internal?: IDbActorInternal
}

export interface IDbActivity extends IActivity {
    internal?: IDbActivityInternal
}