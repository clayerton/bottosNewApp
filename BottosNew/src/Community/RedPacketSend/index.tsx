import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Dimensions,
  ScrollView,
  DeviceEventEmitter
} from 'react-native'
import { Toast } from 'antd-mobile-rn'
import { PasswordModal } from 'react-native-pay-password'
import { NavigationScreenProp, NavigationLeafRoute } from 'react-navigation'

// 方法
import I18n from '../../Tool/Language'
import NavStyle from '../../Tool/Style/NavStyle'
import { fcBlue } from '../../Tool/Style/FontStyle'

import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity'
import Config from '../../Tool/Config'
import { requestWithBody, Res } from '../../Tool/NetWork/heightOrderFetch'
import UserInfo from '../../Tool/UserInfo'
import {
  devlog,
  isZHLanguage,
  hasEmoji,
  enumerateURLStringsMatchedByRegex
} from '../../Tool/FunctionTool'
// 自有组件
import BTBackButton from '../../Tool/View/BTBackButton'
import BorderedBox, { styles as BBStyles } from './BorderedBox'
import CoinTypeSelect, { CoinInfo } from './CoinTypeSelect'
import BottomModal from '../../Tool/View/BottomModal'
import BTWaitView from '../../Tool/View/BTWaitView'
import LongButton from '../../Tool/View/BTButton/LongButton'
import Luck from './Luck'
import * as emoticons from '../../Tool/View/Emoticons'

const { width } = Dimensions.get('window')
const MAX_RED_PACKET_NUMBER = 99
const MIN_RED_PACKET_NUMBER = 10

// 导航栏选项
const navigationOptions = () => {
  return {
    headerLeft: BTBackButton,
    headerTitle: I18n.t('community.red_packet_send'),
    headerRight: <TouchableOpacity style={NavStyle.rightButton} />
  }
}

interface RedPacketRequestBody {
  total: string // 总金额，单个金额都是传这个字段
  pieces: string // 红包个数
  intro: string // 附加的内容
  only_follow: string //粉丝红包
  type: number // 1 是 拼手气，2 是 普通红包
  currency_id: number // 这个代表币种，通过 /member/getMemberAssets 这个请求获取
  password: string // 输入的密码
  forum_id:number
}

type Navigation = NavigationScreenProp<NavigationLeafRoute<undefined>>

interface Props {
  navigation: Navigation
}

interface State {
  is_lucky: boolean
  is_fans: boolean
  red_packet_number: string
  red_packet_amount: string
  one_red_packet_amount: string
  coin_infos: CoinInfo[]
  coin_name: string
  modal_show: boolean
  addition_text: string
  number_valid: boolean
  amount_valid: boolean
  msg: string
}

class RedPacketSend extends PureComponent<Props, State> {
  static displayName = 'RedPacketSend'

  static navigationOptions = navigationOptions

  myRef = React.createRef()

  constructor(props: Props) {
    super(props)
    this.state = {
      is_lucky: true, // true 则是拼手气，false 是普通模式
      is_fans: false, // true 则是粉丝红包，false 是普通模式
      red_packet_number: '', // 红包个数
      red_packet_amount: '', // 红包总金额，拼手气模式的时候用这个
      one_red_packet_amount: '', // 单个红包金额，普通模式用这个
      coin_infos: [], // 持有的币的信息
      coin_name: 'DTO', // 当前选中的币种
      modal_show: false, // modal 框的 visible
      addition_text: '', // 附加文字

      number_valid: false,
      amount_valid: false,
      msg: ''
    }



  }


  
  // 切换红包模式，是普通模式还是拼手气
  changeRedPacketMode = () => {
    this.setState({
      is_lucky: !this.state.is_lucky,
      red_packet_amount: '',
      one_red_packet_amount: ''
    })
  }
  // 切换粉丝模式
  changeFansMode = () => {
    this.setState({
      is_fans: !this.state.is_fans
    })
  }

  // 红包个数
  handleNumberChange = (text: string) => {
    text = text.replace(/[-|,| |.]/, '')
    let num = Number.parseInt(text)

    const valid = this.checkRPNumber(num)

    const { one_red_packet_amount, is_lucky, red_packet_amount } = this.state
    // 如果处于普通模式，也要计算总金额
    if (is_lucky == false && Number(one_red_packet_amount) > 0) {
      let red_packet_amount_num = Number(one_red_packet_amount) * num
      this.setState({ red_packet_amount: red_packet_amount_num.toString() })
      if (valid) {
        this.checkAmount(red_packet_amount_num)
      }
    }
    if (is_lucky && Number(red_packet_amount) > 0 && valid) {
      this.checkAmount(red_packet_amount)
    }

    this.setState({ red_packet_number: text })
  }

