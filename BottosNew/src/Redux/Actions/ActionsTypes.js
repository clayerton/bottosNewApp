import { createAction } from 'redux-actions'

// ================================ MemberAssets ================================
export const REQUEST_MEMBER_ASSETS_USR_FULL_DATE = 'REQUEST_MEMBER_ASSETS_USR_FULL_DATE' // 获取有资产的月份数组
export const SUCCESS_MEMBER_ASSETS_USR_FULL_DATE = 'SUCCESS_MEMBER_ASSETS_USR_FULL_DATE' // 获取有资产的月份数组
export const FAILURE_MEMBER_ASSETS_USR_FULL_DATE = 'FAILURE_MEMBER_ASSETS_USR_FULL_DATE' // 获取有资产的月份数组
export const requestMemberAssetsUsefulDate = createAction(REQUEST_MEMBER_ASSETS_USR_FULL_DATE)
export const successMemberAssetsUsefulDate = createAction(SUCCESS_MEMBER_ASSETS_USR_FULL_DATE)
export const failureMemberAssetsUsefulDate = createAction(FAILURE_MEMBER_ASSETS_USR_FULL_DATE)

export const REQUEST_MEMBER_ASSETS_LIST = 'REQUEST_MEMBER_ASSETS_LIST' // 资产列表
export const SUCCESS_MEMBER_ASSETS_LIST = 'SUCCESS_MEMBER_ASSETS_LIST' // 资产列表
export const FAILURE_MEMBER_ASSETS_LIST = 'FAILURE_MEMBER_ASSETS_LIST' // 资产列表
export const requestMemberAssetsList = createAction(REQUEST_MEMBER_ASSETS_LIST)
export const successMemberAssetsList = createAction(SUCCESS_MEMBER_ASSETS_LIST)
export const failureMemberAssetsList = createAction(FAILURE_MEMBER_ASSETS_LIST)

export const REQUEST_UPDATE_MEMBER_ASSETS_LIST = 'REQUEST_UPDATE_MEMBER_ASSETS_LIST' // 更新资产列表
export const SUCCESS_UPDATE_MEMBER_ASSETS_LIST = 'SUCCESS_UPDATE_MEMBER_ASSETS_LIST' // 更新资产列表
export const FAILURE_UPDATE_MEMBER_ASSETS_LIST = 'FAILURE_UPDATE_MEMBER_ASSETS_LIST' // 更新资产列表
export const requestUpdateMemberAssetsList = createAction(REQUEST_UPDATE_MEMBER_ASSETS_LIST)
export const successUpdateMemberAssetsList = createAction(SUCCESS_UPDATE_MEMBER_ASSETS_LIST)
export const failureUpdateMemberAssetsList = createAction(FAILURE_UPDATE_MEMBER_ASSETS_LIST)

export const REQUEST_APPEND_MEMBER_ASSETS_LIST = 'REQUEST_APPEND_MEMBER_ASSETS_LIST' // 添加资产列表
export const SUCCESS_APPEND_MEMBER_ASSETS_LIST = 'SUCCESS_APPEND_MEMBER_ASSETS_LIST' // 添加资产列表
export const FAILURE_APPEND_MEMBER_ASSETS_LIST = 'FAILURE_APPEND_MEMBER_ASSETS_LIST' // 添加资产列表
export const requestAppendMemberAssetsList = createAction(REQUEST_APPEND_MEMBER_ASSETS_LIST)
export const successAppendMemberAssetsList = createAction(SUCCESS_APPEND_MEMBER_ASSETS_LIST)
export const failureAppendMemberAssetsList = createAction(FAILURE_APPEND_MEMBER_ASSETS_LIST)

export const REQUEST_MEMBER_ASSETS = 'REQUEST_MEMBER_ASSETS' // 资产币种列表
export const SUCCESS_MEMBER_ASSETS = 'SUCCESS_MEMBER_ASSETS' // 资产币种列表
export const FAILURE_MEMBER_ASSETS = 'FAILURE_MEMBER_ASSETS' // 资产币种列表
export const requestMemberAssets = createAction(REQUEST_MEMBER_ASSETS)
export const successMemberAssets = createAction(SUCCESS_MEMBER_ASSETS)
export const failureMemberAssets = createAction(FAILURE_MEMBER_ASSETS)

