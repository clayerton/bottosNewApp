import * as CommunityConstants from "../Constants/CommunityConstants";

const initialState = {
  channel: 'all', // all 表示所有帖子，follow 表示关注人帖子
  postsData: [],  // 帖子数据
  topPostData: [], // 置顶帖的数据，保存在这里
  animating: false, // 关注列表和帖子列表的切换需要动画
  // followsData: [],
  unreadMessageIcon: null, // 未读消息头像
  commentInputVisible: false, // 评论框的展示
  routeName: 'Community', // 这个是记录路由名的，是为了让输入框感知
  targetPostId: -1, // 回复的目标帖子 ID
  follow_id: -1, // 回复的目标的 ID
  actionListVisible: false, // 操作列表的显示隐藏
  targetForumId:-1 //// 切换目标主页 ID
}

// 帖子下的回复
export interface ReplyDeteil {
  post_id?: number; // 被回复的帖子的 id
  follow_id?: any; // 被回复人的id，为0则为主贴留言
  follow_name: any; // 被回复人的 name
  // follow_mobile: null;
  follow_reply_time?: number; // 被回复时间

  reply_id: number; // 回复的 id
  main_id: number; // 回帖人 id
  member_name: string; // 回帖人的 name
  mobile: string; // 回帖人的 mobile
  reply_content: string; // 回复贴内容
  reply_follow_id?: number;
  reply_time: number;
}

export interface PostUrl {
  post_id?: number;
  post_img_id: number;
  post_thumb_url: string;
  post_med_url: string;
  post_url: string;
}

export interface RedPacket {
  giftpack_status: number; // 1 则表示红包处于有效期
  giftpack_type: number; // 1 表示拼手气红包
  hash: string; // 红包的 hash
  intro: string; // 用户输入的信息
  pack_id: number; // 红包 id
  pick_status: boolean; // true 则当前用户已拾取过
}

// 帖子
export interface PostDetail {
  content: string; // 帖子内容
  created_at: number; // 发帖时间
  group_id?: string; // 用户组，用来显示对应的大 V 标识
  is_praise: number; // 是否点了赞
  member_id: number; // 发帖人 id
  mobile: string; // 发帖人电话
  post_avatar: string; // 头像
  post_id: number; // 帖子 id
  post_member_name: string;
  post_url: PostUrl[];
  praise: number; // 点赞数
  reply: ReplyDeteil[];
  pack_preview: RedPacket;
}


function appendData(preData: Array<PostDetail>, newData: Array<PostDetail>): Array<PostDetail> {
  // 如果当前没有帖子，直接返回新数据
  if (preData.length == 0) {return newData}

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
    // console.log('其他情况')
    return [...preData, ...newData]
  }
}

// 删除一个帖子
function deletePost(postsData: Array<PostDetail>, post_id: number) {
  return postsData.filter(ele => ele.post_id != post_id)
}

// 更新一个帖子
// 万一要更新的帖子不存在，则直接追加
function updateOnePost(postsData: Array<PostDetail>, postDetail: PostDetail): Array<PostDetail> {
  const index = postsData.findIndex((ele: PostDetail) => ele.post_id == postDetail.post_id)
  const _postsData = postsData.slice(0)
  if (index == -1) {
    _postsData.push(postDetail)
  } else {
    _postsData[index] = postDetail
  }
  return _postsData
}

// 在帖子下添加评论的修改操作
function addCommentToPost(postsData: Array<PostDetail>, replyDetail: ReplyDeteil) {
  const post_id = replyDetail.post_id
  const postIndex = postsData.findIndex((ele: PostDetail) => ele.post_id == post_id)
  const targetPostDetail = postsData[postIndex]
  const targetReply = targetPostDetail.reply
  const newPostDetail = { ...targetPostDetail, reply: [...targetReply, replyDetail]}
  const _postsData = postsData.slice(0)
  _postsData[postIndex] = newPostDetail
  return _postsData
}

// 在帖子下删除评论的修改操作
function deleteCommentToPost(postsData: Array<PostDetail>, post_id: number, reply_id: number) {
  const postIndex = postsData.findIndex((ele: PostDetail) => ele.post_id == post_id)
  const targetPostDetail = postsData[postIndex]
  const preReply = targetPostDetail.reply
  const newReply = preReply.filter(ele => ele.reply_id != reply_id)
  const newPostDetail = { ...targetPostDetail, reply: newReply}
  const _postsData = postsData.slice(0)
  _postsData[postIndex] = newPostDetail
  return _postsData
}

const communityState = (state = initialState, action: any) => {
  switch (action.type) {
    // 切换社区和关注
    case CommunityConstants.CHANGE_CHANNEL:
      return { ...state, channel: action.channel, postsData: [], animating: true }
    // 更新和追加帖子列表
    case CommunityConstants.UPDATE_POSTS_DATA:
      return { ...state, postsData: action.data, animating: false }
    case CommunityConstants.APPEND_POSTS_DATA:
      return { ...state, postsData: appendData(state.postsData, action.data) }
    // 删除帖子
    case CommunityConstants.DELETE_POST:
      return { ...state, postsData: deletePost(state.postsData, action.post_id) }
    // 更新一个帖子
    case CommunityConstants.UPDATE_ONE_POST:
      return { ...state, postsData: updateOnePost(state.postsData, action.postDetail) }

      
    // 增加评论
    case CommunityConstants.ADD_COMMENT:
      return { ...state, postsData: addCommentToPost(state.postsData, action.replyDetail) }
    // 删除评论
    case CommunityConstants.DELETE_COMMENT:
      return { ...state, postsData: deleteCommentToPost(state.postsData, action.post_id, action.reply_id) }

    // 输入框和键盘的弹出
    case CommunityConstants.TOGGLE_COMMENT_INPUT_VISIBLE:
      return { ...state, commentInputVisible: action.visible != undefined ? action.visible : !state.commentInputVisible, routeName: action.routeName }
    // 设置目标帖子
    case CommunityConstants.SET_TARGET_POSTID:
      return { ...state, targetPostId: action.targetPostId, follow_id: action.follow_id }
      
    // 设置置顶帖数据
    case CommunityConstants.SET_TOP_POST:
      return { ...state, topPostData: action.data }
    // 操作列表的显示隐藏
    case CommunityConstants.TOGGLE_ACTION_LIST_VISIBLE:
      return { ...state, actionListVisible: !state.actionListVisible }
    // 切换目标主页 ID
    case CommunityConstants.SET_TARGET_FORUM_ID:
      return { ...state, targetForumId: action.targetForumId }
    
    default:
      return state
  }
}

export default communityState
