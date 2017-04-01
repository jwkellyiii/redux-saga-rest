import { call, CallEffect } from 'redux-saga/effects';

import * as utils from './utils';

export interface APIMiddlewareFactory {
    (config?: any): APIMiddleware;
}

export interface APIMiddleware {
    (req?: Request, next?: APINext, refresh?: APIRefresh): any;
}

export interface APINext {
    (req: Request): IterableIterator<CallEffect>|Promise<Response>;
}

export interface APIRefresh {
    (): CallEffect;
}

export default class API {
    private middlewares: APIMiddleware[] = [];

    constructor(private baseUrl?: string) { }

    private applyMiddlewares = function* (req: Request) {

        // Clone the request before applying the middleware, because the middleware will be reapplied.
        const refresh = () => this.fetch(req.clone());

        const combinedMiddleware = this.middlewares.reduce((acc: APINext, next: APIMiddleware) => function* (req: Request) {
            return yield call(next, req, acc, refresh);
        }, fetch);

        return yield call(combinedMiddleware, req);
    };

    use(middleware: APIMiddleware) {
        this.middlewares.push(middleware);
        return this;
    }

    fetch(info: RequestInfo, init?: RequestInit) {
        if (typeof info === 'string' && !utils.isURL(info) && this.baseUrl) {
            info = utils.joinPaths(this.baseUrl, info as string);
        }
        return call(this.applyMiddlewares.bind(this), new Request(info, init));
    }

    request(url: string, method: string, params?: any, entity?: any, init?: RequestInit) {
        init = init || {};
        init.method = method;

        if (!init.hasOwnProperty('headers')) {
            init.headers = new Headers();
        }
        if (!init.headers.has('Content-Type')) {
            if (init.method === 'GET') {
                init.headers.set('Content-Type', 'text/plain;charset=UTF-8');
            } else if (['POST', 'PUT', 'PATCH'].includes(init.method)) {
                init.headers.set('Content-Type', 'application/x-www-form-urlencoded');
            }
        }

        if (params) {
            url += `?${utils.queryString(params)}`;
        }

        if (entity) {
            if (entity instanceof FormData || typeof entity === 'string') {
                init.body = entity;
            } else {
                if (init.headers.get('Content-Type') === 'application/x-www-form-urlencoded') {
                    init.body = utils.queryString(entity);
                } else if (init.headers.get('Content-Type') === 'application/json') {
                    init.body = JSON.stringify(entity);
                } else {
                    init.body = entity;
                }
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
