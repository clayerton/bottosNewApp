import * as ActionsTypes from '../Actions/ActionsTypes'
import UserInfo from '../../Tool/UserInfo'
import { toNumber } from 'lodash-es'
const initialState = {
  CurrentMenuOption: {
    // 当前选择菜单的项 TODO:
    data: {
      option_id: 2,
      option_name: '推荐',
      key: 'recommend'
    },
    status: 'new', // new running success failure
    error: false
  },
  PostTopPost: {
    // 置顶的数据详情
    data: [],
    status: 'new', // new running success failure
    error: false
  },
  HomePageList: {
    // 菜单栏数据
    data: [],
    status: 'new', // new running success failure
    error: false
  },
  HomePageContentList: {
    // 更新主页帖子列表
    data: [],
    isLastPage: false,
    status: 'new', // new running success failure
    error: false
  },
  HomePageContentRecommendList: {
    // 更新推荐帖子列表
    data: {},
    isLastPage: false,

    status: 'new', // new running success failure
    error: false
  },

  PraiseStatus: {
    // 更新主页帖子列表
    data: [],
    status: 'new', // new running success failure
    error: false
  },
  FollowStatus: {
    data: [],
    status: 'new', // new running success failure
    error: false
  },
  CommentInputVisible: {
    // 评论框的展示
    data: false,
    status: 'new', // new running success failure
    error: false
  },
  targetPostId: -1, // 回复的目标帖子 ID
  routeName: 'Community', // 这个是记录路由名的，是为了让输入框感知
  follow_id: -1, // 回复的目标的 ID
  UnreadMessage: {
    // 评论框的展示
    data: {},
    status: 'new', // new running success failure
    error: false
  },
  sendFollowPost: {
    // 回帖
    data: {},
    status: 'new', // new running success failure
    error: false
  },
  PostDetail: {
    // 帖子详情
    data: {},
    status: 'new', // new running success failure
    error: false
  },
  DeletePost: {
    // 删除帖子
    data: {},
    status: 'new', // new running success failure
    error: false
  },
  PostReadCount: {
    // 帖子阅读数
    status: 'new', // new running success failure
    error: false
  },
  setTargetPostId: {},
  animating: true // 切换列表
}

// 点赞
const changePraiseStatus = ({ data }, newData, PostDetail) => {
  PostDetail = PostDetail.data
  if (newData.router == 'OnePost') {
    const PostDetailCopy = Object.assign({}, PostDetail)
    PostDetailCopy.is_praise = !PostDetail.is_praise

    if (PostDetailCopy.is_praise) {
      PostDetailCopy.praise = parseInt(PostDetailCopy.praise) + 1
    } else {
      PostDetailCopy.praise = parseInt(PostDetailCopy.praise) - 1
    }

    return PostDetailCopy
  } else {
    const dataCopy =
      data &&
      data.map(item => {
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
    return dataCopy
  }
}

// 添加取消关注更改列表样式
const changeFollowStatus = ({ data }, newData, PostDetail) => {
  PostDetail = PostDetail.data
  if (newData.router == 'OnePost') {
    const PostDetailCopy = Object.assign({}, PostDetail)
    PostDetailCopy.is_follow = !PostDetail.is_follow
    return PostDetailCopy
  } else {
    const dataCopy =
      data &&
      data.map(item => {
        if (item.member_id == newData.from) {
          const itemCopy = Object.assign({}, item)
          itemCopy.is_follow = !item.is_follow
          return itemCopy
        }
        return item
      })
    return dataCopy
  }
}

// 帖子列表
const appendHomePageContentList = ({ data }, newData) => {
  const preData = data
  // 如果当前没有帖子，直接返回新数据
  if (preData.length == 0) {
    return newData
  }

  if (newData.length == 0) {
    return preData
  }
  // 追加数据的开头
  let new_post_id_head = newData[0].post_id
  // 旧数据的末尾
  let pre_post_id_end = preData[preData.length - 1].post_id

  if (pre_post_id_end - 1 < new_post_id_head) {
    // 列表有更新，旧数据的末尾和追加数据的开头有重的，去个重
    // 旧数据保留的个数
    const _pre = preData.filter(ele => ele.post_id > new_post_id_head)
    return [..._pre, ...newData]
  } else {
    return [...preData, ...newData]
  }
}

// 添加推荐帖子列表
const appendHomePageContentRecommendList = ({ data }, newData) => {
  let dataTemp = []
  for (const key in newData) {
    if (newData.hasOwnProperty(key)) {
      const element = newData[key]
      if (key == 'post') {
        dataTemp = element
      }
    }
  }

  const preData = data
  // 如果当前没有帖子，直接返回新数据
  if (preData.length == 0) {
    return dataTemp
  }

  // 追加数据的开头
  let new_post_id_head = dataTemp[0].post_id
  // 旧数据的末尾
  let pre_post_id_end = preData[preData.length - 1].post_id

  if (pre_post_id_end - 1 < new_post_id_head) {
    // 列表有更新，旧数据的末尾和追加数据的开头有重的，去个重
    // 旧数据保留的个数
    const _pre = preData.filter(ele => ele.post_id > new_post_id_head)
    return [..._pre, ...dataTemp]
  } else {
    return [...preData, ...dataTemp]
  }
}

/**
 * 请求推荐帖子列表
 * @param {*} data
 */
const updateHomePageContentRecommendList = data => {
  let dataTemp = []
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key]
      if (key == 'post') {
        dataTemp = element
      }
    }
  }

  return dataTemp
}

