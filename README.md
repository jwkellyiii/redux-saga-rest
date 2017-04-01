# redux-saga-rest

[![npm version](https://img.shields.io/npm/v/redux-saga-rest.svg?style=flat-square)](https://www.npmjs.com/package/redux-saga-rest)

`redux-saga-rest` is a thin wrapper around the Fetch API that integrates with [redux-saga](https://github.com/yelouafi/redux-saga) and supports request/response middleware.

## Installation

```sh
# dependencies
yarn add redux redux-saga isomorphic-fetch

yarn add redux-saga-rest
```

## Usage Example

#### `api.js`

```javascript
import { put, select } from 'redux-saga/effects';
import { API, defaultMiddleware } from 'redux-saga-rest';

import * as selectors from './selectors';
import * as actions from './actions';


const authMiddleware: APIMiddlewareFactory = () => function* (req, next) {
    const user = yield select(selectors.user);
    
    if (!user.isAuthenticated) {
        throw new Error(`Tried to access ${req.url}, but user is not authenticated.`);
    }
    
    const headers = req.headers || new Headers();
    headers.set('Authorization', `Bearer ${user.token}`);

    const res = yield next(new Request(req, { headers }));

    if (res.status === 401) {
        yield put(actions.logout());
    }
    
    return res;
};


export const auth = new API('/api/')
    .use(defaultMiddleware())
    .use(authMiddleware());
```

**TODO:** Describe defaultMiddleware, and describe the middleware application order.

#### `sagas.js`

```javascript
import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';

import * as constants from './constants';
import * as actions from './actions';
import { auth } from './api';


function* watchUpdateProfile() {
    yield* takeEvery(constants.UPDATE_PROFILE, function* (action) {
        const res = yield auth.patch('/profile/', action.payload);
        
        if (res.ok) {
            yield put(actions.updateProfileSuccess());
        } else {
            yield put(actions.updateProfileFailure());
        }
    });
}


export default function* () {
    yield [
        // ...
        watchUpdateProfile(),
    ];
};
```
