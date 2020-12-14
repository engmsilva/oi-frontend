import createSagaMiddleware from 'redux-saga';

import createStore from './createStore';
import rootReducer from './rootReduncer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const store = createStore(rootReducer, middlewares);

sagaMiddleware.run(rootSaga);

export { store };