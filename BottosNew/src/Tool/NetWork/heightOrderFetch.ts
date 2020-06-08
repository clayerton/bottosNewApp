import { DeviceEventEmitter } from 'react-native'
import { Toast } from 'antd-mobile-rn'
import BTFetch from "./BTFetch";
import { getRequestBody, devlog, getRequestURL } from "../FunctionTool";
import Config from '../Config';
import I18n from '../Language'

export interface Res {
  code: string;
  msg: string;
  data: any;
}
/**
 * 带上用户信息的请求
 * 封装以方便使用
 * 不用每次都调用 getRequestBody
 * @param  url  指定的 url 后面部分
 * @param  body 指定的请求体
 * @param  callback 可选的回调函数
 * @return      根据是否传入了 callback 来决定是调用 callback 还是返回 fetch 请求
 */
export function requestWithBody(url: string, body: object, callback?: (res: any) => void) {
  let requestBody = getRequestBody(body);
  const f = BTFetch(url, requestBody)
  if (typeof callback == 'function') {
    f.then((res: Res) => {
      Toast.hide()
      if (res.code === '0') {
        callback(res)
      } else if (res.code === '99') {
        DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg);
      } else {
        Toast.fail(res.msg, Config.ToestTime, undefined, false)
      }
    }).catch(err => {
      Toast.hide()
        Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
    })
  } else {
    return f
  }
}


function _postFormData(url: string, formData) {
  let requestURL: string = getRequestURL() + Config.URLSuffix + url;
  let myHeaders = new Headers()
  myHeaders.append('Content-Type', 'multipart/form-data')

  let init = {
    method: 'POST',
    headers: myHeaders,
    body: formData
  }

  return fetch(requestURL, init).then((res) => res.json())
}


/**
 * 需要发送文件的时候，就需要使用 FormData 格式
 * 这是基于 FormData 的请求
 * @param url 指定的 url
 * @param formData 
 */
export function requestWithFile(url: string, formData) {
  // 用户及设备信息
  let reqHeader = getRequestBody().reqHeader
  formData.append('reqHeader', JSON.stringify(reqHeader))

  return _postFormData(url, formData)
}
