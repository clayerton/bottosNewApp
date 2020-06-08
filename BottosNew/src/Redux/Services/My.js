import BTFetch from '../../Tool/NetWork/BTFetch'
import { getRequestBody } from '../../Tool/FunctionTool'

/**
 * 获取个人画像信息
 * @param {*} mobile
 */
export async function fetchPersonalPortrait(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/member/getPersonalPortrait', requestBody)
}

/**
 * 获取关注列表
 * @param {*} page
 * @param {*} page_size
 */
export async function fetchFollowList(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/follow/my_follow_list', requestBody)
}

/**
 * 取消关注
 * @param {*} from 需要member_id
 */
export async function doCancelFollow(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/follow/cancel', requestBody)
}

/**
 * 添加关注
 * @param {*} from member_id
 * @param {*} mobile mobile
 * @param {*} myMobile myMobile
 */
export async function doAddFollow(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/follow/add', requestBody)
}

/**
 * 检查是否关注了当前用户
 * @param {*} from  需要member_id
 */
export async function checkIsFollow(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/follow/is_follow', requestBody)
}

/**
 * 前台设置加精，加指定
 * @param {* 必填参数} post_id 
 * @param {* 必填参数} forum_id
 * @param {* 可选参数} is_top 
 * @param {* 可选参数} is_boutique 
 */
export async function setForumPost(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/forum/setForumPost', requestBody)
}

