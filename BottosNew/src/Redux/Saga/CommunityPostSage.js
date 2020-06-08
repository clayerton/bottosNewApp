import { DeviceEventEmitter } from 'react-native'
import { Toast } from 'antd-mobile-rn'
import { call, put, takeEvery } from 'redux-saga/effects'
import * as ActionsTypes from '../Actions/ActionsTypes'
import * as Services from '../Services/CommunityServices'
import Config from '../../Tool/Config'

/**
 * 选择菜单栏
 */
function* doSaveCurrentMenuOption({ type, payload }) {
  yield put(ActionsTypes.successSaveCurrentMenuOption(payload))
}

/**
 * 输入框和键盘的弹出
 */
function* toggleCommentInputVisible({ type, payload }) {
  yield put(ActionsTypes.successToggleCommentInputVisible())
  yield put(ActionsTypes.setTargetPostId(payload))
}

/**
 * 置顶的数据详情
 */
function* fetchPostTopPost({ type, payload }) {
  const res = yield call(Services.fetchPostTopPost)
  if (res.code === '0') {
    yield put(ActionsTypes.successPostTopPost(res.data))
  } else if (res.code === '99') {
    yield put({ type: ActionsTypes.FAILURE_POST_TOP_POST })
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  } else {
    yield put({ type: ActionsTypes.FAILURE_POST_TOP_POST })
    Toast.info(res.msg, Config.ToestTime, null, false)
  }
}

/**
 * 菜单栏列表
 */
function* fetchHomePageList({ type, payload }) {
  const res = yield call(Services.fetchHomePageList)
  if (res.code === '0') {
    yield put(ActionsTypes.successHomePageList(res.data))
  } else if (res.code === '99') {
    yield put({ type: ActionsTypes.FAILURE_HOMEPAGE_LIST })
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  } else {
    yield put({ type: ActionsTypes.FAILURE_HOMEPAGE_LIST })
    Toast.info(res.msg, Config.ToestTime, null, false)
  }
}

/**
 * 更新帖子列表
 */
function* updateHomePageContent({ type, payload }) {
  const res = yield call(Services.fetchHomePageContent, payload)
  if (res.code === '0') {
    if (payload && payload.key && payload.key == 'recommend') {
      yield put(ActionsTypes.successUpdateHomePageContentRecommend(res.data))
    } else {
      yield put(ActionsTypes.successHomePageContent(res.data))
    }
  } else if (res.code === '99') {
    yield put({ type: ActionsTypes.FAILURE_HOME_PAGE_CONTENT })
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  } else {
    yield put({ type: ActionsTypes.FAILURE_HOME_PAGE_CONTENT })
    Toast.info(res.msg, Config.ToestTime, null, false)
  }
}

/**
 * 添加帖子列表
 */
function* appendHomePageContent({ type, payload }) {
  const res = yield call(Services.fetchHomePageContent, payload)

  if (res.code === '0') {
    if (payload && payload.key && payload.key == 'recommend') {
      yield put(ActionsTypes.successAppendHomePageContentRecommend(res.data))
    } else {
      yield put(ActionsTypes.successAppendHomePageContent(res.data))
    }
  } else if (res.code === '99') {
    yield put({ type: ActionsTypes.FAILURE_APPEND_HOME_PAGE_CONTENT })
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  } else {
    yield put({ type: ActionsTypes.FAILURE_APPEND_HOME_PAGE_CONTENT })
    Toast.info(res.msg, Config.ToestTime, null, false)
  }
}

/**
 * 帖子详情
 */
function* fetchPostDetail({ type, payload }) {
  const res = yield call(Services.fetchPostDetail, payload)

  if (res.code === '0') {
    yield put(ActionsTypes.successPostDetail(res.data))
    yield put({
      type: ActionsTypes.DO_POST_READ_COUNT,
      payload
    })
  } else if (res.code === '99') {
    yield put({ type: ActionsTypes.FAILURE_POST_DETAIL })
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  } else {
    yield put({ type: ActionsTypes.FAILURE_POST_DETAIL })
    Toast.info(res.msg, Config.ToestTime, null, false)
  }
}

/**
 * 统计帖子数
 */
function* doPostReadCount({ type, payload }) {
  const res = yield call(Services.doPostReadCount, payload)
  if (res.code === '0') {
    yield put(ActionsTypes.successDoPostReadCount())
  } else if (res.code === '99') {
    yield put({ type: ActionsTypes.FAILURE_DO_POST_READ_COUNT })
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  } else {
    yield put({ type: ActionsTypes.FAILURE_DO_POST_READ_COUNT })
    Toast.info(res.msg, Config.ToestTime, null, false)
  }
}

/**
 * 点赞
 */
function* doFollowPraise({ type, payload }) {
  const res = yield call(Services.doFollowPraise, payload)

  if (res.code == '0') {
    if (payload.router && payload.router == 'Homepage') {
      yield put(
        ActionsTypes.successUpdateHomepageForumPostListInfo({
          ...payload,
          type
        })
      )
    } else {
      yield put(ActionsTypes.successFollowPraise(payload))
    }
  } else if (res.code === '99') {
    yield put({ type: ActionsTypes.FAILURE_FOLLOW_PRAISE })
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  } else {
    yield put({ type: ActionsTypes.FAILURE_FOLLOW_PRAISE })
    Toast.info(res.msg, Config.ToestTime, null, false)
  }
}