export const REQUEST_CONVERT_REDEEM_USE = 'REQUEST_CONVERT_REDEEM_USE' // 兑换 兑换码
export const SUCCESS_CONVERT_REDEEM_USE = 'SUCCESS_CONVERT_REDEEM_USE' // 兑换 兑换码
export const FAILURE_CONVERT_REDEEM_USE = 'FAILURE_CONVERT_REDEEM_USE' // 兑换 兑换码
export const requestConvertRedeemUse = createAction(REQUEST_CONVERT_REDEEM_USE)
export const successConvertRedeemUse = createAction(SUCCESS_CONVERT_REDEEM_USE)
export const failureConvertRedeemUse = createAction(FAILURE_CONVERT_REDEEM_USE)

export const REQUEST_WITH_DRAW_CONFIG = 'REQUEST_WITH_DRAW_CONFIG' // 资产传出 基本信息
export const SUCCESS_WITH_DRAW_CONFIG = 'SUCCESS_WITH_DRAW_CONFIG' // 资产传出 基本信息
export const FAILURE_WITH_DRAW_CONFIG = 'FAILURE_WITH_DRAW_CONFIG' // 资产传出 基本信息
export const requestWithdrawConfig = createAction(REQUEST_WITH_DRAW_CONFIG)
export const successWithdrawConfig = createAction(SUCCESS_WITH_DRAW_CONFIG)
export const failureWithdrawConfig = createAction(FAILURE_WITH_DRAW_CONFIG)

export const REQUEST_WITH_DRAW_CHAIN_LIST = 'REQUEST_WITH_DRAW_CHAIN_LIST' // 转出方式列表
export const SUCCESS_WITH_DRAW_CHAIN_LIST = 'SUCCESS_WITH_DRAW_CHAIN_LIST' // 转出方式列表
export const FAILURE_WITH_DRAW_CHAIN_LIST = 'FAILURE_WITH_DRAW_CHAIN_LIST' // 转出方式列表
export const requestWithdrawChainList = createAction(REQUEST_WITH_DRAW_CHAIN_LIST)
export const successWithdrawChainList = createAction(SUCCESS_WITH_DRAW_CHAIN_LIST)
export const failureWithdrawChainList = createAction(FAILURE_WITH_DRAW_CHAIN_LIST)

export const REQUEST_WITH_DRAW_DEPOSIT = 'REQUEST_WITH_DRAW_DEPOSIT' // 转出币
export const SUCCESS_WITH_DRAW_DEPOSIT = 'SUCCESS_WITH_DRAW_DEPOSIT' // 转出币
export const FAILURE_WITH_DRAW_DEPOSIT = 'FAILURE_WITH_DRAW_DEPOSIT' // 转出币
export const requestWithdrawDeposit = createAction(REQUEST_WITH_DRAW_DEPOSIT)
export const successWithdrawDeposit = createAction(SUCCESS_WITH_DRAW_DEPOSIT)
export const failureWithdrawCDeposit = createAction(FAILURE_WITH_DRAW_DEPOSIT)

export const REQUEST_WITH_DRAW_MOBILE_CODE_VERIFY = 'REQUEST_WITH_DRAW_MOBILE_CODE_VERIFY' // 转出发验证码
export const SUCCESS_WITH_DRAW_MOBILE_CODE_VERIFY = 'SUCCESS_WITH_DRAW_MOBILE_CODE_VERIFY' // 转出发验证码
export const FAILURE_WITH_DRAW_MOBILE_CODE_VERIFY = 'FAILURE_WITH_DRAW_MOBILE_CODE_VERIFY' // 转出发验证码
export const requestWithdrawMobileCodeVerify = createAction(REQUEST_WITH_DRAW_MOBILE_CODE_VERIFY)
export const successWithdrawMobileCodeVerify = createAction(SUCCESS_WITH_DRAW_MOBILE_CODE_VERIFY)
export const failureWithdrawCMobileCodeVerify = createAction(FAILURE_WITH_DRAW_MOBILE_CODE_VERIFY)

export const REQUEST_WITH_DRAW_JURISDICTION = 'REQUEST_WITH_DRAW_JURISDICTION' // 验证用户权限
export const SUCCESS_WITH_DRAW_JURISDICTION = 'SUCCESS_WITH_DRAW_JURISDICTION' // 验证用户权限
export const FAILURE_WITH_DRAW_JURISDICTION = 'FAILURE_WITH_DRAW_JURISDICTION' // 验证用户权限
export const requestWithdrawJurisdiction = createAction(REQUEST_WITH_DRAW_JURISDICTION)
export const successWithdrawJurisdiction = createAction(SUCCESS_WITH_DRAW_JURISDICTION)
export const failureWithdrawJurisdiction = createAction(FAILURE_WITH_DRAW_JURISDICTION)








