import { DeviceEventEmitter } from 'react-native'
import { Toast } from 'antd-mobile-rn'
import { call, put, takeEvery } from 'redux-saga/effects'
import * as ActionsTypes from '../Actions/ActionsTypes'
import * as Services from '../Services/HomepageServices'
// import * as MyServices from '../Services/My'

import Config from '../../Tool/Config'

/**
 * 请求主页列表
 */
function* fetchHomepageForumList({ type, payload }) {
  const res = yield call(Services.fetchHomepageForumList, payload)
  if (type == 'REQUEST_HOMEPAGE_FORUM_LIST') {
    if (res.code === '0') {
      yield put(ActionsTypes.successHomepageForumList(res.data))
    } else if (res.code === '99') {
      yield put({ type: ActionsTypes.FAILURE_HOMEPAGE_FORUM_LIST })
      Toast.info(res.msg, Config.ToestTime, null, false)
      DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    } else {
      yield put({ type: ActionsTypes.FAILURE_HOMEPAGE_FORUM_LIST })
      Toast.info(res.msg, Config.ToestTime, null, false)
    }
  } else if (type == 'UPDATE_HOMEPAGE_FORUM_LIST') {
    if (res.code === '0') {
      if (res.data.length) {
        // 如果请求有新数据才添加列表

        yield put(ActionsTypes.successUpdateHomepageForumList(res.data))
      }
    } else if (res.code === '99') {
      yield put({ type: ActionsTypes.FAILURE_UPDATE_HOMEPAGE_FORUM_LIST })
      Toast.info(res.msg, Config.ToestTime, null, false)
      DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    } else {
      yield put({ type: ActionsTypes.FAILURE_UPDATE_HOMEPAGE_FORUM_LIST })
      Toast.info(res.msg, Config.ToestTime, null, false)
    }
  }
}

/**
 * 请求主页列表
 */
function* fetchHomepageForumPostList({ type, payload }) {
  const res = yield call(Services.fetchHomepageForumPostList, payload)

  if (type == 'REQUEST_HOMEPAGE_FORUM_POST_LIST') {
    if (res.code === '0') {
      yield put(ActionsTypes.successHomepageForumPostList(res.data))
    } else if (res.code === '99') {
      yield put({ type: ActionsTypes.FAILURE_HOMEPAGE_FORUM_POST_LIST })
      Toast.info(res.msg, Config.ToestTime, null, false)
      DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    } else {
      yield put({ type: ActionsTypes.FAILURE_HOMEPAGE_FORUM_POST_LIST })
      Toast.info(res.msg, Config.ToestTime, null, false)
    }
  } else if ((type = 'UPDATE_HOMEPAGE_FORUM_POST_LIST')) {
    if (res.code === '0') {
      yield put(ActionsTypes.successUpdateHomepageForumPostList(res.data))
    } else if (res.code === '99') {
      yield put({ type: ActionsTypes.FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST })
      Toast.info(res.msg, Config.ToestTime, null, false)
      DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    } else {
      yield put({ type: ActionsTypes.FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST })
      Toast.info(res.msg, Config.ToestTime, null, false)
    }
  }
}

/**
 * 关注论坛和取消关注
 */
function* doAddAndCancelFollowForum({ type, payload }) {
  const { router } = payload
  const res = yield call(Services.doAddAndCancelFollowForum, payload)
  if (res.code === '0') {
    yield put(ActionsTypes.successDoAddFollowForum({ ...payload, type }))
    yield put(ActionsTypes.updateCurrentHomepageForumInfo({ ...payload, type }))
  } else if (res.code === '99') {
    yield put({ type: ActionsTypes.FAILURE_DO_ADD_FOLLOW_FORUM })
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  } else {
    yield put({ type: ActionsTypes.FAILURE_DO_ADD_FOLLOW_FORUM })
    Toast.info(res.msg, Config.ToestTime, null, false)
  }
}

/**
 * 前台设置置顶
 */
function* doSetForumPostTop({ type, payload }) {
  // const res = yield call(MyServices.setForumPost, payload)
  // if (router == 'HomepagePostList') {
  //   // yield put(ActionsTypes.successDoAddFollowForum({ ...payload, type }))
  // } else {
  //   if (res.code === '0') {
  //     // yield put(ActionsTypes.successDoAddFollowForum({ ...payload, type }))
  //   } else if (res.code === '99') {
  //     yield put({ type: ActionsTypes.FAILURE_SET_FORUM_POST_TOP })
  //     Toast.info(res.msg, Config.ToestTime, null, false)
  //     DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  //   } else {
  //     yield put({ type: ActionsTypes.FAILURE_SET_FORUM_POST_TOP })
  //     Toast.info(res.msg, Config.ToestTime, null, false)
  //   }
  // }
}

/**
 * 前台设置加精
 */
function* doSetForumPostBoutique({ type, payload }) {
  // const { router } = payload
  // const res = yield call(MyServices.setForumPost, payload)
  // if (router == 'HomepagePostList') {
  //   // yield put(ActionsTypes.successDoAddFollowForum({ ...payload, type }))
  // } else {
  //   if (res.code === '0') {
  //     // yield put(ActionsTypes.successDoAddFollowForum({ ...payload, type }))
  //   } else if (res.code === '99') {
  //     yield put({ type: ActionsTypes.FAILURE_SET_FORUM_POST_BOUTIQUE })
  //     Toast.info(res.msg, Config.ToestTime, null, false)
  //     DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  //   } else {
  //     yield put({ type: ActionsTypes.FAILURE_SET_FORUM_POST_BOUTIQUE })
  //     Toast.info(res.msg, Config.ToestTime, null, false)
  //   }
  // }
}



function* rootSaga() {
  yield takeEvery(
    ActionsTypes.REQUEST_HOMEPAGE_FORUM_POST_LIST,
    fetchHomepageForumPostList
  ) //请求主页频道列表
  yield takeEvery(
    ActionsTypes.UPDATE_HOMEPAGE_FORUM_POST_LIST,
    fetchHomepageForumPostList
  ) //添加主页频道列表
  yield takeEvery(
    ActionsTypes.REQUEST_HOMEPAGE_FORUM_LIST,
    fetchHomepageForumList
  ) // 请求主页列表
  yield takeEvery(
    ActionsTypes.UPDATE_HOMEPAGE_FORUM_LIST,
    fetchHomepageForumList
  ) // 添加主页列表
  yield takeEvery(
    ActionsTypes.REQUEST_DO_ADD_FOLLOW_FORUM,
    doAddAndCancelFollowForum
  ) // 关注论坛和取消关注
  yield takeEvery(
    ActionsTypes.REQUEST_DO_CANCEL_FOLLOW_FORUM,
    doAddAndCancelFollowForum
  )
  yield takeEvery(ActionsTypes.SET_FORUM_POST_TOP, doSetForumPostTop) // 前台设置置顶
  yield takeEvery(ActionsTypes.SET_FORUM_POST_BOUTIQUE, doSetForumPostBoutique) // 前台设置加精

}

export default rootSaga
