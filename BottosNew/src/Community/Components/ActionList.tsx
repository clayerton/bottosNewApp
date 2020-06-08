import React, { Component } from 'react'
import { View, Text, Image, Modal, StyleSheet, Dimensions, ViewStyle, ImageStyle, TextStyle } from 'react-native'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker';

import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity'
import { toggleActionListVisible ,setTargetPostId} from '../../Redux/Actions/CommunityActions'
import NavigationService from '../../../NavigationService';
import I18n from '../../Tool/Language'

const { height, width } = Dimensions.get('window')
const IconBoxWidth = width * 0.16

interface OptionItem {
  key: string;
  imgSource: number;
  handleAction(): void;
  content: string;
}

const throttledNavigate = NavigationService.throttledNavigate()

const listOptions: OptionItem[] = [
  {
    key: 'text',
    imgSource: require('../../BTImage/CommunityImages/community_action_text.png'),
    handleAction: function () {
      throttledNavigate('PostPublish')
    },
    content: I18n.t('community.action_text'),
  },
  // {
  //   key: 'gallery',
  //   imgSource: require('../../BTImage/CommunityImages/community_action_gallery.png'),
  //   handleAction: function () {
  //     ImagePicker.openPicker({
  //       width: 500,
  //       height: 500,
  //       multiple: true,
  //       maxFiles: 9,
  //       includeExif: true,
  //     })
  //       .then((images) => {
  //         if (images.length > 9) {
  //           images = images.slice(0, 9)
  //         }
  //         // console.log('pickSingleWith gallery images: ', images);
  //         throttledNavigate('PostPublish', { images })
  //       })
  //       .catch((err) => {
  //         console.log('err', err)
  //         // Toast.info('请选择上传图片', Config.ToestTime, null, false)
  //       })
  //   },
  //   content: I18n.t('community.action_gallery'),
  // },
  // {
  //   key: 'camera',
  //   imgSource: require('../../BTImage/CommunityImages/community_action_camera.png'),
  //   handleAction: function () {
  //     ImagePicker.openCamera({
  //       width: 500,
  //       height: 500,
  //       includeExif: true,
  //       mediaType: 'photo'
  //     })
  //     .then((image) => {
  //       // console.log('pickSingleWithCamera image: ', image);
  //       throttledNavigate('PostPublish', {
  //         images: [image]
  //       })
  //     })
  //     .catch((err) => {
  //       // console.log('err', err)
  //       // Toast.info('请选择上传图片', Config.ToestTime, null, false)
  //     })
  //   },
  //   content: I18n.t('community.action_camera'),
  // },
  {
    key: 'hb',
    imgSource: require('../../BTImage/CommunityImages/community_action_hb.png'),
    handleAction: function () {
      throttledNavigate('RedPacketSend')
    },
    content: I18n.t('community.action_hb'),
  },
]

interface ActionItemProps extends OptionItem {
  onClose(): void;
}

function ActionItem(props: ActionItemProps) {
  // console.log('props', props)
  const handlePress = function() {
    // 先关闭 modal 框
    props.onClose()
    // 再触发传过来的 Press 事件
    props.handleAction()
  }
  return <View style={styles.actionIconContainer}>
    <ThrottledTouchableOpacity onPress={handlePress} style={styles.iconSquare}>
      <Image style={styles.img} source={props.imgSource} />
    </ThrottledTouchableOpacity>
    <Text style={styles.text}>{props.content}</Text>
  </View>
}


interface Props {
  visible: boolean;
  toggleVisible(): void;
}

export class ActionList extends Component<Props> {

  // 关闭 Modal 框
  onRequestClose = () => {
    const { visible, toggleVisible } = this.props
    
    // console.log('onRequestClose visible： ', visible)
    if (visible) {
      toggleVisible()
    }
  }
  
  itemList = listOptions.map((ele) => {
    // console.log('listOptions this.onRequestClose: ', this.onRequestClose)
    return <ActionItem {...ele} onClose={this.onRequestClose} key={ele.key}/>
  })

  // Modal 框出现的事件
  onShow = () => {
    // console.log('onShow')
  }

  render() {
    const { visible } = this.props

    return (
      <Modal onShow={this.onShow} transparent={true} animationType='fade' visible={visible} onRequestClose={this.onRequestClose}>
        {/* <View style={styles.modalBackgroud}> */}
          <View style={styles.modal}>
            <View style={styles.actionListContainer}>{this.itemList}</View>
            <View style={styles.closeContainer}>
              <ThrottledTouchableOpacity onPress={this.onRequestClose}>
              <Image style={styles.closeIcon} source={require('../../BTImage/CommunityImages/community_modal_close.png')} />
              </ThrottledTouchableOpacity>
            </View>
          </View>
        {/* </View> */}
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  const visible = state.communityState.actionListVisible
  return { visible }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleVisible() {
      dispatch(toggleActionListVisible())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList)

interface Styles {
  modalBackgroud: ViewStyle;
  modal: ViewStyle;
  actionListContainer: ViewStyle;
  actionIconContainer: ViewStyle;
  iconSquare: ViewStyle;
  img: ImageStyle;
  text: TextStyle;
  closeContainer: ViewStyle;
  closeIcon: ImageStyle;
}

const styles = StyleSheet.create<Styles>({
  modalBackgroud: {
    height,
  },
  modal: {
    position: 'absolute',
    height: 200,
    width: '100%',
    bottom: 0,
    backgroundColor: '#F7F8FA',
  },
  actionListContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 118,
    width: '100%',
    paddingLeft: '7%',
    paddingRight: '7%',
    borderBottomColor: '#EFF0F3',
    borderBottomWidth: 1,
  },
  actionIconContainer: {
    marginLeft: 33,
    marginRight: 33,
    width: IconBoxWidth + 10,
  },
  iconSquare: {
    marginTop: '25%',
    marginBottom: 5,
    marginLeft: 5,
    height: IconBoxWidth,
    width: IconBoxWidth,
  },
  img: {
    height: IconBoxWidth,
    width: IconBoxWidth,
  },
  text: {
    textAlign: 'center',
  },
  // 关闭按钮相关
  closeContainer: {
    width: '100%',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 32,
    height: 32,
  }
})
