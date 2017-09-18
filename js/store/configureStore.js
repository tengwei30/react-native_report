import rootReducer from '../reducers';
import {
  applyMiddleware,
  createStore
} from 'redux';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';


let isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;
let reduxLogger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

const createStoreWithMiddleware = applyMiddleware(thunk, reduxLogger)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);
  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}