import * as ActionsTypes from '../Actions/ActionsTypes'
import UserInfo from '../../Tool/UserInfo'
import { toNumber } from 'lodash-es'
const initialState = {
  HomepageForumList: {
    // 请求主页列表
    data: [],
    status: 'new', // new running success failure
    error: false
  },
  HomepageForumPostList: {
    // 请求主页频道列表
    data: {},
    status: 'new', // new running success failure
    error: false
  },
  CurrentHomepageForumInfo: {
    //     admins: [{…}]
    // follow_count: 1
    // forum_category_name: "币圈"
    // forum_count: 1
    // forum_icon: "https://dapp.botfans.org//uploads/images/20181115/acb4befba1d631910e5497b569d5ae47.jpeg"
    // forum_id: 1
    // forum_name: "瓦力社区"
    // forum_post_count: 28
    // hot: 0
    // is_follow: 1
  }, // 当前主页的信息
  animating: true, // 切换列表
  PostListAnimating: true // 切换列表
}

// 更新列表信息
const UpdateHomepageListInfo = (HomepageForumPostList, newData) => {
  const { type, router } = newData

  if (type == 'REQUEST_DO_ADD_FOLLOW' || type == 'REQUEST_DO_CANCEL_FOLLOW') {
    const HomepageForumPostListCopy = Object.assign({}, HomepageForumPostList)
    const { post } = HomepageForumPostListCopy
    const [...postTemp] = post
    const postTempArr =
      postTemp &&
      postTemp.map(item => {
        if (item.member_id == newData.from) {
          const itemCopy = Object.assign({}, item)
          itemCopy.is_follow = !item.is_follow
          return itemCopy
        }
        return item
      })

    HomepageForumPostListCopy.post = postTempArr

    return HomepageForumPostListCopy
  } else if (type == 'DO_FOLLOW_PRAISE') {
    const HomepageForumPostListCopy = Object.assign({}, HomepageForumPostList)
    const { post } = HomepageForumPostListCopy
    const [...postTemp] = post
    const postTempArr =
      postTemp &&
      postTemp.map(item => {
        if (item.post_id == newData.post_id) {
          const itemCopy = Object.assign({}, item)
          itemCopy.is_praise = !item.is_praise
          if (itemCopy.is_praise) {
            itemCopy.praise = parseInt(item.praise) + 1
          } else {
            itemCopy.praise = parseInt(item.praise) - 1
          }

          return itemCopy
        }
        return item
      })

    HomepageForumPostListCopy.post = postTempArr

    return HomepageForumPostListCopy
  } else if (router == 'HomepagePostList') {
    const HomepageForumPostListCopy = Object.assign({}, HomepageForumPostList)
    const [...postTemp] = HomepageForumPostListCopy.post

    const dataCopy =
      postTemp &&
      postTemp.map(item => {
        if (item.post_id == newData.post_id) {
          const itemCopy = Object.assign({}, item)
          var [...reply2] = item.reply
          reply2.push({
            main_id: UserInfo.member_id,
            member_name: UserInfo.member_name,
            mobile: UserInfo.mobile,
            post_id: newData.post_id,
            reply_content: newData.content,
            reply_id: newData.reply_id
          })
          itemCopy.reply = reply2
          return itemCopy
        }
        return item
      })

    HomepageForumPostListCopy.post = dataCopy
    return HomepageForumPostListCopy
  }

  return HomepageForumPostList
}

const doAddAndCancelFollowForum = (HomepageForumList, newData) => {
  const { type } = newData
  if (type == 'REQUEST_DO_ADD_FOLLOW_FORUM') {
    const [...HomepageForumListTemp] = HomepageForumList
    const HomepageForumListTempArr =
      HomepageForumListTemp &&
      HomepageForumListTemp.map(item => {
        if (item.forum_id == newData.forum_id) {
          const itemCopy = Object.assign({}, item)
          itemCopy.is_follow = !-item.is_follow
          if (-item.is_follow) {
            itemCopy.forum_count = item.forum_count - 1
          } else {
            itemCopy.forum_count = item.forum_count + 1
          }
          return itemCopy
        }
        return item
      })
    return HomepageForumListTempArr
  }
  return HomepageForumList
}

