import * as CommunityConstants from "../Constants/CommunityConstants";
const initialState = {
    channel: 'all',
    postsData: [],
    topPostData: [],
    animating: false,
    // followsData: [],
    unreadMessageIcon: null,
    commentInputVisible: false,
    routeName: 'Community',
    targetPostId: -1,
    follow_id: -1,
    actionListVisible: false,
    targetForumId: -1 //// 切换目标主页 ID
};
function appendData(preData, newData) {
    // 如果当前没有帖子，直接返回新数据
    if (preData.length == 0) {
        return newData;
    }
    // 追加数据的开头
    let new_post_id_head = newData[0].post_id;
    // 旧数据的末尾
    let pre_post_id_end = preData[preData.length - 1].post_id;
    if (pre_post_id_end - 1 < new_post_id_head) {
        // 列表有更新，旧数据的末尾和追加数据的开头有重的，去个重
        // 旧数据保留的个数
        const _pre = preData.filter(ele => ele.post_id > new_post_id_head);
        return [..._pre, ...newData];
    }
    else {
        // console.log('其他情况')
        return [...preData, ...newData];
    }
}
// 删除一个帖子
function deletePost(postsData, post_id) {
    return postsData.filter(ele => ele.post_id != post_id);
}
// 更新一个帖子
// 万一要更新的帖子不存在，则直接追加
function updateOnePost(postsData, postDetail) {
    const index = postsData.findIndex((ele) => ele.post_id == postDetail.post_id);
    const _postsData = postsData.slice(0);
    if (index == -1) {
        _postsData.push(postDetail);
    }
    else {
        _postsData[index] = postDetail;
    }
    return _postsData;
}
// 在帖子下添加评论的修改操作
function addCommentToPost(postsData, replyDetail) {
    const post_id = replyDetail.post_id;
    const postIndex = postsData.findIndex((ele) => ele.post_id == post_id);
    const targetPostDetail = postsData[postIndex];
    const targetReply = targetPostDetail.reply;
    const newPostDetail = Object.assign({}, targetPostDetail, { reply: [...targetReply, replyDetail] });
    // console.log('newPostDetail', newPostDetail)
    const _postsData = postsData.slice(0);
    _postsData[postIndex] = newPostDetail;
    return _postsData;
}
// 在帖子下删除评论的修改操作
function deleteCommentToPost(postsData, post_id, reply_id) {
    const postIndex = postsData.findIndex((ele) => ele.post_id == post_id);
    const targetPostDetail = postsData[postIndex];
    const preReply = targetPostDetail.reply;
    const newReply = preReply.filter(ele => ele.reply_id != reply_id);
    const newPostDetail = Object.assign({}, targetPostDetail, { reply: newReply });
    const _postsData = postsData.slice(0);
    _postsData[postIndex] = newPostDetail;
    return _postsData;
}
const communityState = (state = initialState, action) => {
    switch (action.type) {
        // 切换社区和关注
        case CommunityConstants.CHANGE_CHANNEL:
            return Object.assign({}, state, { channel: action.channel, postsData: [], animating: true });
        // 更新和追加帖子列表
        case CommunityConstants.UPDATE_POSTS_DATA:
            return Object.assign({}, state, { postsData: action.data, animating: false });
        case CommunityConstants.APPEND_POSTS_DATA:
            return Object.assign({}, state, { postsData: appendData(state.postsData, action.data) });
        // 删除帖子
        case CommunityConstants.DELETE_POST:
            return Object.assign({}, state, { postsData: deletePost(state.postsData, action.post_id) });
        // 更新一个帖子
        case CommunityConstants.UPDATE_ONE_POST:
            return Object.assign({}, state, { postsData: updateOnePost(state.postsData, action.postDetail) });
        // 增加评论
        case CommunityConstants.ADD_COMMENT:
            return Object.assign({}, state, { postsData: addCommentToPost(state.postsData, action.replyDetail) });
        // 删除评论
        case CommunityConstants.DELETE_COMMENT:
            return Object.assign({}, state, { postsData: deleteCommentToPost(state.postsData, action.post_id, action.reply_id) });
        // 输入框和键盘的弹出
        case CommunityConstants.TOGGLE_COMMENT_INPUT_VISIBLE:
            return Object.assign({}, state, { commentInputVisible: action.visible != undefined ? action.visible : !state.commentInputVisible, routeName: action.routeName });
        // 设置目标帖子
        case CommunityConstants.SET_TARGET_POSTID:
            return Object.assign({}, state, { targetPostId: action.targetPostId, follow_id: action.follow_id });
        // 设置置顶帖数据
        case CommunityConstants.SET_TOP_POST:
            return Object.assign({}, state, { topPostData: action.data });
        // 操作列表的显示隐藏
        case CommunityConstants.TOGGLE_ACTION_LIST_VISIBLE:
            return Object.assign({}, state, { actionListVisible: !state.actionListVisible });
        // 切换目标主页 ID
        case CommunityConstants.SET_TARGET_FORUM_ID:
            return Object.assign({}, state, { targetForumId: action.targetForumId });
        default:
            return state;
    }
};
export default communityState;