// ================================ Community 社区 ================================

export const DO_SAVE_CURRENT_MENU_OPTION = 'DO_SAVE_CURRENT_MENU_OPTION' // 选择菜单栏
export const SUCCESS_SAVE_CURRENT_MENU_OPTION = 'SUCCESS_SAVE_CURRENT_MENU_OPTION' // 选择菜单栏
export const FAILURE_SAVE_CURRENT_MENU_OPTION = 'FAILURE_SAVE_CURRENT_MENU_OPTION' // 选择菜单栏
export const DoSaveCurrentMenuOption = createAction(DO_SAVE_CURRENT_MENU_OPTION)
export const successSaveCurrentMenuOption = createAction(SUCCESS_SAVE_CURRENT_MENU_OPTION)
export const failureSaveCurrentMenuOption = createAction(FAILURE_SAVE_CURRENT_MENU_OPTION)

export const REQUEST_HOMEPAGE_LIST= 'REQUEST_HOMEPAGE_LIST' // 菜单栏数据
export const SUCCESS_HOMEPAGE_LIST= 'SUCCESS_HOMEPAGE_LIST' // 菜单栏数据
export const FAILURE_HOMEPAGE_LIST= 'FAILURE_HOMEPAGE_LIST' // 菜单栏数据
export const requestHomePageList = createAction(REQUEST_HOMEPAGE_LIST)
export const successHomePageList = createAction(SUCCESS_HOMEPAGE_LIST)
export const failureHomePageList = createAction(FAILURE_HOMEPAGE_LIST)

export const REQUEST_POST_TOP_POST = 'REQUEST_POST_TOP_POST' // 置顶的数据详情
export const SUCCESS_POST_TOP_POST = 'SUCCESS_POST_TOP_POST' // 置顶的数据详情
export const FAILURE_POST_TOP_POST = 'FAILURE_POST_TOP_POST' // 置顶的数据详情
export const requestPostTopPost = createAction(REQUEST_POST_TOP_POST)
export const successPostTopPost = createAction(SUCCESS_POST_TOP_POST)
export const failurePostTopPost = createAction(FAILURE_POST_TOP_POST)

export const UPDATE_HOME_PAGE_CONTENT_RECOMMEND = 'UPDATE_HOME_PAGE_CONTENT_RECOMMEND' // 请求推荐帖子列表
export const SUCCESS_UPDATE_HOME_PAGE_CONTENT_RECOMMEND = 'SUCCESS_UPDATE_HOME_PAGE_CONTENT_RECOMMEND' // 请求推荐帖子列表
export const FAILURE_UPDATE_HOME_PAGE_CONTENT_RECOMMEND = 'FAILURE_UPDATE_HOME_PAGE_CONTENT_RECOMMEND' // 请求推荐帖子列表
export const updateHomePageContentRecommend = createAction(UPDATE_HOME_PAGE_CONTENT_RECOMMEND)
export const successUpdateHomePageContentRecommend = createAction(SUCCESS_UPDATE_HOME_PAGE_CONTENT_RECOMMEND)
export const failureUpdateHomePageContentRecommend = createAction(FAILURE_UPDATE_HOME_PAGE_CONTENT_RECOMMEND)

export const APPEND_HOME_PAGE_CONTENT_RECOMMEND = 'APPEND_HOME_PAGE_CONTENT_RECOMMEND' // 添加推荐帖子列表
export const SUCCESS_APPEND_HOME_PAGE_CONTENT_RECOMMEND = 'SUCCESS_APPEND_HOME_PAGE_CONTENT_RECOMMEND' // 添加推荐帖子列表
export const FAILURE_APPEND_HOME_PAGE_CONTENT_RECOMMEND = 'FAILURE_APPEND_HOME_PAGE_CONTENT_RECOMMEND' // 添加推荐帖子列表
export const appendHomePageContentRecommend = createAction(APPEND_HOME_PAGE_CONTENT_RECOMMEND)
export const successAppendHomePageContentRecommend = createAction(SUCCESS_APPEND_HOME_PAGE_CONTENT_RECOMMEND)
export const failureAppendHomePageContentRecommend = createAction(FAILURE_APPEND_HOME_PAGE_CONTENT_RECOMMEND)

