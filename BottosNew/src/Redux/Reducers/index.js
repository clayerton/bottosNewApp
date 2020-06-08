// src/Reducers/index.js

import { combineReducers } from 'redux'

import communityState from './CommunityReducer'
import myState from './MyReducer'
import memberAssetsState from './MemberAssetsReducer'
import myfansListState from './MyfansList'
import CommunityPostState from './CommunityPostReducer'
import HomepageState from './HomepageReducer'
// import loginState from './LoginReducer'

const rootReducer = combineReducers({
  communityState,
  CommunityPostState,
  myfansListState,
  myState,
  HomepageState,
  memberAssetsState
  // loginState
  // demoState,
})

export default rootReducer
