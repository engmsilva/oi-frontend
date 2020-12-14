import { createStore, applyMiddleware } from 'redux';

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (reducers, middlewares) => {
  const enhancer = applyMiddleware(...middlewares);

  return createStore(reducers, enhancer);
}