  // 当处于普通模式的时候，单个红包金额的改变
  handleOneRedPacketAmountChange = (text: string) => {
    text = text.replace(/[-|,| ]/, '')

    // 限制小数点的位数为 6 位
    const index = text.indexOf('.')
    if (index > -1 && text.length - index - 1 > 6) {
      return
    }

    // 红包总金额初始化
    let red_packet_amount = 0
    // 单个红包金额
    let single_money = Number(text)

    // 如果红包个数大于 0
    const red_packet_number = Number.parseInt(this.state.red_packet_number) // 红包数

    if (red_packet_number > 0) {
      // 计算红包总金额
      red_packet_amount = red_packet_number * single_money
      let valid = this.checkAmount(red_packet_amount)
      if (valid) {
        this.checkRPNumber(red_packet_number)
      }
    }

    this.setState({
      one_red_packet_amount: text,
      red_packet_amount: red_packet_amount.toString()
    })
  }

  // 当处于拼手气模式的时候
  handleLuckRedPacketAmountChange = (text: string) => {
    text = text.replace(/[-|,| ]/, '')

    // 限制小数点的位数为 6 位
    const index = text.indexOf('.')
    if (index > -1 && text.length - index - 1 > 6) {
      return
    }

    // 红包总金额不能大于 1 亿
    let valid = this.checkAmount(text)
    const red_packet_number = this.state.red_packet_number // 红包个数

    if (valid && red_packet_number != '') {
      this.checkRPNumber(Number(red_packet_number))
    }

    this.setState({
      red_packet_amount: text
    })
  }

  // 限制总金额
  checkAmount = (amount: string | number): boolean => {
    let num = Number(amount)

    const { coin_infos, coin_name } = this.state

    let current_info, // 当前币种的参数
      value = 0 // 币种的数量
    if (coin_infos.length > 0) {
      current_info = coin_infos.find(ele => ele.name == coin_name)
    }
    if (current_info != undefined) {
      value = current_info.value ? Number(current_info.value) : 0
    }

    let amount_valid = false

    if (num == 0) {
      this.setState({ amount_valid, msg: '' })
    } else if (Number.isNaN(num)) {
      this.setState({ amount_valid, msg: I18n.t('community.rp_input_valid') })
    } else if (num > 1e8) {
      this.setState({
        amount_valid,
        msg: I18n.t('community.rp_amount_no_more_than') + 1e8
      })
    } else if (num < 1) {
      this.setState({
        amount_valid,
        msg: I18n.t('community.rp_amount_no_less_than') + '1'
      })
    } else if (num > value) {
      this.setState({
        amount_valid,
        msg: I18n.t('community.rp_amount_no_more_than_coin') + coin_name
      })
    } else {
      amount_valid = true
      this.setState({ amount_valid, msg: '' })
    }
    return amount_valid
  }

  // 检查红包个数
  checkRPNumber = (num: number) => {
    // 没有输入的时候，不给 msg
    let number_valid = false
    if (num == 0 || Number.isNaN(num)) {
      this.setState({ number_valid, msg: '' })
    } else if (num > MAX_RED_PACKET_NUMBER) {
      this.setState({
        number_valid,
        msg: I18n.t('community.rp_num_no_more_than') + MAX_RED_PACKET_NUMBER
      })
    } else if (num < MIN_RED_PACKET_NUMBER) {
      this.setState({
        number_valid,
        msg: I18n.t('community.rp_num_no_less_than') + MIN_RED_PACKET_NUMBER
      })
    } else {
      number_valid = true
      this.setState({ number_valid, msg: '' })
    }
    return number_valid
  }

  // 控制 modal 的显示
  toggleModalVisible = (visible?: boolean) => {
    const current_visible = this.state.modal_show
    // 未传参数，则直接取反
    // 传了参数，如果与现在不同，则 setState
    if (visible == undefined) {
      this.setState({ modal_show: !current_visible })
    } else if (visible !== current_visible) {
      this.setState({ modal_show: visible })
    }
  }

  // 关闭 modal，同时关闭键盘
  closeModal = () => {
    this.setState({ modal_show: false })
    Keyboard.dismiss()
  }

  // 获取所有币种和币量，每次选择都会重新请求
  getCoinInfo = () => {
    Toast.loading(I18n.t('tip.wait_text'), 0)

    requestWithBody('/member/getMemberAssets', {}, (res: Res) => {
      this.setState({ coin_infos: res.data })
    })
  }

