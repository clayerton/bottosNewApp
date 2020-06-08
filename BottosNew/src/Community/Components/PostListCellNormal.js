import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking
} from 'react-native'

import {
  transTimeToString,
  getImageURL,
  calc_v_level_img,
  contentStringHaveURL,
  contentStringHaveURL1,
  enumerateURLStringsMatchedByRegex,
  stringToEmoji
} from '../../Tool/FunctionTool'
import UserInfo from '../../Tool/UserInfo'
import I18n from '../../Tool/Language'
import * as emoticons from '../../Tool/View/Emoticons' // emoji表情

// 组件
import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity'
import GroupLevel from './GroupLevel' // 用户等级
import RedPacketPostItem from '../RedPacketSend/RedPacketPostItem' // 红包
import DoubleSourceImage from '../DoubleSourceImage' // 图片
import ImageShow from '../ImageShow'
import PostComment from './PostComment' // 评论
import URLShareCell from '../Components/URLShareCell' // 分享
import PraiseAndCommentItem from './PostListCellItem/PraiseAndCommentItem' // 点赞&&评论

class PostListCellNormal extends PureComponent {
  // routeName = this.props.navigation.state.routeName
  constructor(props) {
    super(props)
    this.state = {
      visible: false, // 大图
      index: 0,
      isBlack: false,
      isShowFullContent: false,
      myMobile: UserInfo.mobile
    }
    const group_id = props.group_id
    this.group_level_source = calc_v_level_img(group_id)
  }

  _onPress = () => {
    const { onPress } = props
    onPress && onPress(url)
  }
  // 查看原图
  viewPhoto(index) {
    this.setState({ visible: true, index })
    return
  }

  // const group_level_source = calc_v_level_img(group_id)

  // 这个是点击回复的时候，让该帖子滚动到界面中间
  scrollToIndex() {
    const { scrollToIndex, index } = this
    if (scrollToIndex && typeof index != 'undefined') scrollToIndex(index)
  }
  // 点赞 评论
  _onPressPraiseAndComment(value) {
    const { onPressPraiseAndComment } = this.props
    onPressPraiseAndComment && onPressPraiseAndComment(value)
  }

  _onPressFollow(value) {
    const { onPressFollow } = this.props
    onPressFollow && onPressFollow(value)
  }
  _onPressNavigateToPortrayal(value) {
    const { onPressNavigateToPortrayal } = this.props
    onPressNavigateToPortrayal && onPressNavigateToPortrayal(value)
  }
  handleNavigateToDetail(value) {
    const { handleNavigateToDetail } = this.props
    handleNavigateToDetail && handleNavigateToDetail(value)
  }