/**
 * 改变当前目标菜单
 * @param {*} CurrentMenuOption
 * @param {*} newCurrentMenuOption
 * @param {*} HomePageContentList
 */
const changeCurrentMenuOption = (
  CurrentMenuOption,
  newCurrentMenuOption,
  HomePageContentList
) => {
  if (CurrentMenuOption.data.key == newCurrentMenuOption.key) {
    return HomePageContentList.data
  } else {
    return []
  }
}

/**
 * 回复帖子
 * @param {*} param0
 * @param {*} newData
 * @param {*} PostDetail
 */
const updateMainCommentList = ({ data }, newData, PostDetail) => {
  if (newData.router == 'OnePost') {
    const PostDetailCopy = Object.assign({}, PostDetail)
    var [...reply2] = PostDetailCopy.reply
    reply2.push({
      avatar_thumb: UserInfo.avatar_thumb,
      main_id: UserInfo.member_id,
      member_name: UserInfo.member_name,
      mobile: UserInfo.mobile,
      post_id: newData.post_id,
      reply_content: newData.content,
      reply_id: newData.reply_id
    })
    PostDetailCopy.reply = reply2
    return PostDetailCopy
  } else {
    const dataCopy =
      data &&
      data.map(item => {
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
    return dataCopy
  }
}

/**
 * 回复评论
 * @param {*} param0
 * @param {*} newData
 * @param {*} setTargetPostId
 * @param {*} PostDetail
 */
const updateMainCommentReplyList = (
  { data },
  newData,
  setTargetPostId,
  PostDetail
) => {
  PostDetail = PostDetail.data
  const { router } = newData
  if (router == 'OnePost') {
    const PostDetailCopy = Object.assign({}, PostDetail)
    var [...reply2] = PostDetailCopy.reply
    reply2.push({
      avatar_thumb: UserInfo.avatar_thumb,
      follow_mobile: setTargetPostId.mobile,
      follow_name: setTargetPostId.member_name,
      reply_follow_id: -newData.follow_id,
      main_id: UserInfo.member_id,
      member_name: UserInfo.member_name,
      mobile: UserInfo.mobile,
      post_id: -newData.post_id,
      reply_content: newData.content,
      reply_id: newData.reply_id
    })
    PostDetailCopy.reply = reply2
    return PostDetailCopy
  } else {
    const dataCopy =
      data &&
      data.map(item => {
        if (item.post_id == newData.post_id) {
          const itemCopy = Object.assign({}, item)
          var [...reply2] = item.reply
          reply2.push({
            follow_id: -newData.follow_id,
            follow_mobile: setTargetPostId.mobile,
            follow_name: setTargetPostId.member_name,
            reply_follow_id: -newData.follow_id,
            main_id: UserInfo.member_id,
            member_name: UserInfo.member_name,
            mobile: UserInfo.mobile,
            post_id: -newData.post_id,
            reply_content: newData.content,
            reply_id: newData.reply_id
          })
          itemCopy.reply = reply2
          return itemCopy
        }
        return item
      })
    return dataCopy
  }
}

/**
 * 删除帖子
 * @param {*} HomePageContentList
 * @param {*} newData
 * @param {*} PostDetail
 */
const doDeletePost = (HomePageContentList, newData, PostDetail) => {
  const { post_id, reply_id, currentPostID, router } = newData

  if (router == 'OnePost') {
    const PostDetailCopy = Object.assign({}, PostDetail)
    const [...reply2] = PostDetailCopy.reply
    const reply2Temp = reply2.filter(ele => ele.reply_id != reply_id)
    PostDetailCopy.reply = reply2Temp
    return PostDetailCopy
  } else {
    if (post_id) {
      const HomePageContentListCopy = HomePageContentList.filter(
        ele => ele.post_id != newData.post_id
      )
      return HomePageContentListCopy
    } else if (reply_id) {
      const HomePageContentListTemp = HomePageContentList.map(item => {
        if (item.post_id == currentPostID) {
          const itemCopy = Object.assign({}, item)
          const [...reply2] = itemCopy.reply
          const reply2Temp = reply2.filter(ele => ele.reply_id != reply_id)
          itemCopy.reply = reply2Temp
          return itemCopy
        }
        return item
      })
      return HomePageContentListTemp
    }
  }

  // return HomePageContentList
}

// 删除详情评论更新主页评论
const doDeletePostReplyUpdateHomePageContentList = (
  HomePageContentList,
  newData,
  PostDetail
) => {
  const { reply_id, currentPostID } = newData
  const HomePageContentListTemp = HomePageContentList.map(item => {
    if (item.post_id == currentPostID) {
      const itemCopy = Object.assign({}, item)
      const [...reply2] = itemCopy.reply
      const reply2Temp = reply2.filter(ele => ele.reply_id != reply_id)
      itemCopy.reply = reply2Temp

      return itemCopy
    }
    return item
  })

  return HomePageContentListTemp
}

/**
 * 统计帖子阅读数
 * @param {*} data
 */
const doPostReadCount = data => {
  const dataCopy = Object.assign({}, data)
  dataCopy.read_count = dataCopy.read_count + 1
  return dataCopy
}

const test = ({ data }, newData) => {
  const dataCopy = Object.assign({}, data)
  dataCopy.read_count = dataCopy.read_count + 1
  return dataCopy
}

const CommunityPostState = (state = initialState, action) => {
  switch (action.type) {
    case ActionsTypes.DO_SAVE_CURRENT_MENU_OPTION: // 当前选择菜单的项
      return {
        ...state,
        ...{
          CurrentMenuOption: {
            data: state.CurrentMenuOption.data,
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_SAVE_CURRENT_MENU_OPTION: // 当前选择菜单的项
      return {
        ...state,
        ...{
          CurrentMenuOption: {
            data: action.payload,
            status: 'success',
            error: false
          },
          HomePageContentList: {
            data: changeCurrentMenuOption(
              state.CurrentMenuOption,
              action.payload,
              state.HomePageContentList
            ),
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_SAVE_CURRENT_MENU_OPTION: // 当前选择菜单的项
      return {
        ...state,
        ...{
          CurrentMenuOption: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.TOGGLE_COMMENT_INPUT_VISIBLE: // 输入框和键盘的弹出
      return {
        ...state,
        ...{
          CommentInputVisible: {
            data: state.CommentInputVisible.data,
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_TOGGLE_COMMENT_INPUT_VISIBLE: // 输入框和键盘的弹出
      return {
        ...state,
        ...{
          CommentInputVisible: {
            data: !state.CommentInputVisible.data,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_TOGGLE_COMMENT_INPUT_VISIBLE: // 输入框和键盘的弹出
      return {
        ...state,
        ...{
          CommentInputVisible: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.SET_TARGET_POSTID: // 设置目标帖子
      return {
        ...state,
        targetPostId: action.payload && action.payload.post_id,
        follow_id: action.payload && action.payload.member_id,
        setTargetPostId: action.payload
      }

    case ActionsTypes.REQUEST_POST_TOP_POST: // 置顶的数据详情
      return {
        ...state,
        ...{
          PostTopPost: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_POST_TOP_POST: // 置顶的数据详情
      return {
        ...state,
        ...{
          PostTopPost: {
            data: action.payload,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_POST_TOP_POST: // 置顶的数据详情
      return {
        ...state,
        ...{
          PostTopPost: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.REQUEST_HOMEPAGE_LIST: // 菜单栏数据
      return {
        ...state,
        ...{
          HomePageList: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_HOMEPAGE_LIST: // 菜单栏数据
      return {
        ...state,
        ...{
          HomePageList: {
            data: action.payload,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_HOMEPAGE_LIST: // 菜单栏数据
      return {
        ...state,
        ...{
          HomePageList: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.UPDATE_HOME_PAGE_CONTENT: // 更新主页帖子列表
      return {
        ...state,
        ...{
          HomePageContentList: {
            isLastPage: false,

            status: 'running',
            error: false
          },
          animating: true
        }
      }
    case ActionsTypes.SUCCESS_HOME_PAGE_CONTENT: // 更新主页帖子列表
      return {
        ...state,
        ...{
          HomePageContentList: {
            data: action.payload,
            isLastPage: !action.payload.length ? true : false,
            status: 'success',
            error: false
          },
          animating: false
        }
      }
    case ActionsTypes.FAILURE_HOME_PAGE_CONTENT: // 更新主页帖子列表
      return {
        ...state,
        ...{
          HomePageContentList: {
            isLastPage: false,
            status: 'failure',
            error: true
          },
          animating: false
        }
      }

    case ActionsTypes.REQUEST_POST_DETAIL: // 帖子详情
      return {
        ...state,
        ...{
          PostDetail: {
            // data:{},
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_POST_DETAIL: // 帖子详情
      return {
        ...state,
        ...{
          PostDetail: {
            data: action.payload,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_POST_DETAIL: // 帖子详情
      return {
        ...state,
        ...{
          PostDetail: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.APPEND_HOME_PAGE_CONTENT: // 添加帖子列表
      return {
        ...state,
        ...{
          HomePageContentList: {
            data: state.HomePageContentList.data,
            isLastPage: false,
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_APPEND_HOME_PAGE_CONTENT: // 添加帖子列表
      return {
        ...state,
        ...{
          HomePageContentList: {
            data: appendHomePageContentList(
              state.HomePageContentList,
              action.payload
            ),
            isLastPage: !action.payload.length ? true : false,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_APPEND_HOME_PAGE_CONTENT: // 添加帖子列表
      return {
        ...state,
        ...{
          HomePageContentList: {
            isLastPage: false,
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.UPDATE_HOME_PAGE_CONTENT_RECOMMEND: // 请求推荐帖子列表
      return {
        ...state,
        ...{
          HomePageContentRecommendList: {
            // data: state.HomePageContentRecommendList.data,
            status: 'running',
            error: false
          },
          animating: true
        }
      }
    case ActionsTypes.SUCCESS_UPDATE_HOME_PAGE_CONTENT_RECOMMEND: // 请求推荐帖子列表
      return {
        ...state,
        ...{
          HomePageContentRecommendList: {
            // data: test(action.payload),
            status: 'success',
            error: false
          },
          HomePageContentList: {
            data: updateHomePageContentRecommendList(action.payload),
            status: 'success',
            error: false
          },
          animating: false
        }
      }
    case ActionsTypes.FAILURE_UPDATE_HOME_PAGE_CONTENT_RECOMMEND: // 请求推荐帖子列表
      return {
        ...state,
        ...{
          HomePageContentRecommendList: {
            status: 'failure',
            error: true
          },
          animating: false
        }
      }

    case ActionsTypes.APPEND_HOME_PAGE_CONTENT_RECOMMEND: // 添加推荐帖子列表
      return {
        ...state,
        ...{
          HomePageContentList: {
            data: state.HomePageContentList.data,
            status: 'running',
            error: false
          },
          HomePageContentRecommendList: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_APPEND_HOME_PAGE_CONTENT_RECOMMEND: // 添加推荐帖子列表
      return {
        ...state,
        ...{
          HomePageContentList: {
            data: appendHomePageContentRecommendList(
              state.HomePageContentList,
              action.payload
            ),
            status: 'success',
            error: false
          },
          HomePageContentRecommendList: {
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_APPEND_HOME_PAGE_CONTENT_RECOMMEND: // 添加推荐帖子列表
      return {
        ...state,
        ...{
          HomePageContentList: {
            status: 'failure',
            error: true
          },
          HomePageContentRecommendList: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.DO_FOLLOW_PRAISE: // 点赞
      return {
        ...state,
        ...{
          PraiseStatus: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_FOLLOW_PRAISE: // 点赞
      if (action.payload.router == 'OnePost') {
        return {
          ...state,
          ...{
            PostDetail: {
              data: changePraiseStatus(
                state.HomePageContentList,
                action.payload,
                state.PostDetail
              ),
              status: 'success',
              error: false
            },
            PraiseStatus: {
              status: 'success',
              error: false
            }
          }
        }
      } else {
        return {
          ...state,
          ...{
            HomePageContentList: {
              data: changePraiseStatus(
                state.HomePageContentList,
                action.payload,
                state.PostDetail
              ),
              status: 'success',
              error: false
            },
            PraiseStatus: {
              status: 'success',
              error: false
            }
          }
        }
      }

    case ActionsTypes.FAILURE_FOLLOW_PRAISE: // 点赞
      return {
        ...state,
        ...{
          PraiseStatus: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.UPDATE_DO_FOLLOW_FOLLOW: // 添加取消关注更改列表样式
      return {
        ...state,
        ...{
          FollowStatus: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_UPDATE_DO_FOLLOW_FOLLOW: // 添加取消关注更改列表样式
      if (action.payload.router == 'OnePost') {
        return {
          ...state,
          ...{
            PostDetail: {
              data: changeFollowStatus(
                state.HomePageContentList,
                action.payload,
                state.PostDetail
              ),
              status: 'success',
              error: false
            },
            PraiseStatus: {
              status: 'success',
              error: false
            }
          }
        }
      } else {
        return {
          ...state,
          ...{
            HomePageContentList: {
              data: changeFollowStatus(
                state.HomePageContentList,
                action.payload,
                state.PostDetail
              ),
              status: 'success',
              error: false
            },
            FollowStatus: {
              status: 'success',
              error: false
            }
          }
        }
      }

    case ActionsTypes.FAILURE_UPDATE_DO_FOLLOW_FOLLOW: // 添加取消关注更改列表样式
      return {
        ...state,
        ...{
          FollowStatus: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.UPDATE_UNREAD_MESSAGE: // 修改样式更新未读消息
      return {
        ...state,
        ...{
          UnreadMessage: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_UPDATE_UNREAD_MESSAGE: // 修改样式更新未读消息
      return {
        ...state,
        ...{
          UnreadMessage: {
            data: action.payload,
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_UPDATE_UNREAD_MESSAGE: // 修改样式更新未读消息
      return {
        ...state,
        ...{
          UnreadMessage: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.SEND_FOLLOW_POST: // 回帖
      return {
        ...state,
        ...{
          sendFollowPost: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_SEND_FOLLOW_POST: // 回帖
      if (action.payload.router == 'OnePost') {
        return {
          ...state,
          ...{
            PostDetail: {
              data: updateMainCommentList(
                state.HomePageContentList,
                action.payload,
                state.setTargetPostId,
                state.PostDetail
              ),
              status: 'success',
              error: false
            },
            sendFollowPost: {
              status: 'success',
              error: false
            }
          }
        }
      } else {
        return {
          ...state,
          ...{
            HomePageContentList: {
              data: updateMainCommentList(
                state.HomePageContentList,
                action.payload,
                state.setTargetPostId,
                state.PostDetail
              ),
              status: 'success',
              error: false
            },
            sendFollowPost: {
              status: 'success',
              error: false
            }
          }
        }
      }

    case ActionsTypes.FAILURE_SEND_FOLLOW_POST: // 回帖
      return {
        ...state,
        ...{
          sendFollowPost: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.SEND_FOLLOW_REPLY_POST: // 回复评论
      return {
        ...state,
        ...{
          sendFollowPost: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_SEND_FOLLOW_REPLY_POST: // 回复评论
      if (action.payload.router == 'OnePost') {
        return {
          ...state,
          ...{
            PostDetail: {
              data: updateMainCommentReplyList(
                state.HomePageContentList,
                action.payload,
                state.setTargetPostId,
                state.PostDetail
              ),
              status: 'success',
              error: false
            },
            sendFollowPost: {
              status: 'success',
              error: false
            }
          }
        }
      } else {
        return {
          ...state,
          ...{
            HomePageContentList: {
              data: updateMainCommentReplyList(
                state.HomePageContentList,
                action.payload,
                state.setTargetPostId,
                state.PostDetail
              ),
              status: 'success',
              error: false
            },
            sendFollowPost: {
              status: 'success',
              error: false
            }
          }
        }
      }
    case ActionsTypes.FAILURE_SEND_FOLLOW_REPLY_POST: // 回复评论
      return {
        ...state,
        ...{
          sendFollowPost: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.DO_DELETE_POST: // 删除帖子
      return {
        ...state,
        ...{
          DeletePost: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_DO_DELETE_POST: // 删除帖子
      if (action.payload.router == 'OnePost') {
        return {
          ...state,
          ...{
            DeletePost: {
              data: action.payload,
              status: 'success',
              error: false
            },
            PostDetail: {
              data: doDeletePost(
                state.HomePageContentList.data,
                action.payload,
                state.PostDetail.data
              ),
              status: 'success',
              error: false
            },
            HomePageContentList: {
              data: doDeletePostReplyUpdateHomePageContentList(
                state.HomePageContentList.data,
                action.payload,
                state.PostDetail.data
              ),
              status: 'success',
              error: false
            }
          }
        }
      } else {
        return {
          ...state,
          ...{
            DeletePost: {
              data: action.payload,
              status: 'success',
              error: false
            },
            HomePageContentList: {
              data: doDeletePost(
                state.HomePageContentList.data,
                action.payload
              ),
              status: 'success',
              error: false
            }
          }
        }
      }

    case ActionsTypes.FAILURE_DO_DELETE_POST: // 删除帖子
      return {
        ...state,
        ...{
          DeletePost: {
            status: 'failure',
            error: true
          }
        }
      }

    case ActionsTypes.DO_POST_READ_COUNT: // 统计帖子阅读数
      return {
        ...state,
        ...{
          PostReadCount: {
            status: 'running',
            error: false
          }
        }
      }
    case ActionsTypes.SUCCESS_DO_POST_READ_COUNT: // 统计帖子阅读数
      return {
        ...state,
        ...{
          PostReadCount: {
            status: 'success',
            error: false
          },
          PostDetail: {
            // 帖子详情
            data: doPostReadCount(state.PostDetail.data),
            status: 'success',
            error: false
          }
        }
      }
    case ActionsTypes.FAILURE_DO_POST_READ_COUNT: // 统计帖子阅读数
      return {
        ...state,
        ...{
          PostReadCount: {
            status: 'failure',
            error: true
          }
        }
      }

    default:
      return state
  }
}

export default CommunityPostState