  // 当所选的币种被点击的时候
  handleCoinChange = (coin_name: string) => {
    const { coin_name: pre_coin_name, modal_show } = this.state
    if (coin_name != pre_coin_name) {
      this.setState({ coin_name })
    }

    if (modal_show) {
      this.closeModal()
    }
  }

  // 点击按钮
  handlePackRedPacket = () => {
    const node = this.myRef.current
    node.show()
  }

  // 输入密码的回调
  // 发送红包的请求就在这里
  handlePasswordInput = (password: string) => {
    const { forumId } = this.props
    const {
      red_packet_number,
      red_packet_amount,
      one_red_packet_amount,
      coin_infos,
      coin_name,
      is_lucky,
      is_fans
    } = this.state

    let currency_id = 1
    coin_infos.forEach(ele => {
      if (ele.name == coin_name) {
        currency_id = ele.currency_id
      }
    })
    let addition_text = this.state.addition_text

    if (hasEmoji(addition_text)) {
      addition_text = emoticons.stringify(addition_text)
    }

    const body: RedPacketRequestBody = {
      total: is_lucky ? red_packet_amount : one_red_packet_amount,
      pieces: red_packet_number,
      intro: addition_text || '恭喜发财',
      only_follow: is_fans ? '1' : '0',
      type: is_lucky ? 1 : 2,
      currency_id,
      password
    }

    if (forumId) {
      body.forum_id = forumId
    }
    Toast.loading(I18n.t('tip.wait_text'), 0)

    requestWithBody('/giftpack/sendGiftpack', body)
      .then((res: Res) => {
        Toast.hide()
        const { code, msg } = res
        if (code == '-3') {
          // 说明没有设置支付密码
          Toast.fail(msg, Config.ToestTime)
        } else if (code == '0') {
          Toast.success(msg, Config.ToestTime)
          this.props.navigation.goBack()
          DeviceEventEmitter.emit('REFRESH_POST') // 刷新帖子
        } else {
          Toast.fail(msg, Config.ToestTime)
        }
      })
      .catch(() => {
        Toast.offline(I18n.t('tip.offline'), Config.ToestTime, undefined, false)
      })
  }

  handleBlur = () => {
    // Keyboard.dismiss()
  }

  componentDidMount() {
    this.getCoinInfo()
  }