  render() {
    const {
      content,
      post_member_name,
      post_avatar,
      created_at,
      group_id,
      reply,
      post_url,
      post_id,
      link_url,
      link_title,
      pack_preview,
      mobile,
      is_follow,
      FollowStatus
    } = this.props
    const { isShowFullContent, myMobile } = this.state
    const hasURL = contentStringHaveURL(content)
    return (
      <View style={styles.container}>
        <View style={styles.flexCellStyle}>
          <TouchableOpacity
            style={{
              // backgroundColor: '#c99',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onPress={() => this._onPressNavigateToPortrayal(this.props)}>
            {/* 头像 */}
            <View style={styles.avatar_view}>
              <Image
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  marginRight: 10
                }}
                source={{ uri: getImageURL(post_avatar) }}
              />
              {/* 等级 */}
              <GroupLevel group_level_source={this.group_level_source} />
            </View>
            <Text style={styles.item_title}>{post_member_name}</Text>
          </TouchableOpacity>

          {mobile !== myMobile && (
            <TouchableOpacity
              disabled={FollowStatus.status == 'running' ? true : false}
              style={[
                styles.followNormalView,
                is_follow && { backgroundColor: '#A3A3A3' }
              ]}
              onPress={() => this._onPressFollow(this.props)}>
              <Text style={styles.followNormalText}>
                {is_follow ? '已关注' : '关注'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ThrottledTouchableOpacity
          onPress={() => this.handleNavigateToDetail(post_id)}>
          {/* 帖子内容 帖子图片 帖子分享 */}
          {/* 图片 */}
          {post_url && post_url.length ? (
            <View style={styles.allImg}>
              {post_url.map((ele, index) => {
                return (
                  <ThrottledTouchableOpacity
                    key={ele.post_img_id}
                    onPress={() => this.viewPhoto(index)}>
                    <DoubleSourceImage
                      style={styles.showimg}
                      source={{ uri: getImageURL(ele.post_thumb_url) }}
                    />
                  </ThrottledTouchableOpacity>
                )
              })}
            </View>
          ) : null}

          {/* 分享 */}
          {hasURL ? (
            <URLShareCell
              url={contentStringHaveURL1(content)}
              {...this.props}
              onPress={url => {
                this._onPressLinkToURL(link_url ? link_url : url[0], link_title)
              }}
            />
          ) : null}

          {/* 红包 */}
          {pack_preview && typeof pack_preview.pack_id == 'number' && (
            <RedPacketPostItem
              group_level_source={this.group_level_source}
              avatar={post_avatar}
              pack_preview={pack_preview}
              name={post_member_name}
            />
          )}

          {/* 内容 */}
          {content && content.length ? (
            <View style={styles.contentView}>
              <Text
                numberOfLines={isShowFullContent ? 0 : 3}
                style={{ color: '#1F1F1F', fontSize: 9 }}>
                {hasURL ? (
                  this.onPressContentURLStyle(stringToEmoji(content))
                ) : (
                  <Text style={styles.item_text} selectable={true}>
                    {stringToEmoji(content)}
                  </Text>
                )}
              </Text>
              {content.length < 100 ? null : (
                <Text
                  onPress={() =>
                    this.setState({
                      isShowFullContent: !isShowFullContent
                    })
                  }
                  style={{
                    marginTop: 5,
                    color: '#046FDB',
                    fontSize: 16
                  }}>
                  {isShowFullContent ? '收起' : '显示全文'}
                </Text>
              )}
            </View>
          ) : null}

          {/* 时间 点赞数  评论数  */}
          <View style={styles.flexCellStyle}>
            <View>
              <Text style={styles.time}>{transTimeToString(created_at)}</Text>
            </View>
            {/* 点赞数  评论数  */}
            <PraiseAndCommentItem
              {...this.props}
              onPress={value => this._onPressPraiseAndComment(value)}
              key="PraiseAndCommentItem"
            />
          </View>
        </ThrottledTouchableOpacity>

        {/* 评论 */}
        {reply && reply.length > 0 && (
          <PostComment
            replys={reply}
            scrollToIndex={() => this.scrollToIndex()}
            post_id={post_id}
            // routeName={()=>this.routeName()}
          />
        )}

        {this.state.visible && (
          <ImageShow
            post_url={post_url}
            index={this.state.index}
            onClose={() => this.setState({ visible: false })}
          />
        )}
      </View>
    )
  }

  // 分享
  _onPressLinkToURL(link, link_title) {
    const { onPressLinkToURL } = this.props
    onPressLinkToURL &&
      onPressLinkToURL({
        url: link,
        navTitle: link_title
      })
  }

  // 点击跳转浏览器
  onClickUrl(url) {
    Linking.openURL(url).catch(err => {})
  }

  onPressContentURLStyle(value) {
    const res = enumerateURLStringsMatchedByRegex(value)
    return (
      res &&
      res.map((item, index) => {
        return (
          <Text
            style={styles.item_text}
            selectable={true}
            key={item.url + index}>
            {(item.url && this._renderLinkURL(item.url)) ||
              (item.Content && item.Content) ||
              null}
          </Text>
        )
      })
    )
  }

  _renderLinkURL(url) {
    return (
      <Text
        style={{ color: '#1677CB' }}
        onPress={() => {
          this.onClickUrl(url)
        }}
        key={url}>
        {I18n.t('community.webLink')}
      </Text>
    )
  }
}

function mapStateToProps(state) {
  const { FollowStatus } = state.CommunityPostState

  return {
    FollowStatus
  }
}

export default connect(mapStateToProps)(PostListCellNormal)

const cellPadding = 18
const cellMargin = 11
const width = UserInfo.screenW - 24
const imageW = (width - cellPadding * 2 - cellMargin * 3) / 3
const imageH = (imageW / 97) * 81

const styles = StyleSheet.create({
  container: {
    width: width,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#DEDEDE',
    marginTop: 16,
    padding: 18
  },
  flexCellStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  item: {
    flexDirection: 'row',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    flexGrow: 1,
    backgroundColor: '#fff'
  },
  items: {
    flex: 1
  },
  item_title: {
    fontSize: 18,
    color: '#1F1F1F',
    fontWeight: 'bold',
    marginLeft: 16
  },
  item_text: {
    fontSize: 16,
    lineHeight: 24
  },

  show: {
    color: '#1677CB',
    opacity: 0.6,
    fontSize: 12,
    height: 2
  },

  allImg: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 20
  },

  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  deleteAll: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  time: {
    color: '#929292',
    fontSize: 12
  },
  comments: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  comment: {
    color: '#999',
    fontSize: 10,
    marginLeft: 0
  },
  delete: {
    color: '#1677CB',
    borderWidth: 0,
    height: 18,
    fontSize: 12,
    paddingLeft: 6
  },
  showimg: {
    width: imageW,
    height: imageH,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 10,
    borderRadius: 8
  },
  avatar_view: {
    position: 'relative',
    width: 40,
    height: 40
  },
  group_level_img: {
    width: 12,
    height: 12,
    position: 'absolute',
    bottom: 2,
    right: 2
  },
  followNormalView: {
    width: 66,
    height: 24,
    backgroundColor: '#046FDB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  followNormalText: {
    fontSize: 13,
    color: '#fff'
  },
  contentView: {
    paddingTop: 15,
    paddingBottom: 15
  }
})
