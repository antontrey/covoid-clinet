import { combineReducers } from 'redux';


// Import custom components

import filtersReducer from './filters';
import auth from './auth';


const appReducer = combineReducers({
    auth:auth,
    filters:filtersReducer,

});

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
      state = undefined
    }  
    return appReducer(state, action)
  }

export default rootReducer;