// 添加主页列表
const appendHomepageForumList = (data, newData) => {
  const preData = data
  // 如果当前没有帖子，直接返回新数据
  if (preData.length == 0) {
    return newData
  }

  // // 追加数据的开头
  // let new_forum_id_head = newData[0].forum_id
  // // 旧数据的末尾
  // let pre_forum_id_end = preData[preData.length - 1].forum_id

  // if (pre_forum_id_end - 1 < new_forum_id_head) {
  //   // 列表有更新，旧数据的末尾和追加数据的开头有重的，去个重
  //   // 旧数据保留的个数
  //   const _pre = preData.filter(ele => ele.forum_id > new_forum_id_head)
  //   return [..._pre, ...newData]
  // } else {
  //   return [...preData, ...newData]
  // }

  return [...preData, ...newData]
}

// 添加主页频道列表
const appendHomepageForumPostList = (data, newData) => {
  const preData = data
  // 如果当前没有帖子，直接返回新数据
  if (preData.post.length == 0) {
    return newData
  }
  const preDataCopy = Object.assign({}, preData)
  const [...postTemp] = preDataCopy.post
  preDataCopy.post = [...postTemp, ...newData.post]

  // // 追加数据的开头
  // let new_forum_id_head = newData[0].forum_id
  // // 旧数据的末尾
  // let pre_forum_id_end = preData[preData.length - 1].forum_id

  // if (pre_forum_id_end - 1 < new_forum_id_head) {
  //   // 列表有更新，旧数据的末尾和追加数据的开头有重的，去个重
  //   // 旧数据保留的个数
  //   const _pre = preData.filter(ele => ele.forum_id > new_forum_id_head)
  //   return [..._pre, ...newData]
  // } else {
  //   // console.log('其他情况')
  //   return [...preData, ...newData]
  // }
  // console.log(' data, newData ', data, newData)
  return preDataCopy
}

// 前台设置置顶
const setForumPostTop = (HomepageForumList, newData) => {
  const { type } = newData
  if (type == 'REQUEST_DO_ADD_FOLLOW_FORUM') {
    const [...HomepageForumListTemp] = HomepageForumList
    const HomepageForumListTempArr =
      HomepageForumListTemp &&
      HomepageForumListTemp.map(item => {
        if (item.forum_id == newData.forum_id) {
          const itemCopy = Object.assign({}, item)
          itemCopy.is_follow = !-item.is_follow
          if (-item.is_follow) {
            itemCopy.forum_count = item.forum_count - 1
          } else {
            itemCopy.forum_count = item.forum_count + 1
          }
          return itemCopy
        }
        return item
      })

    return HomepageForumListTempArr
  }

  return HomepageForumList
}
// 更新当前主页信息
const updateCurrentHomepageForumInfo = (CurrentHomepageForumInfo, newData) => {

  // DELETE
  const { type, key } = newData
  if (type == 'REQUEST_DO_ADD_FOLLOW_FORUM') {
    const CurrentHomepageForumInfoCopy = Object.assign(
      {},
      CurrentHomepageForumInfo
    )
    CurrentHomepageForumInfoCopy.is_follow = !CurrentHomepageForumInfo.is_follow
    CurrentHomepageForumInfoCopy.forum_count = !CurrentHomepageForumInfo.is_follow
      ? CurrentHomepageForumInfo.forum_count + 1
      : CurrentHomepageForumInfo.forum_count - 1

    return CurrentHomepageForumInfoCopy
  } else if (key == 'DELETE') {
    const CurrentHomepageForumInfoCopy = Object.assign(
      {},
      CurrentHomepageForumInfo
    )
    CurrentHomepageForumInfoCopy.forum_post_count =
      CurrentHomepageForumInfo.forum_post_count - 1

    return CurrentHomepageForumInfoCopy
  }

  return CurrentHomepageForumInfo
}

