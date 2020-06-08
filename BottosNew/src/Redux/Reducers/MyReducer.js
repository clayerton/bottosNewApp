import * as ActionsTypes from '../Actions/ActionsTypes'
const initialState = {
  userInfo: {
    avatar_thumb: '',     // 头像
    btos: '',             // bto数量
    exp: 0,               // 经验
    follow_me_count: 0,   // 粉丝数
    hashrate: 0,          // 阳光值
    is_admin: 0,          // 是否管理员，0 不是 1 是
    is_black: 0,          //是否在黑名单 0 不在  1 在
    member_id: 0,         // id
    member_name: '',      // 昵称
    rank: 0,              // 注册排名
    recommend_sn: '',     // 邀请码
    regdate: 0,           // 注册时间
    tag: {}               //徽章
  },
  userInfoStatus: 'success', // 请求关注列表 running success failure
  userInfoError: false,
  followListData: [],
  followListStatus: 'running', // 请求关注列表 running success failure
  followListError: false,
  followListPageCount: 0,
  followListPage: 0,
  isFollow: false, // false 没有关注  true 已关注
  cancelFollowStatus: 'success', // 取消关注 running success failure
  cancelFollowError: false,
  addFollowStatus: 'success', // 添加关注 running success failure
  addFollowError: false,
  checkIsFollowStatus: 'success', // 检查是否关注了当前用户 running success failure
  checkIsFollowError: false,
  // blacklist
}

const doAddAndCancelFollow = (data, payload) => {
  const index = data.findIndex((ele) => ele.member_id == payload.from)
    const targetPostDetail = data[index]
    const newPostDetail = { ...targetPostDetail, is_follow:payload.is_follow}
    const _fansListData = data.slice(0)
    _fansListData[index] = newPostDetail
    if(!payload.hasOwnProperty('isFollowMe') ){
      if(payload.mobile === payload.myMobile){
        _fansListData.splice(index, 1)
      }
    }
    
    return _fansListData


  // return data.map(item => {
  //   if (item.member_id == payload.from) {
  //     // const tempItem = Object.assign({}, item)
  //     item.isFollow = !item.isFollow
  //   }
  //   return item
  // })



  // const tempData = Object.assign([], data)
  // let id = 0
  // tempData.map((item, index) => {
  //   if (item.member_id == payload.from) {
  //     const tempItem = Object.assign({}, item)
  //     tempItem.is_follow = !tempItem.is_follow
  //     id = index
  //     return tempItem
  //   }
  //   return item
  // })
  // // tempData.splice(id, 1)
  // return tempData
}




const checkIsFollow = data => {
  const { code } = data
  if (code === '0') {
    return true
  } else if (code === '-1') {
    return false
  }
  return false
}

