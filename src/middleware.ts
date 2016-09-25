import { APIMiddlewareFactory, APINext } from './api';

export const defaultMiddleware: APIMiddlewareFactory = () => function* (req: IRequest, next: APINext): any {
    const headers = req.headers || new Headers();
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }
    return yield next(new Request(req, { headers }));
};