export const APPEND_HOME_PAGE_CONTENT = 'APPEND_HOME_PAGE_CONTENT' // 添加帖子列表
export const SUCCESS_APPEND_HOME_PAGE_CONTENT = 'SUCCESS_APPEND_HOME_PAGE_CONTENT' // 添加帖子列表
export const FAILURE_APPEND_HOME_PAGE_CONTENT = 'FAILURE_APPEND_HOME_PAGE_CONTENT' // 添加帖子列表
export const appendHomePageContent = createAction(APPEND_HOME_PAGE_CONTENT)
export const successAppendHomePageContent = createAction(SUCCESS_APPEND_HOME_PAGE_CONTENT)
export const failureAppendHomePageContent = createAction(FAILURE_APPEND_HOME_PAGE_CONTENT)

export const UPDATE_HOME_PAGE_CONTENT = 'UPDATE_HOME_PAGE_CONTENT' // 帖子列表
export const SUCCESS_HOME_PAGE_CONTENT = 'SUCCESS_HOME_PAGE_CONTENT' // 帖子列表
export const FAILURE_HOME_PAGE_CONTENT = 'FAILURE_HOME_PAGE_CONTENT' // 帖子列表
export const updateHomePageContent = createAction(UPDATE_HOME_PAGE_CONTENT)
export const successHomePageContent = createAction(SUCCESS_HOME_PAGE_CONTENT)
export const failureHomePageContent = createAction(FAILURE_HOME_PAGE_CONTENT)

export const REQUEST_POST_DETAIL = 'REQUEST_POST_DETAIL' // 帖子详情
export const SUCCESS_POST_DETAIL = 'SUCCESS_POST_DETAIL' // 帖子详情
export const FAILURE_POST_DETAIL = 'FAILURE_POST_DETAIL' // 帖子详情
export const requestPostDetail = createAction(REQUEST_POST_DETAIL)
export const successPostDetail = createAction(SUCCESS_POST_DETAIL)
export const failurePostDetail = createAction(FAILURE_POST_DETAIL)

export const DO_FOLLOW_PRAISE = 'DO_FOLLOW_PRAISE' // 点赞功能
export const SUCCESS_FOLLOW_PRAISE = 'SUCCESS_FOLLOW_PRAISE' // 点赞功能
export const FAILURE_FOLLOW_PRAISE = 'FAILURE_FOLLOW_PRAISE' // 点赞功能
export const doFollowPraise = createAction(DO_FOLLOW_PRAISE)
export const successFollowPraise = createAction(SUCCESS_FOLLOW_PRAISE)
export const failureFollowPraise = createAction(FAILURE_FOLLOW_PRAISE)

export const UPDATE_DO_FOLLOW_FOLLOW = 'UPDATE_DO_FOLLOW_FOLLOW' // 添加取消关注更改列表样式
export const SUCCESS_UPDATE_DO_FOLLOW_FOLLOW = 'SUCCESS_UPDATE_DO_FOLLOW_FOLLOW' // 添加取消关注更改列表样式
export const FAILURE_UPDATE_DO_FOLLOW_FOLLOW = 'FAILURE_UPDATE_DO_FOLLOW_FOLLOW' // 添加取消关注更改列表样式
export const updateDoAddFollow= createAction(UPDATE_DO_FOLLOW_FOLLOW)
export const successUpdateDoAddFollow = createAction(SUCCESS_UPDATE_DO_FOLLOW_FOLLOW)
export const failureUpdateDoAddFollow = createAction(FAILURE_UPDATE_DO_FOLLOW_FOLLOW)

export const UPDATE_UNREAD_MESSAGE = 'UPDATE_UNREAD_MESSAGE' // 获取未读消息数
export const SUCCESS_UPDATE_UNREAD_MESSAGE = 'SUCCESS_UPDATE_UNREAD_MESSAGE' // 获取未读消息数
export const FAILURE_UPDATE_UNREAD_MESSAGE = 'FAILURE_UPDATE_UNREAD_MESSAGE' // 获取未读消息数
export const updateUnreadMessage = createAction(UPDATE_UNREAD_MESSAGE)
export const successUpdateUnreadMessage = createAction(SUCCESS_UPDATE_UNREAD_MESSAGE)
export const failureUpdateUnreadMessage = createAction(FAILURE_UPDATE_UNREAD_MESSAGE)

export const CLEAR_UNREAD_MESSAGE= 'CLEAR_UNREAD_MESSAGE' // 清除未读数
export const clearUnreadMessage = createAction(CLEAR_UNREAD_MESSAGE)


