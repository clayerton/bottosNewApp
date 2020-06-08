import { AsyncStorage, Platform } from 'react-native'
import Storage from 'react-native-storage'
import UserInfo from './UserInfo'
import Config from './Config'
import { URL_REG, EMOJI_REG } from './Const'
import * as emoticons from './View/Emoticons'

let storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true

  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync方法，无缝返回最新数据。
  // sync方法的具体说明会在后文提到
  // 你可以在构造函数这里就写好sync的方法
  // 或是写到另一个文件里，这里require引入
  // 或是在任何时候，直接对storage.sync进行赋值修改
  // sync: require('./sync')  // 这个sync文件是要你自己写的
})

/**
 * getLocalStorage 获取 storage 信息
 * @param { 键 } key
 * @param { 成功回调 } retCallback
 * @param { 失败回调 } errCallback
 */
export const getLocalStorage = (key, retCallback, errCallback) => {
  return storage
    .load({
      key: key,
      // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
      autoSync: false,
      // syncInBackground(默认为true)意味着如果数据过期，
      // 在调用sync方法的同时先返回已经过期的数据。
      // 设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
      syncInBackground: true,
      // 你还可以给sync方法传递额外的参数
      syncParams: {
        extraFetchOptions: {
          // 各种参数
        },
        someFlag: true
      }
    })
    .then(ret => {
      retCallback && retCallback(ret)
    })
    .catch(err => {
      errCallback && errCallback(err)
    })
}

//清除某个key下的所有数据
export const clearMapForKey = key => {
  return storage.remove({
    key: key
  })
}

/**
 * setLocalStorage 设置 storage 信息
 * @param { 键 } key
 * @param { 数据 } data
 */
export const setLocalStorage = (key, data) => {
  return storage.save({
    key: key,
    data: data,
    expires: null
  })
}

//获取完整body
export const getRequestBody = body => {
  let today = new Date()

  let requestBody = {
    reqHeader: {
      token: UserInfo.token,
      deviceInfo: {
        screenW: UserInfo.screenW,
        screenH: UserInfo.screenH,
        brand: UserInfo.brand,
        buildNumber: UserInfo.buildNumber,
        version: UserInfo.version,
        isEmulator: UserInfo.isEmulator,
        carrier: UserInfo.carrier,
        deviceCountry: UserInfo.deviceCountry,
        deviceLocale: UserInfo.deviceLocale,
        deviceIPAddress: UserInfo.deviceIPAddress,
        deviceMACAddress: UserInfo.deviceMACAddress,
        model: UserInfo.model,
        systemName: UserInfo.systemName,
        systemVersion: UserInfo.systemVersion,
        timezone: UserInfo.timezone,
        uniqueId: UserInfo.uniqueId,
        timestamp: today.getTime(),
        randomNumber: Math.ceil(Math.random() * 100000)
      }
    },
    reqBody: body
  }

  return requestBody
}

/**
 * 检测app版本是否相同
 * @param {当前版本} ver1
 * @param {更新版本} ver2
 * true => 版本号相同
 * false => 版本号不同
 */
export const versionfunegt = (ver1, ver2) => {
  let version1pre = parseFloat(ver1)
  let version2pre = parseFloat(ver2)
  let version1next = ver1.replace(version1pre + '.', '')
  let version2next = ver2.replace(version2pre + '.', '')
  if (version1pre > version2pre) {
    return true
  } else if (version1pre < version2pre) {
    return false
  } else {
    if (version1next >= version2next) {
      return true
    } else {
      return false
    }
  }
}

/**
 * version 版本对比
 * @param {*} v1
 * @param {*} v2
 * return false: v1 版本比 v2 小
 * return true: v1 版本比 v2 大&&相等
 */
export const versionCompare = (v1, v2) => {
  let arr1 = v1.replace(/[-_]/g, '.').split('.')
  let arr2 = v2.replace(/[-_]/g, '.').split('.')
  let len = Math.max(arr1.length, arr2.length)
  for (let i = 0; i < len; i++) {
    if (parseInt(arr1[i]) === parseInt(arr2[i])) continue
    return parseInt(arr1[i]) > parseInt(arr2[i]) ? true : false
  }
  return true
}