const test = data => {
  return false
}
const myState = (state = initialState, action) => {
  switch (action.type) {
    case ActionsTypes.REQUEST_PERSONAL_PORTRAIT: // 获取个人画像信息
    return {
      ...state,
      ...{
        userInfoStatus: 'running',
        userInfoError: false
      }
    }
  case ActionsTypes.SUCCESS_PERSONAL_PORTRAIT: // 获取个人画像信息
    return {
      ...state,
      ...{
        userInfo: action.payload,
        userInfoStatus: 'success',
        userInfoError: false
      }
    }
  case ActionsTypes.FAILURE_PERSONAL_PORTRAIT: // 获取个人画像信息
    return {
      ...state,
      ...{
        userInfoStatus: 'failure',
        userInfoError: true
      }
    }

    case ActionsTypes.REQUEST_UPDATE_FOLLOW_LIST: // 更新我的关注列表的数据
      return {
        ...state,
        ...{
          followListStatus: 'running',
          followListError: false
        }
      }
    case ActionsTypes.SUCCESS_UPDATE_FOLLOW_LIST: // 更新我的关注列表的数据
      return {
        ...state,
        ...{
          followListData: action.payload.followListData,
          followListPageCount: action.payload.page_count,
          followListPage: action.payload.page,
          followListStatus: 'success',
          followListError: false
        }
      }
    case ActionsTypes.FAILURE_UPDATE_FOLLOW_LIST: // 更新我的关注列表的数据
      return {
        ...state,
        ...{
          followListStatus: 'failure',
          followListError: true
        }
      }
    case ActionsTypes.REQUEST_APPEND_FOLLOW_LIST: // 添加关注我的列表的数据
      return {
        ...state,
        ...{
          followListStatus: 'running',
          followListError: false
        }
      }
    case ActionsTypes.SUCCESS_APPEND_FOLLOW_LIST: // 添加关注我的列表的数据
      return {
        ...state,
        ...{
          followListData: [
            ...state.followListData,
            ...action.payload.followListData
          ],
          followListPageCount: action.payload.page_count,
          followListPage: action.payload.page,
          followListStatus: 'success',
          followListError: false
        }
      }
    case ActionsTypes.FAILURE_APPEND_FOLLOW_LIST: // 添加关注我的列表的数据
      return {
        ...state,
        ...{
          followListStatus: 'failure',
          followListError: true
        }
      }
    case ActionsTypes.REQUEST_DO_CANCEL_FOLLOW: // 取消关注
      return {
        ...state,
        ...{
          cancelFollowStatus: 'running',
          cancelFollowError: false
        }
      }
    case ActionsTypes.SUCCESS_DO_CANCEL_FOLLOW: // 取消关注
      return {
        ...state,
        ...{
          followListData: doAddAndCancelFollow(
            state.followListData,
            action.payload
          ),
          isFollow: false,
          cancelFollowStatus: 'success',
          cancelFollowError: false
        }
      }
    case ActionsTypes.FAILURE_DO_CANCEL_FOLLOW: // 取消关注
      return {
        ...state,
        ...{
          cancelFollowStatus: 'failure',
          cancelFollowError: true
        }
      }
    case ActionsTypes.REQUEST_DO_ADD_FOLLOW: // 添加关注
      return {
        ...state,
        ...{
          addFollowStatus: 'running',
          addFollowError: false
        }
      }
    case ActionsTypes.SUCCESS_DO_ADD_FOLLOW: // 添加关注
      return {
        ...state,
        ...{
          followListData: doAddAndCancelFollow(
            state.followListData,
            action.payload
          ),
          isFollow: true,
          addFollowStatus: 'success',
          addFollowError: false
        }
      }
    case ActionsTypes.FAILURE_DO_ADD_FOLLOW: // 添加关注
      return {
        ...state,
        ...{
          addFollowStatus: 'failure',
          addFollowError: true
        }
      }
    case ActionsTypes.REQUEST_CHECK_IS_FOLLOW: // 检查是否已经关注当前用户
      return {
        ...state,
        ...{
          isFollow: false,
          checkIsFollowStatus: 'running',
          checkIsFollowError: false
        }
      }
    case ActionsTypes.SUCCESS_CHECK_IS_FOLLOW: // 检查是否已经关注当前用户
      return {
        ...state,
        ...{
          isFollow: checkIsFollow(action.payload),
          checkIsFollowStatus: 'success',
          checkIsFollowError: false
        }
      }
    case ActionsTypes.FAILURE_CHECK_IS_FOLLOW: // 检查是否已经关注当前用户
      return {
        ...state,
        ...{
          checkIsFollowStatus: 'failure',
          checkIsFollowError: true
        }
      }
    case ActionsTypes.REQUEST_PUT_ON_BLACKLIST: // 加入黑名单
      return {
        ...state,
        ...{
          checkIsFollowStatus: 'running',
          checkIsFollowError: false
        }
      }
    case ActionsTypes.SUCCESS_PUT_ON_BLACKLIST: // 加入黑名单
      return {
        ...state,
        ...{
          checkIsFollowStatus: 'success',
          checkIsFollowError: false
        }
      }
    case ActionsTypes.FAILURE_PUT_ON_BLACKLIST: // 加入黑名单
      return {
        ...state,
        ...{
          checkIsFollowStatus: 'failure',
          checkIsFollowError: true
        }
      }

    default:
      return state
  }
}

export default myState
