import { DeviceEventEmitter } from 'react-native'
import { Toast } from 'antd-mobile-rn'
import { call, put, takeEvery } from 'redux-saga/effects'
import * as ActionsTypes from '../Actions/ActionsTypes'
import * as Services from '../Services/My'
import Config from '../../Tool/Config'

/**
 * 获取个人画像信息
 */
function* fetchUserInfo({ type, payload }) {
  const res = yield call(Services.fetchPersonalPortrait, payload)
  if (res.code === '0') {
    yield put(ActionsTypes.successPersonalPortrait({ ...res.data }))
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: ActionsTypes.FAILURE_PERSONAL_PORTRAIT })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: ActionsTypes.FAILURE_PERSONAL_PORTRAIT })
  }
}

/**
 * 请求关注列表
 */
function* updateAndAppendFollowList({ type, payload }) {
  const res = yield call(Services.fetchFollowList, payload)
  if (res.code === '0') {
    const { rows, page_count, page } = res.data
    const newData = rows.map(item => {
      return { ...item }
    })

    if (type === 'REQUEST_UPDATE_FOLLOW_LIST') {
      yield put(
        ActionsTypes.successUpdateFollowList({
          followListData: newData,
          page_count,
          page
        })
      )
    } else {
      yield put(
        ActionsTypes.successAppendFollowList({
          followListData: newData,
          page_count,
          page
        })
      )
    }
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: ActionsTypes.FAILURE_UPDATE_FOLLOW_LIST })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: ActionsTypes.FAILURE_UPDATE_FOLLOW_LIST })
  }
}

/**
 * 取消关注
 */
function* doCancel({ type, payload }) {
  const res = yield call(Services.doCancelFollow, payload)
  if (res.code === '0') {
    DeviceEventEmitter.emit('FANSLIST_POST')
    Toast.info(res.msg, Config.ToestTime, null, false)
    if (payload.router && payload.router == 'Community') {
      yield put(ActionsTypes.successUpdateDoAddFollow({ ...payload }))
    } else if (payload.router && payload.router == 'Homepage') {
      yield put(
        ActionsTypes.successUpdateHomepageForumPostListInfo({
          ...payload,
          type
        })
      )
    } else if (payload.router && payload.router == 'OnePost') {
      yield put(
        ActionsTypes.successUpdateDoAddFollow({
          ...payload,
          type
        })
      )
    }
    yield put(ActionsTypes.successDoCancelFollow({ ...payload }))
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: ActionsTypes.FAILURE_DO_CANCEL_FOLLOW })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: ActionsTypes.FAILURE_DO_CANCEL_FOLLOW })
  }
}

/**
 * 添加关注
 */
function* doAdd({ type, payload }) {
  const res = yield call(Services.doAddFollow, payload)
  if (res.code === '0') {
    DeviceEventEmitter.emit('FANSLIST_POST')
    Toast.info(res.msg, Config.ToestTime, null, false)

    if (payload.router && payload.router == 'Community') {
      yield put(ActionsTypes.successUpdateDoAddFollow({ ...payload }))
    } else if (payload.router && payload.router == 'Homepage') {
      yield put(
        ActionsTypes.successUpdateHomepageForumPostListInfo({
          ...payload,
          type
        })
      )
    } else if (payload.router && payload.router == 'OnePost') {
      yield put(
        ActionsTypes.successUpdateDoAddFollow({
          ...payload,
          type
        })
      )
    }
    yield put(ActionsTypes.successDoAddFollow({ ...payload }))
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: ActionsTypes.FAILURE_DO_ADD_FOLLOW })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: ActionsTypes.FAILURE_DO_ADD_FOLLOW })
  }
}

/**
 * 检查是否关注了当前用户
 */
function* checkIsFollow({ type, payload }) {
  const res = yield call(Services.checkIsFollow, payload)
  if (res.code === '0' || res.code === '-1') {
    yield put(ActionsTypes.successCheckIsFollow({ ...res }))
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: ActionsTypes.FAILURE_CHECK_IS_FOLLOW })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: ActionsTypes.FAILURE_CHECK_IS_FOLLOW })
  }
}

/**
 * 前台设置置顶
 */
function* setForumPostTop({ type, payload }) {
  const res = yield call(Services.doSetForumPost, payload)
  // if (res.code === '0' || res.code === '-1') {
  //   yield put(ActionsTypes.successCheckIsFollow({ ...res }))
  // } else if (res.code === '99') {
  //   Toast.info(res.msg, Config.ToestTime, null, false)
  //   DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  //   yield put({ type: ActionsTypes.FAILURE_CHECK_IS_FOLLOW })
  // } else {
  //   Toast.info(res.msg, Config.ToestTime, null, false)
  //   yield put({ type: ActionsTypes.FAILURE_CHECK_IS_FOLLOW })
  // }
}

/**
 * 前台设置加精
 */
function* setForumPostBoutique({ type, payload }) {
  const res = yield call(Services.doSetForumPost, payload)
  // if (res.code === '0' || res.code === '-1') {
  //   yield put(ActionsTypes.successCheckIsFollow({ ...res }))
  // } else if (res.code === '99') {
  //   Toast.info(res.msg, Config.ToestTime, null, false)
  //   DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  //   yield put({ type: ActionsTypes.FAILURE_CHECK_IS_FOLLOW })
  // } else {
  //   Toast.info(res.msg, Config.ToestTime, null, false)
  //   yield put({ type: ActionsTypes.FAILURE_CHECK_IS_FOLLOW })
  // }
}

function* rootSaga() {
  yield takeEvery(ActionsTypes.REQUEST_PERSONAL_PORTRAIT, fetchUserInfo)
  yield takeEvery(
    ActionsTypes.REQUEST_UPDATE_FOLLOW_LIST,
    updateAndAppendFollowList
  )
  yield takeEvery(
    ActionsTypes.REQUEST_APPEND_FOLLOW_LIST,
    updateAndAppendFollowList
  )
  yield takeEvery(ActionsTypes.REQUEST_DO_CANCEL_FOLLOW, doCancel)
  yield takeEvery(ActionsTypes.REQUEST_DO_ADD_FOLLOW, doAdd)
  yield takeEvery(ActionsTypes.REQUEST_CHECK_IS_FOLLOW, checkIsFollow)
  yield takeEvery(ActionsTypes.SET_FORUM_POST_TOP, setForumPostTop) // 前台设置置顶
  yield takeEvery(ActionsTypes.SET_FORUM_POST_BOUTIQUE, setForumPostBoutique) // 前台设置加精
}

export default rootSaga
