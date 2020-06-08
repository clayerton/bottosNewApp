import { DeviceEventEmitter } from 'react-native'
import { Toast } from 'antd-mobile-rn'
import { call, put, takeEvery } from 'redux-saga/effects'
import {
  REQUEST_MEMBER_ASSETS_USR_FULL_DATE,
  successMemberAssetsUsefulDate,
  FAILURE_MEMBER_ASSETS_USR_FULL_DATE,
  REQUEST_MEMBER_ASSETS_LIST,
  successMemberAssetsList,
  FAILURE_MEMBER_ASSETS_LIST,
  REQUEST_UPDATE_MEMBER_ASSETS_LIST,
  successUpdateMemberAssetsList,
  FAILURE_UPDATE_MEMBER_ASSETS_LIST,
  REQUEST_APPEND_MEMBER_ASSETS_LIST,
  successAppendMemberAssetsList,
  REQUEST_MEMBER_ASSETS,
  successMemberAssets,
  FAILURE_MEMBER_ASSETS,
  REQUEST_CONVERT_REDEEM_USE,
  successConvertRedeemUse,
  FAILURE_CONVERT_REDEEM_USE,
  REQUEST_WITH_DRAW_CONFIG,
  successWithdrawConfig,
  FAILURE_WITH_DRAW_CONFIG,
  REQUEST_WITH_DRAW_CHAIN_LIST,
  successWithdrawChainList,
  FAILURE_WITH_DRAW_CHAIN_LIST,
  REQUEST_WITH_DRAW_DEPOSIT,
  successWithdrawDeposit,
  FAILURE_WITH_DRAW_DEPOSIT,
  REQUEST_WITH_DRAW_MOBILE_CODE_VERIFY,
  successWithdrawMobileCodeVerify,
  FAILURE_WITH_DRAW_MOBILE_CODE_VERIFY,
  REQUEST_WITH_DRAW_JURISDICTION,
  successWithdrawJurisdiction,
  FAILURE_WITH_DRAW_JURISDICTION
} from '../Actions/ActionsTypes'
import * as Services from '../Services/MemberAssets'
import Config from '../../Tool/Config'

/**
 * 获取有资产的月份数组
 */
function* fetchMemberAssetsUsefulDate({ type, payload }) {
  const res = yield call(Services.fetchMemberAssetsUsefulDate, payload)

  if (res.code === '0') {
    yield put(successMemberAssetsUsefulDate(res.data))
    if (res.data.length !== 0) {
      const { date } = res.data[0]
      payload.date = date
      if (payload.asset_type.length > 1) {
        payload.asset_type = '0'
      }
      yield put({ type: REQUEST_UPDATE_MEMBER_ASSETS_LIST, payload })
    } else {
      yield put(successUpdateMemberAssetsList({ data: [] }))
    }
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: FAILURE_MEMBER_ASSETS_USR_FULL_DATE })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: FAILURE_MEMBER_ASSETS_USR_FULL_DATE })
  }
}

/**
 * 获取每个月份的资产列表
 */
function* fetchMemberAssetsList({ type, payload }) {
  if (payload.asset_type.length > 1) {
    payload.asset_type = '0'
  }
  const res = yield call(Services.fetchMemberAssetsList, payload)

  if (res.code === '0') {
    type === 'REQUEST_UPDATE_MEMBER_ASSETS_LIST' &&
      (yield put(
        successUpdateMemberAssetsList({ data: res.data, extra: res.extra })
      ))
    type === 'REQUEST_APPEND_MEMBER_ASSETS_LIST' &&
      (yield put(
        successAppendMemberAssetsList({ data: res.data, extra: res.extra })
      ))
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: FAILURE_UPDATE_MEMBER_ASSETS_LIST })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: FAILURE_UPDATE_MEMBER_ASSETS_LIST })
  }
}

/**
 * 资产币种列表
 */
function* fetchMemberAssets({ type, payload }) {
  const res = yield call(Services.fetchMemberAssets)
  if (res.code === '0') {
    yield put(successMemberAssets(res.data))
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: FAILURE_MEMBER_ASSETS })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: FAILURE_MEMBER_ASSETS })
  }
}