export const SEND_FOLLOW_POST = 'SEND_FOLLOW_POST' // 回帖
export const SUCCESS_SEND_FOLLOW_POST = 'SUCCESS_SEND_FOLLOW_POST' // 回帖
export const FAILURE_SEND_FOLLOW_POST = 'FAILURE_SEND_FOLLOW_POST' // 回帖
export const sendFollowPost = createAction(SEND_FOLLOW_POST)
export const successSendFollowPost = createAction(SUCCESS_SEND_FOLLOW_POST)
export const failureSendFollowPost = createAction(FAILURE_SEND_FOLLOW_POST)

export const SEND_FOLLOW_REPLY_POST = 'SEND_FOLLOW_REPLY_POST' // 回复评论
export const SUCCESS_SEND_FOLLOW_REPLY_POST = 'SUCCESS_SEND_FOLLOW_REPLY_POST' // 回复评论
export const FAILURE_SEND_FOLLOW_REPLY_POST = 'FAILURE_SEND_FOLLOW_REPLY_POST' // 回复评论
export const sendFollowReplyPost = createAction(SEND_FOLLOW_REPLY_POST)
export const successSendFollowReplyPost = createAction(SUCCESS_SEND_FOLLOW_REPLY_POST)
export const failureSendFollowReplyPost = createAction(FAILURE_SEND_FOLLOW_REPLY_POST)

export const DO_DELETE_POST = 'DO_DELETE_POST' // 删除帖子
export const SUCCESS_DO_DELETE_POST = 'SUCCESS_DO_DELETE_POST' // 删除帖子
export const FAILURE_DO_DELETE_POST = 'FAILURE_DO_DELETE_POST' // 删除帖子
export const doDeletePost = createAction(DO_DELETE_POST)
export const successDoDeletePost = createAction(SUCCESS_DO_DELETE_POST)
export const failureDoDeletePost = createAction(FAILURE_DO_DELETE_POST)

export const DO_POST_READ_COUNT = 'DO_POST_READ_COUNT' // 统计帖子数
export const SUCCESS_DO_POST_READ_COUNT = 'SUCCESS_DO_POST_READ_COUNT' // 统计帖子数
export const FAILURE_DO_POST_READ_COUNT = 'FAILURE_DO_POST_READ_COUNT' // 统计帖子数
export const doPostReadCount = createAction(DO_POST_READ_COUNT)
export const successDoPostReadCount = createAction(SUCCESS_DO_POST_READ_COUNT)
export const failureDoPostReadCount = createAction(FAILURE_DO_POST_READ_COUNT)

export const TOGGLE_COMMENT_INPUT_VISIBLE = 'TOGGLE_COMMENT_INPUT_VISIBLE' // 输入框和键盘的弹出
export const SUCCESS_TOGGLE_COMMENT_INPUT_VISIBLE = 'SUCCESS_TOGGLE_COMMENT_INPUT_VISIBLE' // 输入框和键盘的弹出
export const FAILURE_TOGGLE_COMMENT_INPUT_VISIBLE = 'FAILURE_TOGGLE_COMMENT_INPUT_VISIBLE' // 输入框和键盘的弹出
export const toggleCommentInputVisible = createAction(TOGGLE_COMMENT_INPUT_VISIBLE)
export const successToggleCommentInputVisible = createAction(SUCCESS_TOGGLE_COMMENT_INPUT_VISIBLE)
export const failureToggleCommentInputVisible = createAction(FAILURE_TOGGLE_COMMENT_INPUT_VISIBLE)

export const SET_TARGET_POSTID = 'SET_TARGET_POSTID' // 设置目标帖子
export const setTargetPostId = createAction(SET_TARGET_POSTID)

export const TOGGLE_ACTION_LIST_VISIBLE = 'TOGGLE_ACTION_LIST_VISIBLE' // 操作列表的显示隐藏
export const successToggleActionListVisible = createAction(TOGGLE_ACTION_LIST_VISIBLE)




// ======================================================主页 ======================================================

export const SET_CURRENT_HOMEPAGE_FORUM_INFO = 'SET_CURRENT_HOMEPAGE_FORUM_INFO' // 更改当前主页信息
export const setCurrentHomepageForumInfo = createAction(SET_CURRENT_HOMEPAGE_FORUM_INFO)

