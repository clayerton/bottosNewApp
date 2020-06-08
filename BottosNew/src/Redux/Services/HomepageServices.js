
import BTFetch from '../../Tool/NetWork/BTFetch'
import { getRequestBody } from '../../Tool/FunctionTool'


/**
 * 请求主页列表
 * @param {*} page 
 * @param {*} page_size
 */
export async function fetchHomepageForumList(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/forum/forumList', requestBody)
}


/**
 * 请求主页频道列表
 * @param {*} page 
 * @param {*} page_size
 */
export async function fetchHomepageForumPostList(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/forum/forumPostList', requestBody)
}


/**
 * 关注论坛和取消关注
 * @param {*} forum_id 
 * @param {*} status 为1则关注，为0则为取消关注  传输为string
 * 
 */
export async function doAddAndCancelFollowForum(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/forum/followForum', requestBody)
}