const test = (HomepageForumPostList, newData) => {
  const { post_id } = newData
  const HomepageForumPostListCopy = Object.assign({}, HomepageForumPostList)
  const [...post2] = HomepageForumPostList.post
  const post2Temp = post2.filter(ele => ele.post_id != post_id)
  HomepageForumPostListCopy.post = post2Temp

  return HomepageForumPostListCopy
}

const HomepageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionsTypes.REQUEST_HOMEPAGE_FORUM_LIST: // 请求主页列表
      return {
        ...state,
        ...{
          HomepageForumList: {
            data: [],
            status: 'running',
            error: false
          },
          animating: true // 切换列表
        }
      }
    case ActionsTypes.SUCCESS_HOMEPAGE_FORUM_LIST: // 请求主页列表
      return {
        ...state,
        ...{
          HomepageForumList: {
            data: action.payload,
            status: 'success',
            error: false
          },
          animating: false // 切换列表
        }
      }
    case ActionsTypes.FAILURE_HOMEPAGE_FORUM_LIST: // 请求主页列表
      return {
        ...state,
        ...{
          HomepageForumList: {
            status: 'failure',
            error: true
          },
          animating: false // 切换列表
        }
      }

    case ActionsTypes.UPDATE_HOMEPAGE_FORUM_LIST: // 添加主页列表
      return {
        ...state,
        ...{
          HomepageForumList: {
            data: state.HomepageForumList.data,
            status: 'running',
            error: false
          },
          animating: true // 切换列表
        }
      }
    case ActionsTypes.SUCCESS_UPDATE_HOMEPAGE_FORUM_LIST: // 添加主页列表
      return {
        ...state,
        ...{
          HomepageForumList: {
            data: appendHomepageForumList(
              state.HomepageForumList.data,
              action.payload
            ),
            status: 'success',
            error: false
          },
          animating: false // 切换列表
        }
      }
    case ActionsTypes.FAILURE_UPDATE_HOMEPAGE_FORUM_LIST: // 添加主页列表
      return {
        ...state,
        ...{
          HomepageForumList: {
            status: 'failure',
            error: true
          },
          animating: false // 切换列表
        }
      }
    case ActionsTypes.SET_CURRENT_HOMEPAGE_FORUM_INFO: // 更改当前主页信息
      return {
        ...state,
        ...{
          CurrentHomepageForumInfo: action.payload,
          HomepageForumPostList: {
            // 请求主页频道列表
            data: {},
            status: 'new', // new running success failure
            error: false
          }
        }
      }

    case ActionsTypes.UPDATE_CURRENT_HOMEPAGE_FORUM_INFO: // 更改当前主页信息
      if (action.payload.key == 'DELETE') {
        return {
          ...state,
          ...{
            CurrentHomepageForumInfo: updateCurrentHomepageForumInfo(
              state.CurrentHomepageForumInfo,
              action.payload
            ),
            HomepageForumPostList: {
              data: test(state.HomepageForumPostList.data, action.payload),
              status: 'success',
              error: false
            }
          }
        }
      } else {
        return {
          ...state,
          ...{
            CurrentHomepageForumInfo: updateCurrentHomepageForumInfo(
              state.CurrentHomepageForumInfo,
              action.payload
            )
            // HomepageForumList: {
            //   data: state.HomepageForumList.data,
            //   status: 'success',
            //   error: false
            // }
          }
        }
      }

    case ActionsTypes.REQUEST_HOMEPAGE_FORUM_POST_LIST: // 请求主页频道列表
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            data: {},
            status: 'running',
            error: false
          },
          PostListAnimating: true // 切换列表
        }
      }
    case ActionsTypes.SUCCESS_HOMEPAGE_FORUM_POST_LIST: // 请求主页频道列表
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            data: action.payload,
            status: 'success',
            error: false
          },
          PostListAnimating: false // 切换列表
        }
      }
    case ActionsTypes.FAILURE_HOMEPAGE_FORUM_POST_LIST: // 请求主页频道列表
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            status: 'failure',
            error: true
          },
          PostListAnimating: false // 切换列表
        }
      }

    case ActionsTypes.UPDATE_HOMEPAGE_FORUM_POST_LIST: // 添加主页频道列表
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            data: state.HomepageForumPostList.data,
            status: 'running',
            error: false
          },
          PostListAnimating: true // 切换列表
        }
      }
    case ActionsTypes.SUCCESS_UPDATE_HOMEPAGE_FORUM_POST_LIST: // 添加主页频道列表
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            data: appendHomepageForumPostList(
              state.HomepageForumPostList.data,
              action.payload
            ),
            status: 'success',
            error: false
          },
          PostListAnimating: false // 切换列表
        }
      }
    case ActionsTypes.FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST: // 添加主页频道列表
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            status: 'failure',
            error: true
          },
          PostListAnimating: false // 切换列表
        }
      }

    case ActionsTypes.UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO: // 更新信息请求主页频道列表
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            data: state.HomepageForumPostList.data,
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO: // 更新信息请求主页频道列表
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            data: UpdateHomepageListInfo(
              state.HomepageForumPostList.data,
              action.payload
            ),
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO: // 更新信息请求主页频道列表
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            status: 'failure',
            error: true
          }
        }
      }

    // case ActionsTypes.REQUEST_DO_CANCEL_FOLLOW_FORUM: // 关注论坛和取消关注
    //   return {
    //     ...state,
    //     ...{
    //       HomepageForumList: {
    //         data: state.HomepageForumList.data,
    //         status: 'running',
    //         error: false
    //       }
    //     }
    //   }
    // case ActionsTypes.SUCCESS_DO_CANCEL_FOLLOW_FORUM: // 关注论坛和取消关注
    //   return {
    //     ...state,
    //     ...{
    //       HomepageForumList: {
    //         data: test(state.HomepageForumList.data, action.payload),
    //         status: 'success',
    //         error: false
    //       }
    //     }
    //   }
    // case ActionsTypes.FAILURE_DO_CANCEL_FOLLOW_FORUM: // 关注论坛和取消关注
    //   return {
    //     ...state,
    //     ...{
    //       HomepageForumList: {
    //         status: 'failure',
    //         error: true
    //       }
    //     }
    //   }

    case ActionsTypes.REQUEST_DO_ADD_FOLLOW_FORUM: // 关注论坛和取消关注
      return {
        ...state,
        ...{
          HomepageForumList: {
            data: state.HomepageForumList.data,
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_DO_ADD_FOLLOW_FORUM: // 关注论坛和取消关注
      return {
        ...state,
        ...{
          HomepageForumList: {
            data: doAddAndCancelFollowForum(
              state.HomepageForumList.data,
              action.payload
            ),
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_DO_ADD_FOLLOW_FORUM: // 关注论坛和取消关注
      return {
        ...state,
        ...{
          HomepageForumList: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.SET_FORUM_POST_TOP: // 前台设置置顶
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            data: state.HomepageForumList.data,
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_SET_FORUM_POST_TOP: // 前台设置置顶
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            data: setForumPostTop(state.HomepageForumList.data, action.payload),
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_SET_FORUM_POST_TOP: // 前台设置置顶
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.SET_FORUM_POST_BOUTIQUE: // 前台设置加精
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            data: state.HomepageForumList.data,
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_SET_FORUM_POST_BOUTIQUE: // 前台设置加精
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            data: setForumPostTop(state.HomepageForumList.data, action.payload),
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_SET_FORUM_POST_BOUTIQUE: // 前台设置加精
      return {
        ...state,
        ...{
          HomepageForumPostList: {
            status: 'failure',
            error: true
          }
        }
      }

    default:
      return state
  }
}

export default HomepageReducer