/**
 * 兑换 兑换码
 */
function* convertRedeemUse({ type, payload }) {
  const res = yield call(Services.convertRedeemUse, payload)

  if (res.code === '0') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put(successConvertRedeemUse(res.data))
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: FAILURE_CONVERT_REDEEM_USE })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: FAILURE_CONVERT_REDEEM_USE })
  }
}

/**
 *  资产传出 基本信息
 */
function* fetchWithdrawConfig({ type, payload }) {
  const res = yield call(Services.fetchWithdrawConfig)
  if (res.code === '0') {
    yield put(successWithdrawConfig(res.data))
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: FAILURE_WITH_DRAW_CONFIG })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: FAILURE_WITH_DRAW_CONFIG })
  }
}

/**
 *  转出方式列表
 */
function* fetchWithdrawChainList({ type, payload }) {
  const res = yield call(Services.fetchWithdrawChainList)

  if (res.code === '0') {
    yield put(successWithdrawChainList(res.data))
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: FAILURE_WITH_DRAW_CHAIN_LIST })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: FAILURE_WITH_DRAW_CHAIN_LIST })
  }
}

/**
 * 转出币
 */
function* doTransferPayment({ type, payload }) {
  const res = yield call(Services.fetchWithdrawDeposit, payload)

  if (res.code === '0') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put(successWithdrawDeposit(res.data))
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: FAILURE_WITH_DRAW_DEPOSIT })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: FAILURE_WITH_DRAW_DEPOSIT })
  }
}

/**
 * 转出发验证码
 */
function* sendWithdrawCMobileCodeVerify({ type, payload }) {
  const res = yield call(Services.sendWithdrawMobileCodeVerify, payload)

  if (res.code === '0') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put(successWithdrawMobileCodeVerify(res.data))
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: FAILURE_WITH_DRAW_MOBILE_CODE_VERIFY })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: FAILURE_WITH_DRAW_MOBILE_CODE_VERIFY })
  }
}

/**
 * 验证用户权限
 */
function* checkWithdrawJurisdiction({ type, payload }) {
  const res = yield call(Services.checkWithdrawJurisdiction, payload)
  if (res.code === '0') {
    yield put(successWithdrawJurisdiction({ Jurisdiction: true, msg: res.msg }))
  } else if (res.code === '-1') {
    yield put(
      successWithdrawJurisdiction({ Jurisdiction: false, msg: res.msg })
    )
  } else if (res.code === '99') {
    Toast.info(res.msg, Config.ToestTime, null, false)
    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
    yield put({ type: FAILURE_WITH_DRAW_JURISDICTION })
  } else {
    Toast.info(res.msg, Config.ToestTime, null, false)
    yield put({ type: FAILURE_WITH_DRAW_JURISDICTION })
  }
}

function* rootSaga() {
  yield takeEvery(
    REQUEST_MEMBER_ASSETS_USR_FULL_DATE,
    fetchMemberAssetsUsefulDate
  )
  yield takeEvery(REQUEST_APPEND_MEMBER_ASSETS_LIST, fetchMemberAssetsList)
  yield takeEvery(REQUEST_UPDATE_MEMBER_ASSETS_LIST, fetchMemberAssetsList)
  yield takeEvery(REQUEST_MEMBER_ASSETS, fetchMemberAssets)
  yield takeEvery(REQUEST_CONVERT_REDEEM_USE, convertRedeemUse)
  yield takeEvery(REQUEST_WITH_DRAW_CONFIG, fetchWithdrawConfig) // 资产传出 基本信息
  yield takeEvery(REQUEST_WITH_DRAW_CHAIN_LIST, fetchWithdrawChainList) // 资产传出 基本信息
  yield takeEvery(REQUEST_WITH_DRAW_DEPOSIT, doTransferPayment) // 转出币
  yield takeEvery(
    REQUEST_WITH_DRAW_MOBILE_CODE_VERIFY,
    sendWithdrawCMobileCodeVerify
  ) // 转出发验证码

  yield takeEvery(REQUEST_WITH_DRAW_JURISDICTION, checkWithdrawJurisdiction) // 验证用户权限
}

export default rootSaga
