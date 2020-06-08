import BTFetch from '../../Tool/NetWork/BTFetch'
import { getRequestBody } from '../../Tool/FunctionTool'

/**
 * 获取有资产的月份数组
 */
export async function fetchMemberAssetsUsefulDate(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/member/getMemberAssetsUsefulDate', requestBody)
}

/**
 * 资产列表
 * @param {*} asset_type
 * @param {*} date
 * @param {*} page
 * @param {*} page_size
 */
export async function fetchMemberAssetsList(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/member/getMemberAssetsList', requestBody)
}

/**
 * 资产币种列表
 */
export async function fetchMemberAssets(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/member/getMemberAssets', requestBody)
}

/**
 * 兑换 兑换码
 * @param {*} redeem 兑换码
 */
export async function convertRedeemUse(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/member/RedeemUse', requestBody)
}

/**
 * 资产传出 基本信息
 */
export async function fetchWithdrawConfig(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/withdraw/withdrawConfig', requestBody)
}

/**
 * 转出方式列表
 */
export async function fetchWithdrawChainList(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/withdraw/chainList', requestBody)
}

/**
 * 转出
 * @param {*} dst_account 目标用户
 * @param {*} chain_type 链类型
 * @param {*} value 转账金额
 * @param {*} token_type 转账币种，就是currency_id
 * @param {*} pay_password 支付密码
 */
export async function fetchWithdrawDeposit(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/withdraw/withdrawDeposit', requestBody)
}

/**
 * 转出发验证码
 * @param {*} mobile 电话
 * @param {*} code 验证码
 */
export async function sendWithdrawMobileCodeVerify(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/withdraw/mobileCodeVerify', requestBody)
}

/**
 * 验证用户权限
 * @param {*} token_type 转账币种，就是currency_id
 */
export async function  checkWithdrawJurisdiction(body) {
  let requestBody = getRequestBody(body)
  return BTFetch('/withdraw/withdrawJurisdiction', requestBody)
}

