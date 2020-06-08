import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import AllPostCommentItem from './AllPostCommentItem'

import { ReplyDeteil } from '../../../Redux/Reducers/CommunityReducer'
import { addComment } from '../../../Redux/Actions/CommunityActions'


interface Props {
  post_id: number
  scrollToIndex(): void
  replys: ReplyDeteil[]
  addComment(replyDetail: any): void
  routeName: string
  onPressShowReplyList(): void
}

interface State {
  text: string
  replyTemp: ReplyDeteil[]
  isShowReplyList: boolean
  haveMoreReply: boolean
}

/*回复帖子功能*/
class PostComment extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.keyboardDidShowListener = null
    this.keyboardDidHideListener = null

    this.state = {
      text: '',
      replyTemp: [],
      isShowReplyList: false,
      haveMoreReply: false
    }
    this.item = null
  }

  componentWillUnmount() {
    //卸载键盘弹出事件监听
    if (this.keyboardDidShowListener != null) {
      this.keyboardDidShowListener.remove()
    }
    //卸载键盘隐藏事件监听
    if (this.keyboardDidHideListener != null) {
      this.keyboardDidHideListener.remove()
    }
  }

  //键盘弹出事件响应
  keyboardDidShowHandler(event) {}

  //键盘隐藏事件响应
  keyboardDidHideHandler(event) {}

  //强制隐藏键盘
  dissmissKeyboard() {
    Keyboard.dismiss()
  }

  componentDidMount() {
    const { replys } = this.props
    if (replys.length > 3) {
      this.setState({
        replyTemp: replys.slice(0, 3),
        haveMoreReply: true
      })
    } else {
      this.setState({
        replyTemp: replys,
        haveMoreReply: false
      })
    }

    //监听键盘弹出事件
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShowHandler.bind(this)
    )
    //监听键盘隐藏事件
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHideHandler.bind(this)
    )
  }

  onPressShowReplyList() {
    this.setState({
      isShowReplyList: !this.state.isShowReplyList
    })
  }
  render() {
    const { post_id, replys, scrollToIndex, routeName } = this.props
    const { isShowReplyList } = this.state

    let replyTemp = []
    let haveMoreReply = false
    if (replys.length > 3) {
      replyTemp = replys.slice(0, 3)
      haveMoreReply = true
    } else {
      replyTemp = replys
      haveMoreReply = false
    }

    return (
      <View style={styles.reply}>
        <FlatList
          data={isShowReplyList ? replys : replyTemp}
          extraData={isShowReplyList ? replys : replyTemp}
          renderItem={({ item }: { item: ReplyDeteil }) => {
            return (
              <AllPostCommentItem
                post_id={post_id}
                scrollToIndex={scrollToIndex}
                item={item}
                routeName={routeName}
              />
            )
          }}
          keyExtractor={item => item.reply_id.toString()}
        />

        {haveMoreReply && (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 20,
              marginTop: 8
            }}
            onPress={() => this.onPressShowReplyList()}>
            <Text style={{ fontSize: 14, color: '#1677CB' }}>
              {isShowReplyList ? '收起' : '显示更多'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addComment(replyDetail: any): void {
      dispatch(addComment(replyDetail))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(PostComment)

/*回复帖子功能。*/
const styles = StyleSheet.create({
  reply: {
    padding: 8,
    paddingBottom: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 6
  },
  reply_test: {
    color: '#000000',
    lineHeight: 17,
    fontSize: 12
  },
  newInputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 40,
    marginBottom: 10
  },
  enter: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    fontSize: 16,
    color: '#999999'
  }
})
