import IAbstractFetcher, {IFetcherMiddleware} from 'commune-common/ap-fetchers/abstract-fetcher'
import HttpFetcher from 'commune-common/ap-fetchers/http-fetcher'

const createSigner = require('http-signature').createSigner

import {IDbActor} from '../interfaces/db-objects'
import url from 'url'

export class AuthedFetcherMiddleware implements IFetcherMiddleware {
    constructor(private actor: IDbActor) {}
    setupFetcher(fetcher: IAbstractFetcher): void {
        (fetcher as HttpFetcher).headerGenerator = async (id) => {
            const parsed = url.parse(id)
            const signer = createSigner({
                key: this.actor.internal?.privateKey
            })
            signer.writeHeader('host', parsed.host)
            signer.writeDateHeader()
            signer.writeTarget('get', parsed.path)
            return new Promise((resolve, reject)=> {
                signer.sign((err: any, authz: string)=>{
                    if (err) {
                        reject(err)
                    } else {
                        resolve({
                            'Date': signer.rs_headers['date'],
                            'Authorization': authz
                        })
                    }
                })
            })
        }
    }
}

export default class AuthedHttpFetcher extends HttpFetcher {
    constructor(actor: IDbActor) {
        super(new AuthedFetcherMiddleware(actor))
    }
}