export const UPDATE_CURRENT_HOMEPAGE_FORUM_INFO = 'UPDATE_CURRENT_HOMEPAGE_FORUM_INFO' // 更改当前主页信息
export const updateCurrentHomepageForumInfo = createAction(UPDATE_CURRENT_HOMEPAGE_FORUM_INFO)

export const REQUEST_HOMEPAGE_FORUM_LIST = 'REQUEST_HOMEPAGE_FORUM_LIST' // 请求主页列表
export const SUCCESS_HOMEPAGE_FORUM_LIST = 'SUCCESS_HOMEPAGE_FORUM_LIST' // 请求主页列表
export const FAILURE_HOMEPAGE_FORUM_LIST = 'FAILURE_HOMEPAGE_FORUM_LIST' // 请求主页列表
export const requestHomepageForumList = createAction(REQUEST_HOMEPAGE_FORUM_LIST)
export const successHomepageForumList = createAction(SUCCESS_HOMEPAGE_FORUM_LIST)
export const failureHomepageForumList = createAction(FAILURE_HOMEPAGE_FORUM_LIST)

export const UPDATE_HOMEPAGE_FORUM_LIST = 'UPDATE_HOMEPAGE_FORUM_LIST' // 添加主页列表
export const SUCCESS_UPDATE_HOMEPAGE_FORUM_LIST = 'SUCCESS_UPDATE_HOMEPAGE_FORUM_LIST' // 添加主页列表
export const FAILURE_UPDATE_HOMEPAGE_FORUM_LIST = 'FAILURE_UPDATE_HOMEPAGE_FORUM_LIST' // 添加主页列表
export const updateHomepageForumList = createAction(UPDATE_HOMEPAGE_FORUM_LIST)
export const successUpdateHomepageForumList = createAction(SUCCESS_UPDATE_HOMEPAGE_FORUM_LIST)
export const failureUpdateHomepageForumList = createAction(FAILURE_UPDATE_HOMEPAGE_FORUM_LIST)

export const REQUEST_HOMEPAGE_FORUM_POST_LIST = 'REQUEST_HOMEPAGE_FORUM_POST_LIST' // 请求主页频道列表
export const SUCCESS_HOMEPAGE_FORUM_POST_LIST = 'SUCCESS_HOMEPAGE_FORUM_POST_LIST' // 请求主页频道列表
export const FAILURE_HOMEPAGE_FORUM_POST_LIST = 'FAILURE_HOMEPAGE_FORUM_POST_LIST' // 请求主页频道列表
export const requestHomepageForumPostList = createAction(REQUEST_HOMEPAGE_FORUM_POST_LIST)
export const successHomepageForumPostList = createAction(SUCCESS_HOMEPAGE_FORUM_POST_LIST)
export const failureHomepageForumPostList = createAction(FAILURE_HOMEPAGE_FORUM_POST_LIST)

export const UPDATE_HOMEPAGE_FORUM_POST_LIST = 'UPDATE_HOMEPAGE_FORUM_POST_LIST' // 添加主页频道列表
export const SUCCESS_UPDATE_HOMEPAGE_FORUM_POST_LIST = 'SUCCESS_UPDATE_HOMEPAGE_FORUM_POST_LIST' // 添加主页频道列表
export const FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST = 'FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST' // 添加主页频道列表
export const updateHomepageForumPostList = createAction(UPDATE_HOMEPAGE_FORUM_POST_LIST)
export const successUpdateHomepageForumPostList = createAction(SUCCESS_UPDATE_HOMEPAGE_FORUM_POST_LIST)
export const failureUpdateHomepageForumPostList = createAction(FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST)


export const UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO = 'UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO' // 更新信息请求主页频道列表
export const SUCCESS_UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO = 'SUCCESS_UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO' // 更新信息请求主页频道列表
export const FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO = 'FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO' // 更新信息请求主页频道列表
export const requestUpdateHomepageForumPostListInfo = createAction(UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO)
export const successUpdateHomepageForumPostListInfo = createAction(SUCCESS_UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO)
export const failureUpdateHomepageForumPostListInfo = createAction(FAILURE_UPDATE_HOMEPAGE_FORUM_POST_LIST_INFO)

