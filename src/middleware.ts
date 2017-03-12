import { APIMiddlewareFactory, APINext } from './api';

export const defaultMiddleware: APIMiddlewareFactory = () => function* (req: Request, next: APINext): any {
    const headers = req.headers || new Headers();
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {

        // TODO hack; wrapping the request should happen last
        if (headers.get('Content-Type') == 'text/plain;charset=UTF-8') {
            headers.set('Content-Type', 'application/x-www-form-urlencoded');
        }
    }
    return yield next(new Request(req, { headers }));
};
