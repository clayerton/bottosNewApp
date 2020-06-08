import * as CommunityConstants from '../Constants/CommunityConstants';
export const changeChannel = (channel) => ({
    type: CommunityConstants.CHANGE_CHANNEL,
    channel
});
export const updatePostsData = (data) => {
    // console.log('action updatePostsData data: ', data)
    return {
        type: CommunityConstants.UPDATE_POSTS_DATA,
        data
    };
};
// 追加帖子
export const appendPostsData = (data) => {
    // console.log('action appendPostsData data: ', data)
    return {
        type: CommunityConstants.APPEND_POSTS_DATA,
        data
    };
};
// 删除帖子
export const deletePost = (post_id) => {
    return {
        type: CommunityConstants.DELETE_POST,
        post_id
    };
};
// 更新一个帖子
export const updateOnePost = (postDetail) => {
    return {
        type: CommunityConstants.UPDATE_ONE_POST,
        postDetail
    };
};
// 切换评论框的显示
export const toggleCommentInputVisible = (visible, routeName) => {
    // console.log('action toggleCommentInputVisible visible: ', visible)
    return {
        type: CommunityConstants.TOGGLE_COMMENT_INPUT_VISIBLE,
        visible,
        routeName
    };
};
// 切换目标帖子 ID
export const setTargetPostId = (post_id, follow_id = -1) => {
    // console.log('action setTargetPostId post_id: ', post_id)
    return {
        type: CommunityConstants.SET_TARGET_POSTID,
        targetPostId: post_id,
        follow_id
    };
};
// 添加评论
export const addComment = (replyDetail) => {
    // console.log('action addComment replyDetail: ', replyDetail)
    return {
        type: CommunityConstants.ADD_COMMENT,
        replyDetail
    };
};
// 删除评论
export const deleteComment = (post_id, reply_id) => {
    // console.log('action deleteComment post_id: ', post_id)
    // console.log('action deleteComment reply_id: ', reply_id)
    return {
        type: CommunityConstants.DELETE_COMMENT,
        post_id,
        reply_id
    };
};
// 设置置顶帖数据
export const setTopPost = data => {
    // console.log('action setTopPost data: ', data)
    return {
        type: CommunityConstants.SET_TOP_POST,
        data
    };
};
// 控制社区操作列表部分的显示隐藏，不需要传参数，对当前状态取反就好了
export const toggleActionListVisible = () => ({
    type: CommunityConstants.TOGGLE_ACTION_LIST_VISIBLE
});
// 切换目标主页 ID
export const setTargetForumId = (forum_id) => {
    return {
        type: CommunityConstants.SET_TARGET_FORUM_ID,
        targetForumId: forum_id
    };
};