export const REQUEST_DO_CANCEL_FOLLOW_FORUM = 'REQUEST_DO_CANCEL_FOLLOW_FORUM' // 取消关注主页
export const SUCCESS_DO_CANCEL_FOLLOW_FORUM = 'SUCCESS_DO_CANCEL_FOLLOW_FORUM' // 取消关注主页
export const FAILURE_DO_CANCEL_FOLLOW_FORUM = 'FAILURE_DO_CANCEL_FOLLOW_FORUM' // 取消关注主页
export const requestDoCancelFollowForum = createAction(REQUEST_DO_CANCEL_FOLLOW_FORUM)
export const successDoCancelFollowForum = createAction(SUCCESS_DO_CANCEL_FOLLOW_FORUM)
export const failureDoCancelFollowForum = createAction(FAILURE_DO_CANCEL_FOLLOW_FORUM)

export const REQUEST_DO_ADD_FOLLOW_FORUM = 'REQUEST_DO_ADD_FOLLOW_FORUM' // 添加关注主页
export const SUCCESS_DO_ADD_FOLLOW_FORUM = 'SUCCESS_DO_ADD_FOLLOW_FORUM' // 添加关注主页
export const FAILURE_DO_ADD_FOLLOW_FORUM = 'FAILURE_DO_ADD_FOLLOW_FORUM' // 添加关注主页
export const requestDoAddFollowForum = createAction(REQUEST_DO_ADD_FOLLOW_FORUM)
export const successDoAddFollowForum = createAction(SUCCESS_DO_ADD_FOLLOW_FORUM)
export const failureDoAddFollowForum = createAction(FAILURE_DO_ADD_FOLLOW_FORUM)
























// ================================ My ================================
export const REQUEST_PERSONAL_PORTRAIT = 'REQUEST_PERSONAL_PORTRAIT' // 获取个人画像信息
export const SUCCESS_PERSONAL_PORTRAIT = 'SUCCESS_PERSONAL_PORTRAIT' // 获取个人画像信息
export const FAILURE_PERSONAL_PORTRAIT = 'FAILURE_PERSONAL_PORTRAIT' // 获取个人画像信息
export const requestPersonalPortrait = createAction(REQUEST_PERSONAL_PORTRAIT)
export const successPersonalPortrait = createAction(SUCCESS_PERSONAL_PORTRAIT)
export const failurePersonalPortrait = createAction(FAILURE_PERSONAL_PORTRAIT)

export const REQUEST_UPDATE_FOLLOW_LIST = 'REQUEST_UPDATE_FOLLOW_LIST' // 更新我的关注列表的数据
export const SUCCESS_UPDATE_FOLLOW_LIST = 'SUCCESS_UPDATE_FOLLOW_LIST' // 成功 更新我的关注列表的数据
export const FAILURE_UPDATE_FOLLOW_LIST = 'FAILURE_UPDATE_FOLLOW_LIST' // 失败 更新我的关注列表的数据
export const requestUpdateFollowList = createAction(REQUEST_UPDATE_FOLLOW_LIST)
export const successUpdateFollowList = createAction(SUCCESS_UPDATE_FOLLOW_LIST)
export const failureUpdateFollowList = createAction(FAILURE_UPDATE_FOLLOW_LIST)

export const REQUEST_APPEND_FOLLOW_LIST = 'REQUEST_APPEND_FOLLOW_LIST' // 添加关注我的列表的数据
export const SUCCESS_APPEND_FOLLOW_LIST = 'SUCCESS_APPEND_FOLLOW_LIST' // 成功 添加关注我的列表的数据
export const FAILURE_APPEND_FOLLOW_LIST = 'FAILURE_APPEND_FOLLOW_LIST' // 失败 添加关注我的列表的数据
export const requestAppendFollowList = createAction(REQUEST_APPEND_FOLLOW_LIST)
export const successAppendFollowList = createAction(SUCCESS_APPEND_FOLLOW_LIST)
export const failureAppendFollowList = createAction(FAILURE_APPEND_FOLLOW_LIST)

export const REQUEST_DO_CANCEL_FOLLOW = 'REQUEST_DO_CANCEL_FOLLOW' // 取消关注
export const SUCCESS_DO_CANCEL_FOLLOW = 'SUCCESS_DO_CANCEL_FOLLOW' // 取消关注
export const FAILURE_DO_CANCEL_FOLLOW = 'FAILURE_DO_CANCEL_FOLLOW' // 取消关注
export const requestDoCancelFollow = createAction(REQUEST_DO_CANCEL_FOLLOW)
export const successDoCancelFollow = createAction(SUCCESS_DO_CANCEL_FOLLOW)
export const failureDoCancelFollow = createAction(FAILURE_DO_CANCEL_FOLLOW)

