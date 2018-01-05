import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import isHotdog from './items/reducer';

const root = combineReducers({
  isHotdog,
  router: routerReducer,
});

export default root;
