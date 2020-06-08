import Config from '../Config'
import {devlog} from "../FunctionTool";

const IPAddress = Config.IPAddress

export default (url, body, data) => {
  let method = 'POST'
  let IPIndex = 0
  if (data !== undefined && data.method !== undefined) {
    method = data.method
  }

  const requestData = {
    timeout: 10000, // 默认请求超时时间
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  if (method === 'GET') {
    let str = getGetUrl(body)
    requestURL += str
  } else {
    requestData.body = JSON.stringify(body)
  }
  return fetchURL(IPAddress[IPIndex], url, requestData)
}

const fetchURL = (currentIP, url, requestData) => {
  let requestURL = currentIP.url + Config.URLSuffix + url
  let requestData2 = Object.assign({}, requestData)

    // devlog('----requestURL---',requestURL);
    // devlog('----requestData---',requestData);

  return fetch(requestURL, requestData)
    .then(checkStatus)
    .then(parseJSON)
    .then(response => {
      // console.log('response', response)
      return response
    })
    .catch(error => {
      let indexIP = currentIP.index
      indexIP++
      if (indexIP < IPAddress.length) {
        return fetchURL(IPAddress[indexIP], url, requestData2)
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('BTFetch url: ', url)
        console.log('BTFetch error: ', error)
      }

      return {code:'-1',msg:Config.ToestFailContent}
    })
}

//返回get请求的请求地址
const getGetUrl = params => {
  let str = ''
  if (typeof params === 'object' && params) {
    str += '?'
    for (let i in params) {
      str += i + '=' + params[i] + '&'
    }
  }
  return str
}

const parseJSON = response => {
  return response.json()
}

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}
