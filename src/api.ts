import { call, CallEffect } from 'redux-saga/effects';

import * as util from './util';

export interface APIMiddlewareFactory {
    (config?: any): APIMiddleware;
}

export interface APIMiddleware {
    (req?: IRequest, next?: APINext, refresh?: APIRefresh): any;
}

export interface APINext {
    (req: IRequest): CallEffect;
}

export interface APIRefresh {
    (): CallEffect;
}

export class API {
    private middlewares: APIMiddleware[] = [];

    constructor(private baseUrl?: string) { }

    private applyMiddlewares = function* (req: IRequest) {

        // Clone the request before applying the middleware, because the middleware will be reapplied.
        const refresh = () => this.fetch(req.clone());

        const combinedMiddleware = this.middlewares.reduce((acc: APINext, next: APIMiddleware) => function* (req: IRequest) {
            return yield call(next, req, acc, refresh);
        }, fetch);

        return yield call(combinedMiddleware, req);
    };

    use(middleware: APIMiddleware) {
        this.middlewares.push(middleware);
        return this;
    }

    fetch(info: RequestInfo, init?: RequestInit) {
        if (typeof info === 'string' && !util.isURL(info) && this.baseUrl) {
            info = util.joinPaths(this.baseUrl, info as string);
        }
        return call(this.applyMiddlewares.bind(this), new Request(info, init));
    }

    request(url: string, method: string, params?: any, entity?: any, init?: RequestInit) {
        init = init || {};
        init.method = method;
        if (params) {
            if (typeof params === 'string') {
                url += `?${params}`;
            } else {
                url += `?${util.encode(params)}`;
            }
        }
        if (entity) {
            if (typeof entity === 'string') {
                init.body = entity;
            } else {
                init.body = util.encode(entity);
            }
        }
        return this.fetch(url, init);
    }

    get(url: string, params?: any, init?: RequestInit) {
        return this.request(url, 'GET', params, null, init);
    }

    post(url: string, entity?: any, init?: RequestInit) {
        return this.request(url, 'POST', null, entity, init);
    }

    put(url: string, entity?: any, init?: RequestInit) {
        return this.request(url, 'PUT', null, entity, init);
    }

    patch(url: string, entity?: any, init?: RequestInit) {
        return this.request(url, 'PATCH', null, entity, init);
    }

    del(url: string, init?: RequestInit) {
        return this.request(url, 'DELETE', null, init);
    }
}