export const REQUEST_DO_ADD_FOLLOW = 'REQUEST_DO_ADD_FOLLOW' // 添加关注
export const SUCCESS_DO_ADD_FOLLOW = 'SUCCESS_DO_ADD_FOLLOW' // 添加关注
export const FAILURE_DO_ADD_FOLLOW = 'FAILURE_DO_ADD_FOLLOW' // 添加关注
export const requestDoAddFollow = createAction(REQUEST_DO_ADD_FOLLOW)
export const successDoAddFollow = createAction(SUCCESS_DO_ADD_FOLLOW)
export const failureDoAddFollow = createAction(FAILURE_DO_ADD_FOLLOW)

export const REQUEST_CHECK_IS_FOLLOW = 'REQUEST_CHECK_IS_FOLLOW' // 检查是否关注了当前用户
export const SUCCESS_CHECK_IS_FOLLOW = 'SUCCESS_CHECK_IS_FOLLOW' // 检查是否关注了当前用户
export const FAILURE_CHECK_IS_FOLLOW = 'FAILURE_CHECK_IS_FOLLOW' // 检查是否关注了当前用户
export const requestCheckIsFollow = createAction(REQUEST_CHECK_IS_FOLLOW)
export const successCheckIsFollow = createAction(SUCCESS_CHECK_IS_FOLLOW)
export const failureCheckIsFollow = createAction(FAILURE_CHECK_IS_FOLLOW)

export const REQUEST_REMOVE_BLACKLIST = 'REQUEST_REMOVE_BLACKLIST' // 移除黑名单
export const SUCCESS_REMOVE_BLACKLIST = 'SUCCESS_REMOVE_BLACKLIST' // 移除黑名单
export const FAILURE_REMOVE_BLACKLIST = 'FAILURE_REMOVE_BLACKLIST' // 移除黑名单
export const requestRemoveBlacklist = createAction(REQUEST_REMOVE_BLACKLIST)
export const successRemoveBlacklist = createAction(SUCCESS_REMOVE_BLACKLIST)
export const failureRemoveBlacklist = createAction(FAILURE_REMOVE_BLACKLIST)

export const REQUEST_PUT_ON_BLACKLIST = 'REQUEST_PUT_ON_BLACKLIST' // 加入黑名单
export const SUCCESS_PUT_ON_BLACKLIST = 'SUCCESS_PUT_ON_BLACKLIST' // 加入黑名单
export const FAILURE_PUT_ON_BLACKLIST = 'FAILURE_PUT_ON_BLACKLIST' // 加入黑名单
export const requestPutOnBlacklist = createAction(REQUEST_PUT_ON_BLACKLIST)
export const successPutOnBlacklist = createAction(SUCCESS_PUT_ON_BLACKLIST)
export const failurePutOnBlacklist = createAction(FAILURE_PUT_ON_BLACKLIST)

export const SET_FORUM_POST_TOP = 'SET_FORUM_POST_TOP' // 前台设置置顶
export const SUCCESS_SET_FORUM_POST_TOP  = 'SUCCESS_SET_FORUM_POST_TOP' // 前台设置置顶
export const FAILURE_SET_FORUM_POST_TOP  = 'FAILURE_SET_FORUM_POST_TOP' // 前台设置置顶
export const setForumPostTop = createAction(SET_FORUM_POST_TOP)
export const successSetForumPostTop = createAction(SUCCESS_SET_FORUM_POST_TOP)
export const failureSetForumPostTop = createAction(FAILURE_SET_FORUM_POST_TOP)

export const SET_FORUM_POST_BOUTIQUE = 'SET_FORUM_POST_BOUTIQUE' //  前台设置加精
export const SUCCESS_SET_FORUM_POST_BOUTIQUE  = 'SUCCESS_SET_FORUM_POST_BOUTIQUE' // 前台设置加精
export const FAILURE_SET_FORUM_POST_BOUTIQUE  = 'FAILURE_SET_FORUM_POST_BOUTIQUE' // 前台设置加精
export const setForumPostBoutique = createAction(SET_FORUM_POST_BOUTIQUE)
export const successSetForumPostBoutique = createAction(SUCCESS_SET_FORUM_POST_BOUTIQUE)
export const failureSetForumPostBoutique = createAction(FAILURE_SET_FORUM_POST_BOUTIQUE)

export const LOGIN_TIMEOUT = 'LOGIN_TIMEOUT' // 登陆超时 Token过期
export const loginTimeout = createAction(LOGIN_TIMEOUT)






