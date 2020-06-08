import * as ActionsTypes from '../Actions/ActionsTypes'
const initialState = {
  memberAssetsUsefulDate: {
    // 获取有资产的月份数组
    data: [],
    status: 'new', // new running success failure
    error: false
  },
  memberAssetsList: {
    // 资产列表
    data: [],
    extra: '', // 当前月份
    isEndPage: false, // 是否为最后一页
    status: 'new', // new running success failure
    error: false
  },
  MemberAssets: {
    // 资产币种列表
    data: [],
    status: 'new', // new running success failure
    error: false
  },
  Sunline: {
    // 个人资产收支记录
    data: [],
    status: 'new', // new running success failure
    error: false
  },
  RedeemCode: {
    // 兑换码
    status: 'new', // new running success failure
    error: false
  },
  withdrawConfig: {
    // 资产传出 基本信息
    data: {},
    status: 'new', // new running success failure
    error: false
  },
  ChainList: {
    // 转出方式列表
    data: [],
    status: 'new', // new running success failure
    error: false
  },
  withdrawDeposit: {
    // 转出币
    data: [],
    status: 'new', // new running success failure
    error: false
  },
  withdrawCMobileCodeVerify: {
    // 转出发验证码
    data: {},
    status: 'new', // new running success failure
    error: false
  },
  withdrawJurisdiction: {
    // 验证用户权限
    data: { Jurisdiction: false ,msg:''},
    status: 'new', // new running success failure
    error: false
  }
}

/**
 * 更新资产列表数据
 * @param {*} data
 * @param {*} newData
 */
const upDateMemberAssets = (data, newData) => {
  const dataCopy =
    data &&
    data.map(item => {
      if (item.currency_id === newData.currency_id) {
        const itemCopy = Object.assign({}, item)
        itemCopy.value = newData.balance
        return itemCopy
      }
      return item
    })
  return dataCopy
}

const test = (data, newData) => {
  return []
}

