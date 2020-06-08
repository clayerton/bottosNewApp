import React, { PureComponent } from 'react'
import { Text, StyleSheet, View, ImageBackground, Modal, Image, TouchableOpacity } from 'react-native'
import { Toast } from 'antd-mobile-rn'

// 组件
import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity'

import I18n from '../../Tool/Language'
import { RedPacket } from '../../Redux/Reducers/CommunityReducer'
import { requestWithBody, Res } from '../../Tool/NetWork/heightOrderFetch'
import config from '../../Tool/Config'
import NavigationService from '../../../NavigationService';

import { SuccessPickResData } from './RedPacketList'


const throttledNavigate = NavigationService.throttledNavigate()

interface SuccessPickRes extends Res {
  data: SuccessPickResData;
}

interface Props {
  group_level_source: null | number; // 发红包的用户的 v 标
  avatar: string; // 发红包的用户的头像
  pack_preview: RedPacket;
  name: string; // 发红包的用户的名字
}

interface State {
  visible: boolean;
  picked_amount: string | null; // 领取的金额，null 为被领完了
  token_type: string; // 币的名字
}

let click_locked = false

export default class RedPacketPostItem extends PureComponent<Props, State> {

  pickData?: SuccessPickResData;

  constructor(props: Props) {
    super(props)

  
    this.state = {
      visible: false, // modal 框的
      picked_amount: '',
      token_type: '',
    }
  }

  // 控制 modal 框的出现
  toggleVisible = () => {
    this.setState({visible: !this.state.visible})
  }

  pickSuccess = (data: SuccessPickResData) => {
    const token_type = data.main.currency_name
    const picked_amount = data.my_pick
    this.setState({ token_type, picked_amount })
    // TODO: 列表开发完了之后，把这段加上
    // if (!this.state.visible && !this.props.pack_preview.pick_status) {
    //   this.toggleVisible()
    // }
    this.toggleVisible()

  }

  pickFail = () => {
    this.setState({ picked_amount: null })
    if (!this.state.visible) this.toggleVisible();
  }
  

  handlePress = () => {
    if (click_locked) return ;
    click_locked = true
    const { hash } = this.props.pack_preview
    const body = {
      pack_key: hash
    }
    Toast.loading(I18n.t('tip.wait_text'))
    requestWithBody('/giftpack/pickGiftpack', body)
    .then((res: SuccessPickRes) => {
      click_locked = false
      Toast.hide()
      if (res.code === '0') {
        this.pickData = res.data
        // 选取成功了之后
        // this.pickSuccess(res.data)
        // 兼容之前的写法
        if (this.pickData.my_pick == null) {
          this.pickFail()
        } else {
          this.pickSuccess(res.data)
        }
      } else if (res.code == '-1') {
        Toast.info(res.msg, config.ToestTime)
      } else {
        Toast.fail(res.msg, config.ToestTime)
      }
    })
    .catch(() => {
      click_locked = false
      Toast.offline(I18n.t('tip.offline'), config.ToestTime)
    })

  }

  viewPickedList = () => {
    if (this.state.visible) this.toggleVisible();
    const { avatar, group_level_source } = this.props
    throttledNavigate('RedPacketList', {
      pickData: this.pickData,
      avatar,
      group_level_source,
      pack_preview:this.props.pack_preview.hash
    })

  }
  
  render() {
    const { pick_status } = this.props.pack_preview
    const { avatar, group_level_source } = this.props

    return (
      <View style={styles.container}>
        <ThrottledTouchableOpacity style={styles.touchView} onPress={this.handlePress}>
          <ImageBackground
            style={[styles.background, { opacity: pick_status ? 0.7: 1 }]}
            source={require('../../BTImage/CommunityImages/community_red_packet_unclick.png')}
          >
            <Text style={{ color: '#EFE657', textAlign: 'center', fontSize: 12 }}>恭喜发财</Text>
            <View style={styles.smallButton}>
              <Text style={{ fontSize: 12, color: '#fff', textAlign: 'center' }}>{I18n.t('community.chaihb')}</Text>
            </View>
          </ImageBackground>

        </ThrottledTouchableOpacity>

        <Modal transparent={true} visible={this.state.visible} onRequestClose={this.toggleVisible}>
          <View style={styles.modalBg}>
            <ImageBackground
              style={styles.openedBackground}
              source={require('../../BTImage/CommunityImages/community_red_packet_bg.png')}
            >

              <Text style={{ color: '#FCE417', textAlign: 'center', fontSize: 12 }}>{I18n.t('community.rp_from_1')} {this.props.name}</Text>

              {
                this.state.picked_amount == null
                ?
                <Text style={[styles.rp_text, { marginTop: 15 }]}>{I18n.t('community.rp_no_rp_left')}</Text>
                :
                <React.Fragment>
                  <Text style={[styles.rp_text, { marginTop: 5, fontSize: 36 }]}>{this.state.picked_amount}</Text>
                  <Text style={styles.rp_text}>{this.state.token_type}</Text>

                  {/* 领取数量 */}
                </React.Fragment>
              }

              {/* 领取详情 */}
              <ThrottledTouchableOpacity style={styles.picked_detail_button} onPress={this.viewPickedList}>
                <Text style={[styles.rp_text, { fontSize: 12 }]}>{I18n.t('community.rp_picked_list')} ></Text>
              </ThrottledTouchableOpacity>

            </ImageBackground>

            {/* 下面的那个 x */}
            <TouchableOpacity style={{ marginTop: 24 }} onPress={this.toggleVisible}>
              <Image style={styles.closeIcon} source={require('../../BTImage/CommunityImages/community_red_packet_close.png')} />
            </TouchableOpacity>

          </View>

        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'column'
  },
  touchView: {
    width: 180,
  },
  background: {
    paddingTop: 170,
    paddingLeft: 10,
    paddingRight: 10,
    width: 157,
    height: 238,
    alignItems: 'center',
  },
  red_packet_label: {
    marginLeft: 5,
    fontSize: 10,
    color: '#596379',
  },
  
  openedBackground: {
    paddingTop: 140,
    paddingLeft: 10,
    paddingRight: 10,
    width: 216,
    height: 328,
    alignItems: 'center',
  },
  
  modalBg: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  smallButton: {
    marginTop: 15,
    paddingTop: 2,
    paddingLeft: 5,
    paddingRight: 5,
    width: 60,
    height: 20,
    backgroundColor: '#FDC066',
    borderRadius: 10,
  },
  closeIcon: {
    width: 32,
    height: 32,
  },

  rp_text: {
    color: '#fff',
    textAlign: 'center',
  },
  picked_detail_button: {
    position: 'absolute',
    bottom: 15,
  }
})