/**
 * 获取未读消息数
 */
function* updateUnreadMessage({ type, payload }) {
  const res = yield call(Services.updateUnreadMessage)

  if (res.code === '0') {
    yield put(ActionsTypes.successUpdateUnreadMessage(res.data))
  } else if (res.code === '99') {
    yield put({ type: ActionsTypes.FAILURE_UPDATE_UNREAD_MESSAGE })
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  } else {
    yield put({ type: ActionsTypes.FAILURE_UPDATE_UNREAD_MESSAGE })
    Toast.info(res.msg, Config.ToestTime, null, false)
  }
}

/**
 * 清除未读数
 */
function* clearUnreadMessage({ type, payload }) {
  yield put(ActionsTypes.successUpdateUnreadMessage({ count: 0 }))
}

/**
 * 回帖
 */
function* sendFollowPost({ type, payload }) {
  const res = yield call(Services.sendFollowPost, payload)
  if (res.code === '0') {
    if (type == 'SEND_FOLLOW_REPLY_POST') {
      yield put(
        ActionsTypes.successSendFollowReplyPost({
          ...payload,
          reply_id: res.data
        })
      )
    } else {
      const { router } = payload
      if (router == 'HomepagePostList') {
        yield put(
          ActionsTypes.successUpdateHomepageForumPostListInfo({
            ...payload,
            reply_id: res.data
          })
        )
      } else {
        yield put(
          ActionsTypes.successSendFollowPost({ ...payload, reply_id: res.data })
        )
      }
    }
    yield put(ActionsTypes.successToggleCommentInputVisible())
    Toast.info(res.msg, Config.ToestTime, null, false)
  } else if (res.code === '99') {
    if (router == 'HomepagePostList') {
      yield put({
        type: ActionsTypes.FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO
      })
    } else {
      yield put({ type: ActionsTypes.FAILURE_SEND_FOLLOW_POST })
    }

    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  } else {
    if (router == 'HomepagePostList') {
      yield put({
        type: ActionsTypes.FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO
      })
    } else {
      yield put({ type: ActionsTypes.FAILURE_SEND_FOLLOW_POST })
    }

    Toast.info(res.msg, Config.ToestTime, null, false)
  }
}

/**
 * 删除帖子
 */
function* doDeletePost({ type, payload }) {
  const res = yield call(Services.doDeletePost, payload)
  if (res.code === '0') {
    yield put(ActionsTypes.successDoDeletePost(payload))
    Toast.info(res.msg, Config.ToestTime, null, false)
  } else if (res.code === '99') {
    yield put({ type: ActionsTypes.FAILURE_DO_DELETE_POST })
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
  } else {
    yield put({ type: ActionsTypes.FAILURE_DO_DELETE_POST })
    Toast.info(res.msg, Config.ToestTime, null, false)
  }
}

function* rootSaga() {
  yield takeEvery(
    ActionsTypes.DO_SAVE_CURRENT_MENU_OPTION,
    doSaveCurrentMenuOption
  )
  yield takeEvery(ActionsTypes.REQUEST_POST_TOP_POST, fetchPostTopPost)
  yield takeEvery(ActionsTypes.REQUEST_HOMEPAGE_LIST, fetchHomePageList)
  yield takeEvery(ActionsTypes.UPDATE_HOME_PAGE_CONTENT, updateHomePageContent) // 更新主页帖子列表
  yield takeEvery(ActionsTypes.APPEND_HOME_PAGE_CONTENT, appendHomePageContent) // 添加帖子列表
  yield takeEvery(ActionsTypes.DO_FOLLOW_PRAISE, doFollowPraise) // 点赞
  yield takeEvery(
    ActionsTypes.TOGGLE_COMMENT_INPUT_VISIBLE,
    toggleCommentInputVisible
  ) // 输入框和键盘的弹出
  yield takeEvery(ActionsTypes.UPDATE_UNREAD_MESSAGE, updateUnreadMessage) // 获取未读消息数
  yield takeEvery(ActionsTypes.CLEAR_UNREAD_MESSAGE, clearUnreadMessage) // 清除未读数
  yield takeEvery(ActionsTypes.SEND_FOLLOW_POST, sendFollowPost) // 回帖
  yield takeEvery(ActionsTypes.SEND_FOLLOW_REPLY_POST, sendFollowPost) // 回帖
  yield takeEvery(ActionsTypes.REQUEST_POST_DETAIL, fetchPostDetail) // 帖子详情
  yield takeEvery(ActionsTypes.DO_DELETE_POST, doDeletePost) // 删除帖子
  yield takeEvery(ActionsTypes.DO_POST_READ_COUNT, doPostReadCount) // 统计帖子数
}

export default rootSaga
