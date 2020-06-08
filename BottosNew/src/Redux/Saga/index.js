import { fork } from 'redux-saga/effects'
import My from './My'
import MemberAssets from './MemberAssets'
import CommunityPost from './CommunityPostSage'
import Homepage from './HomepageSage'

export default function* rootSaga() {
  yield fork(My)
  yield fork(MemberAssets)
  yield fork(CommunityPost)
  yield fork(Homepage)
}