/**
 * 将 Unix 时间戳转换成时间字符串
 * @param  {number} ts 时间戳
 * @param  {string} [sep='-'] 年月日的分隔符，默认为 '-'
 * @return {string} 默认输出的时间格式为 yyyy-mm-dd hh:mm:ss
 */
export function transTimeToString(ts: number, sep: string = '-'): string {
  var t, y, m, d, h, i, s
  t = ts ? new Date(ts * 1000) : new Date()
  y = t.getFullYear() // 年
  m = t.getMonth() + 1 // 月
  d = t.getDate() // 日
  h = t.getHours()
  i = t.getMinutes()
  s = t.getSeconds()
  // 可依据须要在这里定义时间格式
  return (
    y +
    sep +
    (m < 10 ? '0' + m : m) +
    sep +
    (d < 10 ? '0' + d : d) +
    ' ' +
    (h < 10 ? '0' + h : h) +
    ':' +
    (i < 10 ? '0' + i : i) +
    ':' +
    (s < 10 ? '0' + s : s)
  )
}

/**
 * 接受一个数组作为参数
 * 数组的每一项均为组件
 * 要求此组件的组件名为路由名
 * @param {object} StackRouteConfigs 配置路由的对象
 * @param {Array<React.Component>} component 一个或多个组件
 */
export function addStackRoutes(StackRouteConfigs: object, components): void {
  for (let component of components) {
    let routeName = component.displayName || component.name
    if (component.WrappedComponent) {
      const wrapped = component.WrappedComponent
      routeName = wrapped.displayName || wrapped.name
    }
    StackRouteConfigs[routeName] = {
      screen: component
    }
  }
}

/**
 * 开发模式下的 log
 * 这样就不用考虑生产环境注释 log
 */
export function devlog() {
  if (process.env.NODE_ENV === 'development') {
    console.log.apply(console, arguments)
  }
}

// iPhoneX
const X_WIDTH = 375
const X_HEIGHT = 812
const iPhone8P_WIDTH = 414
const iPhone8P_HEIGHT = 736

/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
export function isIPhoneX() {
  return (
    Platform.OS === 'ios' &&
    (UserInfo.screenH === X_HEIGHT && UserInfo.screenW === X_WIDTH)
  )
}

export function isiPhone8P() {
  return (
    Platform.OS === 'ios' &&
    (UserInfo.screenH === iPhone8P_HEIGHT &&
      UserInfo.screenW === iPhone8P_WIDTH)
  )
}

/**
 * 检测手机系统设置是否为中文语言
 * true => 中文
 * false => 非中文
 */
export const isZHLanguage = () => {
  return /^zh/.test(UserInfo.deviceLocale)
}

/**
 * 前缀补零
 * @param {*} num 传入参数
 * @param {*} length 补零长度
 */
export const prefixPadding0 = (num, length) => {
  return (Array(length).join('0') + num).slice(-length)
}

/**
 * 判断是否有 四字节字符
 * @param {string} s 要判断的字符串
 * @return {boolean}
 */
export function hasEmoji(s) {
  const len = s.length
  for (let i = 0; i < len; i++) {
    const point = s.codePointAt(i)
    if (point > 0xffff) {
      return true
    }
  }
  return false
}

/**
 * pack 包含四字节字符的字符串
 * @param {string} s 要 pack 的字符串
 * @return {string}
 */
export function packStr(s) {
  const len = s.length
  const a = []
  var j = 0
  do {
    let point = s.codePointAt(j)
    a.push(point)
    // 如果是 四字节 字符
    if (point > 0xffff) {
      j += 2
    } else {
      j += 1
    }
  } while (j < len)
  return JSON.stringify(a)
}