const memberAssetsState = (state = initialState, action) => {
  switch (action.type) {
    case ActionsTypes.REQUEST_MEMBER_ASSETS_USR_FULL_DATE: // 获取有资产的月份数组
      return {
        ...state,
        ...{
          memberAssetsUsefulDate: {
            status: 'running',
            error: false
          },
          memberAssetsList: {
            // 资产列表
            data: [],
            extra: '', // 当前月份
            isEndPage: false, // 是否为最后一页
            status: 'new', // new running success failure
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_MEMBER_ASSETS_USR_FULL_DATE: // 获取有资产的月份数组
      return {
        ...state,
        ...{
          memberAssetsUsefulDate: {
            data: action.payload,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_MEMBER_ASSETS_USR_FULL_DATE: // 获取有资产的月份数组
      return {
        ...state,
        ...{
          memberAssetsUsefulDate: {
            status: 'failure',
            error: true
          }
        }
      }
    case ActionsTypes.REQUEST_MEMBER_ASSETS_LIST: // 资产列表
      return {
        ...state,
        ...{
          memberAssetsList: {
            data: state.memberAssetsList.data,
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_MEMBER_ASSETS_LIST: // 资产列表
      return {
        ...state,
        ...{
          memberAssetsList: {
            data: [...state.memberAssetsList.data, ...action.payload],
            isEndPage: !action.payload.length,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_MEMBER_ASSETS_LIST: // 资产列表
      return {
        ...state,
        ...{
          memberAssetsList: {
            status: 'failure',
            error: true
          }
        }
      }
    case ActionsTypes.REQUEST_UPDATE_MEMBER_ASSETS_LIST: // 更新资产列表
      return {
        ...state,
        ...{
          memberAssetsList: {
            data: [],
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_UPDATE_MEMBER_ASSETS_LIST: // 更新资产列表
      return {
        ...state,
        ...{
          memberAssetsList: {
            data: action.payload.data,
            isEndPage: !action.payload.data.length,
            extra: action.payload.extra,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_UPDATE_MEMBER_ASSETS_LIST: // 更新资产列表
      return {
        ...state,
        ...{
          memberAssetsList: {
            status: 'failure',
            error: true
          }
        }
      }
    case ActionsTypes.REQUEST_APPEND_MEMBER_ASSETS_LIST: // 添加资产列表
      return {
        ...state,
        ...{
          memberAssetsList: {
            data: state.memberAssetsList.data,
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_APPEND_MEMBER_ASSETS_LIST: // 添加资产列表
      return {
        ...state,
        ...{
          memberAssetsList: {
            data: [...state.memberAssetsList.data, ...action.payload.data],
            isEndPage: !action.payload.data.length,
            extra: action.payload.extra,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_APPEND_MEMBER_ASSETS_LIST: // 添加资产列表
      return {
        ...state,
        ...{
          memberAssetsList: {
            status: 'failure',
            error: true
          }
        }
      }
    case ActionsTypes.REQUEST_MEMBER_ASSETS: // 资产币种列表
      return {
        ...state,
        ...{
          MemberAssets: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_MEMBER_ASSETS: // 资产币种列表
      return {
        ...state,
        ...{
          MemberAssets: {
            data: action.payload,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_MEMBER_ASSETS: // 资产币种列表
      return {
        ...state,
        ...{
          MemberAssets: {
            status: 'failure',
            error: true
          }
        }
      }
    case ActionsTypes.REQUEST_CONVERT_REDEEM_USE: // 兑换 兑换码
      return {
        ...state,
        ...{
          RedeemCode: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_CONVERT_REDEEM_USE: // 兑换 兑换码
      return {
        ...state,
        ...{
          RedeemCode: {
            status: 'success',
            error: false
          },
          MemberAssets: {
            data: upDateMemberAssets(state.MemberAssets.data, action.payload),
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_CONVERT_REDEEM_USE: // 兑换 兑换码
      return {
        ...state,
        ...{
          RedeemCode: {
            status: 'failure',
            error: true
          }
        }
      }
    case ActionsTypes.REQUEST_WITH_DRAW_CONFIG: // 资产传出 基本信息
      return {
        ...state,
        ...{
          withdrawConfig: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_WITH_DRAW_CONFIG: // 资产传出 基本信息
      return {
        ...state,
        ...{
          withdrawConfig: {
            data: action.payload,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_WITH_DRAW_CONFIG: // 资产传出 基本信息
      return {
        ...state,
        ...{
          withdrawConfig: {
            status: 'failure',
            error: true
          }
        }
      }
    case ActionsTypes.REQUEST_WITH_DRAW_CHAIN_LIST: // 转出方式列表
      return {
        ...state,
        ...{
          ChainList: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_WITH_DRAW_CHAIN_LIST: // 转出方式列表
      return {
        ...state,
        ...{
          ChainList: {
            data: action.payload,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_WITH_DRAW_CHAIN_LIST: // 转出方式列表
      return {
        ...state,
        ...{
          ChainList: {
            status: 'failure',
            error: true
          }
        }
      }
    case ActionsTypes.REQUEST_WITH_DRAW_DEPOSIT: // 转出币
      return {
        ...state,
        ...{
          withdrawDeposit: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_WITH_DRAW_DEPOSIT: // 转出币
      return {
        ...state,
        ...{
          withdrawDeposit: {
            data: action.payload,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_WITH_DRAW_DEPOSIT: // 转出币
      return {
        ...state,
        ...{
          withdrawDeposit: {
            status: 'failure',
            error: true
          }
        }
      }
    case ActionsTypes.REQUEST_WITH_DRAW_MOBILE_CODE_VERIFY: // 转出发验证码
      return {
        ...state,
        ...{
          withdrawCMobileCodeVerify: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_WITH_DRAW_MOBILE_CODE_VERIFY: // 转出发验证码
      return {
        ...state,
        ...{
          withdrawCMobileCodeVerify: {
            data: action.payload,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_WITH_DRAW_MOBILE_CODE_VERIFY: // 转出发验证码
      return {
        ...state,
        ...{
          withdrawCMobileCodeVerify: {
            status: 'failure',
            error: true
          }
        }
      }
    case ActionsTypes.REQUEST_WITH_DRAW_JURISDICTION: // 验证用户权限
      return {
        ...state,
        ...{
          withdrawJurisdiction: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_WITH_DRAW_JURISDICTION: // 验证用户权限
      return {
        ...state,
        ...{
          withdrawJurisdiction: {
            data: action.payload,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_WITH_DRAW_JURISDICTION: // 验证用户权限
      return {
        ...state,
        ...{
          withdrawJurisdiction: {
            status: 'failure',
            error: true
          }
        }
      }
    default:
      return state
  }
}

export default memberAssetsState
