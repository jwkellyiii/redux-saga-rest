import { CallEffect } from 'redux-saga/effects';

export interface APIMiddlewareFactory {
	(config?: any): APIMiddleware;
}

export interface APIMiddleware {
	(req?: Request, next?: APINext, refresh?: APIRefresh): any;
}

export interface APINext {
	(req: Request): IterableIterator<CallEffect> | Promise<Response>;
}

export interface APIRefresh {
	(): CallEffect;
}

export class API {
	constructor(baseUrl?: string);
	use(middleware: APIMiddleware): this;
	fetch(info: RequestInfo, init?: RequestInit): CallEffect;
	request(url: string, method: string, params?: any, entity?: any, init?: RequestInit): CallEffect;
	get(url: string, params?: any, init?: RequestInit): CallEffect;
	post(url: string, entity?: any, init?: RequestInit): CallEffect;
	put(url: string, entity?: any, init?: RequestInit): CallEffect;
	patch(url: string, entity?: any, init?: RequestInit): CallEffect;
	del(url: string, init?: RequestInit): CallEffect;
}
