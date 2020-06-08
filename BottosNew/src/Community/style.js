import { StyleSheet, Platform, Dimensions } from 'react-native'

// TEMP: 为了先直接把之前的挪过来，定义一下 ScreenUtil
const { width, height } = Dimensions.get('window')
let [screenW, screenH] = [width, height]

const DEFAULT_DENSITY = 2
//px转换成dp
//以iphone6为基准,如果以其他尺寸为基准的话,请修改下面的750和1334为对应尺寸即可.
const w2 = 411 / DEFAULT_DENSITY
//px转换成dp
const h2 = 731 / DEFAULT_DENSITY

/**
 * 设置字体的size（单位px）
 * @param size 传入设计稿上的px
 * @returns {Number} 返回实际sp
 */
function setSpText(size: Number) {
  let scaleWidth = screenW / w2
  let scaleHeight = screenH / h2
  let scale = Math.min(scaleWidth, scaleHeight)
  size = Math.round(size * scale + 0.5)
  return size / DEFAULT_DENSITY
}

const ScreenUtil = { setSpText, scaleSize: setSpText }

// 下面就是样式了
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  //统一头部样式
  headerContent: {
    height: ScreenUtil.scaleSize(50),
    backgroundColor: '#444A59',
    ...Platform.select({
      ios: {
        paddingTop: ScreenUtil.scaleSize(20)
      },
      android: {}
    }),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: ScreenUtil.scaleSize(10),
    paddingRight: ScreenUtil.scaleSize(10)
  },
  headerImg: {
    width: ScreenUtil.scaleSize(16),
    height: ScreenUtil.scaleSize(16)
  },
  rightButton: {
    height: ScreenUtil.scaleSize(50),
    width: ScreenUtil.scaleSize(40),
    justifyContent: 'center',
    alignItems: 'center'
  },
  publishButton: {
    width: 18,
    height: 18
  },

  title1: {
    backgroundColor: '#444A59',
    height: ScreenUtil.scaleSize(70),
    paddingBottom: ScreenUtil.scaleSize(14),
    width: width,
    paddingLeft: ScreenUtil.scaleSize(15),
    paddingRight: ScreenUtil.scaleSize(15),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  left: {
    display: 'flex',
    justifyContent: 'flex-start',
    fontSize: ScreenUtil.setSpText(10),
    paddingBottom: ScreenUtil.scaleSize(7)
  },
  backIcon: {
    width: ScreenUtil.scaleSize(20),
    height: ScreenUtil.scaleSize(15),
    fontSize: ScreenUtil.setSpText(14),
    color: '#FFFFFF'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    left: 25
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: ScreenUtil.setSpText(10),
    color: '#72BEFF',
    height: ScreenUtil.scaleSize(60),
    width: ScreenUtil.scaleSize(60),
    paddingTop: ScreenUtil.scaleSize(20),
    paddingLeft: ScreenUtil.scaleSize(30)
  },
  main: {
    marginTop: ScreenUtil.scaleSize(25),
    backgroundColor: '#fff',
    borderRadius: 10
  },
  title_header: {
    textAlign: 'center',
    fontSize: ScreenUtil.setSpText(16),
    color: '#fff'
  },
  banner: {
    height: ScreenUtil.scaleSize(99)
  },
  txt: {
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  //帖子组件样式

  img_item: {
    width: ScreenUtil.scaleSize(36),
    height: ScreenUtil.scaleSize(36)
  },

  bottom: {
    height: 30,
    lineHeight: 30,
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  },
  /*输入框*/
  inputContainer: {
    width: width,
    height: 40
  },
  inputView: {
    flex: 9,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginTop: 5,
    paddingLeft: 5,
    marginRight: 10,
    height: 40,
    lineHeight: 20,
    color: '#2F2F2F',
    fontSize: ScreenUtil.setSpText(14)
  },
  enter: {
    marginTop: 5,
    color: '#999999',
    justifyContent: 'center',
    alignItems: 'center',
    width: ScreenUtil.scaleSize(44),
    height: ScreenUtil.scaleSize(30),
    lineHeight: ScreenUtil.scaleSize(30),
    textAlign: 'center',
    fontSize: ScreenUtil.setSpText(16),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3e3e3'
  },

  postings: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  item_report: {
    borderWidth: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  emptyDataSource: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 50
  },
  emptySearchResult: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 50
  }
})
export default styles