export function unPack(s) {
  try {
    const a = JSON.parse(s)
    return String.fromCodePoint.apply(null, a)
  } catch (error) {
    return s
  }
}

/**
 * 获取RequestURL地址
 */
export const getRequestURL = () => {
  if (Config.IPAddress.length > 0) {
    return Config.IPAddress[0].url
  }
}

/**
 * 返回用户 v 等级
 * @param {undefined|string} group_id
 * @return {null|number} null 是没有，number 就是图片资源
 */
export function calc_v_level_img(group_id?: string) {
  // 如果不存了或者为 0，返回 null
  if (group_id == undefined || group_id == '0') {
    return null
  }
  const arr = group_id.split(',')
  if (arr.includes('9')) {
    // 包含字符串 9
    return require('../BTImage/group_id_vip_9.png')
  }else if(arr.includes('8')){
    // 包含字符串 8
    return require('../BTImage/group_id_vip_8.png')
  }else if (arr.includes('2')) {
    // 包含字符串 2
    return require('../BTImage/group_id_vip_2.png')
  } else if (arr.includes('1')) {
    // 包含字符串 1
    return require('../BTImage/group_id_vip_1.png')
  } else {
    // 以上都不符合
    return null
  }
}

export const contentStringHaveEmoji = text => {
  var regex = new RegExp(EMOJI_REG)
  var regArray = regex.test(text)
  return regArray
}

export const contentStringHaveURL = text => {
  var regex = new RegExp(URL_REG)
  var regArray = regex.test(text)
  return regArray
}

export const contentStringHaveURL1 = text => {
  var regex = new RegExp(URL_REG, 'g')
  let regArray = text.match(regex)
  return regArray
}

/**
 * 将文字中的URL匹配出来
 * @param {*} string
 */
export const enumerateURLStringsMatchedByRegex = string => {

  const regex = new RegExp(URL_REG, 'g')
  let contentArray = []
  let regArray = string.match(regex)
  if (regArray === null) {
    contentArray.push({ Content: string })
    return contentArray
  }

  let indexArray = []
  let pos = string.indexOf(regArray[0]) //头
  for (let i = 1; i < regArray.length; i++) {
    indexArray.push(pos)
    pos = string.indexOf(regArray[i], pos + 1)
  }
  indexArray.push(pos) //尾

  for (let i = 0; i < indexArray.length; i++) {
    if (indexArray[i] === 0) {
      contentArray.push({
        url: string.substr(0, regArray[i].length),
        attr: { Type: '0' }
      })
    } else {
      if (i === 0) {
        contentArray.push({ Content: string.substr(0, indexArray[i]) })
      } else {
        if (indexArray[i] - indexArray[i - 1] - regArray[i - 1].length > 0) {
          contentArray.push({
            Content: string.substr(
              indexArray[i - 1] + regArray[i - 1].length,
              indexArray[i] - indexArray[i - 1] - regArray[i - 1].length
            )
          })
        }
      }
      contentArray.push({
        url: string.substr(indexArray[i], regArray[i].length),
        attr: { Type: '0' }
      })
    }
  }

  let lastLocation =
    indexArray[indexArray.length - 1] + regArray[regArray.length - 1].length
  if (string.length > lastLocation) {
    contentArray.push({
      Content: string.substr(lastLocation, string.length - lastLocation)
    })
  }
  return contentArray
}
/**
 *
 *
 *
 */
export const getImageURL = url => {
  if (!url) {
    return ''
  }
  let tempImageURL = 'https://app.botfans.org/'
  let isHttps = /^http/.test(url)
  if (isHttps) {
    return url
  } else if (getRequestURL() == tempImageURL) {
    return tempImageURL + url
  } else {
    let imageURL = isHttps ? url : Config.ImageURL + url
    return imageURL
  }
}


/**
 * 将字符串中替换成emoji输出
 * @param {*} string 字符串
 */
export const stringToEmoji = (string) => {

  if (contentStringHaveEmoji(string)) {
    string = emoticons.parse(string)
  }

  return string
}