  render() {
    const {
      is_lucky,
      is_fans,
      modal_show,
      red_packet_number,
      coin_infos,
      coin_name,
      red_packet_amount,
      addition_text,
      number_valid,
      amount_valid,
      msg
    } = this.state

    const isEnable = number_valid && amount_valid && coin_infos.length > 0 // 是否可以点击发红包

    const valid_coin_infos = coin_infos.filter(ele => ele.value != null)

    const modal_height = valid_coin_infos.length < 4 ? 350 : 450

    return (
      <View style={styles.container}>
        <ScrollView
          ref="scrollView"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardDismissMode={'on-drag'}
          style={{ flex: 1 }}>
          {/* 红包个数输入框 */}
          <BorderedBox
            leftEle={<Text>{I18n.t('community.rp_number')}</Text>}
            rightEle={
              <React.Fragment>
                <TextInput
                  style={styles.input}
                  placeholder="输入个数"
                  underlineColorAndroid="transparent"
                  keyboardType="numeric"
                  onChangeText={this.handleNumberChange}
                  value={red_packet_number}
                  onBlur={this.handleBlur}
                />
                <Text> 个</Text>
              </React.Fragment>
            }
          />

          {!isEnable && msg != '' && (
            <View style={styles.noticeBar}>
              <Text style={styles.noticeText}>{msg}</Text>
            </View>
          )}

          {/* 粉丝类型的切换 */}
          <View style={[styles.flexBox, { marginTop: 10 }]}>
            <Text style={styles.smallText}>
              {is_fans
                ? I18n.t('community.current_fans_left')
                : I18n.t('community.current_all_left')}
              ，
            </Text>
            <ThrottledTouchableOpacity
              onPress={this.changeFansMode}
              waitTime={300}>
              <Text style={[styles.smallText, { color: fcBlue }]}>
                {is_fans
                  ? I18n.t('community.current_fans_right')
                  : I18n.t('community.current_all_right')}
              </Text>
            </ThrottledTouchableOpacity>
          </View>
          {is_lucky ? (
            <BorderedBox
              leftEle={
                <View>
                  <Luck />
                  <Text>{I18n.t('community.amount')}</Text>
                </View>
              }
              rightEle={
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  underlineColorAndroid="transparent"
                  keyboardType="numeric"
                  onChangeText={this.handleLuckRedPacketAmountChange}
                  value={red_packet_amount}
                  onBlur={this.handleBlur}
                />
              }
            />
          ) : (
            <BorderedBox
              leftEle={<Text>{I18n.t('community.rp_single_amount')}</Text>}
              rightEle={
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  underlineColorAndroid="transparent"
                  keyboardType="numeric"
                  onChangeText={this.handleOneRedPacketAmountChange}
                  value={this.state.one_red_packet_amount}
                  onBlur={this.handleBlur}
                />
              }
            />
          )}

          {/* 红包类型的切换 */}
          <View style={[styles.flexBox, { marginTop: 10 }]}>
            <Text style={styles.smallText}>
              {I18n.t('community.rp_current') +
                (is_lucky
                  ? I18n.t('community.rp_lucky')
                  : I18n.t('community.rp_normal'))}
              ，
            </Text>
            <ThrottledTouchableOpacity
              onPress={this.changeRedPacketMode}
              waitTime={300}>
              <Text style={[styles.smallText, { color: fcBlue }]}>
                {I18n.t('community.rp_change') +
                  (is_lucky
                    ? I18n.t('community.rp_normal')
                    : I18n.t('community.rp_lucky'))}
              </Text>
            </ThrottledTouchableOpacity>
          </View>

          {/* 选择币种 */}
          <ThrottledTouchableOpacity
            onPress={() => this.toggleModalVisible(true)}
            style={[BBStyles.redBorder, BBStyles.flexBox]}>
            <View style={BBStyles.leftDescriptionContent}>
              <Text>{I18n.t('community.choose_coin')}</Text>
            </View>
            <View style={BBStyles.separator} />
            <View style={BBStyles.rightInputContent}>
              <Text style={styles.coinType}>{coin_name}</Text>
              <Text style={{ width: 15 }}>></Text>
            </View>
          </ThrottledTouchableOpacity>

          {/* 附加文字的框 */}
          <TextInput
            style={[BBStyles.redBorder, { height: 62 }]}
            placeholder="恭喜发财"
            maxLength={120}
            underlineColorAndroid="transparent"
            onChangeText={addition_text => this.setState({ addition_text })}
            onBlur={this.handleBlur}
          />

          {/* 选择币种的界面在这里 */}
          <BottomModal
            visible={modal_show && valid_coin_infos.length > 0}
            style={{ height: modal_height }}
            onRequestClose={this.closeModal}>
            <CoinTypeSelect
              onClose={this.closeModal}
              default_coin={coin_name}
              coin_infos={valid_coin_infos}
              onChange={this.handleCoinChange}
            />
          </BottomModal>

          {/* 总金额显示在这里 */}
          <Text style={styles.amount_container_text}>
            <Text style={styles.amountText}>{red_packet_amount || 0}</Text>
            <Text style={{ color: fcBlue, fontSize: 12, fontWeight: '600' }}>
              {coin_name}
            </Text>
          </Text>

          <LongButton
            onPress={this.handlePackRedPacket}
            title={I18n.t('community.saihb')}
            style={{
              backgroundColor: isEnable ? '#DD4B39' : '#DD4B3955',
              marginTop: 5,
              marginBottom: 100
            }}
            disabled={!isEnable}
          />

          <PasswordModal
            title={I18n.t('tip.pay_password_title')}
            ref={this.myRef}
            onDone={this.handlePasswordInput}
          />
        </ScrollView>
      </View>
    )
  }
}

function mapStateToProps(state) {
  const { CurrentHomepageForumInfo } = state.CommunityPostState
  let forumId = state.communityState.targetForumId
  return {
    CurrentHomepageForumInfo,
    forumId
  }
}

export default connect(mapStateToProps)(RedPacketSend)

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#f7f8fa'
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    width: '80%',
    padding: 0,
    textAlign: 'right'
  },
  suffixText: {
    width: 32,
    textAlign: 'right'
  },
  smallText: {
    fontSize: 12
  },
  coinType: {
    width: '85%',
    paddingLeft: 25,
    textAlign: 'center'
  },
  amount_container_text: {
    marginTop: 30,
    marginBottom: 40,
    textAlign: 'center'
  },
  amountText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#353B48'
  },
  // 顶部提醒
  noticeBar: {
    position: 'absolute',
    // top: 50,
    height: 20,
    width,
    backgroundColor: '#FDC066'
  },
  noticeText: {
    textAlign: 'center'
  }
})
