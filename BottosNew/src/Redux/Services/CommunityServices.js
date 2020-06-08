
import BTFetch from '../../Tool/NetWork/BTFetch'
import { getRequestBody } from '../../Tool/FunctionTool'

/**
 *  菜单栏数据
 */
export async function fetchHomePageList(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/homepage/homePageList', requestBody)
}

/**
 *  置顶的数据详情
 */
export async function fetchPostTopPost(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/post/topPost', requestBody)
}

/**
 * 请求帖子列表
 * @param {*} page 
 * @param {*} page_size
 */
export async function fetchPostBrowsePost(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/post/browsePost', requestBody)
}


/**
 * 请求帖子列表
 * @param {*} key  菜单栏Key
 */
export async function fetchHomePageContent(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/homepage/homePageContent', requestBody)
}


/**
 * 点赞
 * @param {*} post_id 
 */
export async function doFollowPraise(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/post/followPraise', requestBody)
}


/**
 * 获取未读消息数
 */
export async function updateUnreadMessage(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/message/get_unread_num', requestBody)
}

/**
 * 回帖
 * @param {*} post_id 
 * @param {*} follow_id 
 * @param {*} content 
 */
export async function sendFollowPost(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/post/followPost', requestBody)
}


/**
 * 帖子详情
 * @param {*} post_id 
 */
export async function fetchPostDetail(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/post/detail', requestBody)
}



/**
 * 删除帖子或删除回复
 * @param {*} post_id 
 * @param {*} reply_id 
 */
export async function doDeletePost(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/post/deletePost', requestBody)
}


// export async function doDeletePost(body) {
//   let requestBody = getRequestBody(body)
//   return BTFetch('/forum/setForumPost', requestBody)
// }


/**
 * 统计帖子数
 * @param {*} post_id 
 * @param {*} post 
 */
export async function doPostReadCount(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/post/postReadCount', requestBody)
}
