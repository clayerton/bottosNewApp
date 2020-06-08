import React, { Component } from 'react'
import { PostDetail } from '../../Redux/Reducers/CommunityReducer'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  DeviceEventEmitter,
  ImageStyle,
  ViewStyle,
  TextStyle,
  Linking,
  ImageBackground,
  Platform,
  Share,
  CameraRoll
} from 'react-native'
import { NavigationLeafRoute, NavigationScreenProp } from 'react-navigation'
import {  Toast, ActionSheet } from 'antd-mobile-rn'

// 组件
import ImageShow from '../ImageShow'
import PostComment from './PostComment'
import GroupLevel from './GroupLevel'
import DoubleSourceImage from '../DoubleSourceImage'
import RedPacketPostItem from '../RedPacketSend/RedPacketPostItem'
import ThrottledTouchableOpacity from '../../Tool/View/ThrottledTouchableOpacity'
import URLShareCell from '../Components/URLShareCell'
import { requestWithBody, Res } from '../../Tool/NetWork/heightOrderFetch'
import config from '../../Tool/Config'
import UserInfo from '../../Tool/UserInfo'
import { URL_REG } from '../../Tool/Const'
import BTFetch from '../../Tool/NetWork/BTFetch'
import {
  getRequestBody,
  transTimeToString,
  devlog,
  getRequestURL,
  getImageURL,
  calc_v_level_img,
  hasEmoji,
  contentStringHaveURL,
  contentStringHaveURL1,
  enumerateURLStringsMatchedByRegex,
  contentStringHaveEmoji
} from '../../Tool/FunctionTool'
import I18n from '../../Tool/Language'
import * as emoticons from '../../Tool/View/Emoticons'

import ShareUtil from "../../Tool/UM/ShareUtil";
import Modal from 'react-native-modalbox'
import { isNull } from 'lodash-es';
var ReactNative = require('react-native');
import  ViewShot from "react-native-view-shot";  //android截屏第三方组件

import DeleteModal from './DeleteModal';


const options1 = ['拉黑','举报', I18n.t('tip.cancel')]
const options2 = ['取消拉黑','举报', I18n.t('tip.cancel')]
interface Props {
  item: PostDetail
  navigation: NavigationScreenProp<NavigationLeafRoute<undefined>>
  scrollToIndex?(index: number): void
  index?: number
  deletePost(post_id: number): void
  updateOnePost(postDetail: PostDetail): void
  showCommentInput(): void
  setTargetPostId(post_id: number): void
}

interface State {
  visible: boolean
  index: number
  isBlack:boolean
  uri:string
  share:boolean
  isDelete:boolean
}

class PostItem extends Component<Props, State> {
  routeName = this.props.navigation.state.routeName
  group_level_source: null | number

  constructor(props: Props) {
    super(props)
    this.state = {
      visible: false, // 大图
      index: 0,
      isBlack:false,
      uri:'',
      share:false,
    }

    const group_id = props.item.group_id
    this.group_level_source = calc_v_level_img(group_id)

    this.navigateToPortrayal = this.navigateToPortrayal.bind(this)
    this.alertDeleteModal = this.alertDeleteModal.bind(this)
    this.deletePost = this.deletePost.bind(this)
    this.getLike = this.getLike.bind(this)
    this.triggerComment = this.triggerComment.bind(this)

    // this.report = this.report.bind(this) //举报
  }

  // 删除这个帖子
  deletePost() {
    const post_id = this.props.item.post_id
    const token = UserInfo.token

    requestWithBody('/post/deletePost', { token, post_id })
      .then((res: Res) => {
        if (res.code === '0') {
          Toast.success(res.msg, config.ToestTime)
          this.props.deletePost(post_id)
        
          
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.fail(res.msg, config.ToestTime)
        }
      })
      .catch(() => {
        Toast.offline(I18n.t('tip.offline'), config.ToestTime, undefined, false)
      })
  }

  // 弹出删除帖子确认框
  alertDeleteModal() {
    Modal.alert(
      I18n.t('community.delete_post'),
      I18n.t('community.sure_delete_post'),
      [
        { text: I18n.t('tip.cancel'), onPress: () => devlog('cancel') },
        { text: I18n.t('tip.confirm'), onPress: this.deletePost }
      ]
    )
  }

  //点赞功能
  getLike() {
    const token = UserInfo.token
    const item = this.props.item
    const post_id = item.post_id

    let param = {
      token,
      post_id,
      status: 1
    }

    requestWithBody('/post/followPraise', param)
      .then((res: Res) => {
        if (res.code == '0') {
          const _item = { ...item, praise: item.praise + 1, is_praise: 1 }
          this.props.updateOnePost(_item)
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.hide()
          Toast.fail(res.msg, config.ToestTime, undefined, false)
        }
      })
      .catch(() => {
        Toast.offline(I18n.t('tip.offline'), config.ToestTime)
      })
  }

  // 这个是点击回复的时候，让该帖子滚动到界面中间
  scrollToIndex = () => {
    const { scrollToIndex, index } = this.props
    if (scrollToIndex && typeof index != 'undefined') scrollToIndex(index)
  }

  // 触发评论框
  triggerComment() {
    const { showCommentInput, setTargetPostId } = this.props
    const item = this.props.item
    const post_id = item.post_id

    setTargetPostId(post_id)
    showCommentInput()
    this.scrollToIndex()
  }

  // 查看原图
  viewPhoto(index: number) {
    this.setState({ visible: true, index })
    return
  }

  // 跳转到身份画像页面
  navigateToPortrayal() {
    const { navigation } = this.props
    const item = this.props.item

    navigation.push('Portrayal', {
      mobile: item.mobile
    })
  }

  //操作举报中心

  report(member_id) {
    this.refs.modal.open()
  }

  onActionPress(index,member_id){
    const { navigation } = onClickButtonSharethis.props
    if(index === 0){
        this.addBlack(member_id)
    }
    if(index === 1){
      navigation.push('Report', {
        member_id,
      })
    }
  }
  //加入黑名单
  addBlack(member_id) {
    // handle 1 拉黑 2 解禁
    const {isBlack} = this.state;
    let body = {
      from:member_id,
      handle:isBlack ? 2 : 1,
    }
    let requestBody = getRequestBody(body)
    BTFetch('/black/addBlack', requestBody)
      .then(res => {
        devlog({res})
        if (res.code === '0') {
          Toast.success(res.msg, config.ToestTime, null, false)

          this.setState(preState=>({
            isBlack: !preState.isBlack,
          }))
        } else if (res.code === '99') {
          DeviceEventEmitter.emit(config.TokenDeviceEventEmitter, res.msg)
        } else {
          Toast.info(res.msg, config.ToestTime, null, false)
        }
      })
      .catch(res => {
        Toast.fail(res.msg, config.ToestTime, null, false)
      })
  }

  onPressLinkToURL(link, link_title) {
    this.props.navigation.navigate('BTPublicWebView', {
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
      <Text style={styles.item_text} selectable={true}>
        {res &&
          res.map(item => {
            if (item.url) {
              return this._renderLinkURL(item.url)
            } else if (item.Content) {
              return item.Content
            } else {
              return null
            }
          })}
      </Text>
    )
  }

  _renderLinkURL(url) {
    return (
      <Text
        style={{ color: '#1677CB' }}
        onPress={() => {
          this.onClickUrl(url)
        }}>
        {I18n.t('community.webLink')}
      </Text>
    )
  }
  onClickCloseShare(){
    this.refs.modal.close()

}
  componentDidMount(){
  }
  //---------------------------------------分享函数起始位置-----------------------------------------
  onClickButtonShare(index,item){
    this.refs.modal.close()
    if (index === 100){//举报
      this.onActionPress(1,item.member_id)
    } else if (index === 101){//黑名单
      this.onActionPress(0,item.member_id)
    } else if (index === 102){//删除
      this.deletePost()
    } else if(index === 103){ //生成图片
      this.props.navigation.navigate('GeneratePicture',item)
    }else{
      // 判断是否是红包  false 是红包
      if(Array.isArray(item.pack_preview) && item.pack_preview.length === 0){
        this.props.navigation.navigate('GeneratePicture',item)
      }else{

         ShareUtil.share(`【瓦力社区】${item.pack_preview.total_members}人瓜分100DTO积分！${item.post_member_name}发了一个大礼包，手慢无～`,'../../BTImage/CommunityImages/community_red_packet_bg.png','http://dapp.botfans.org/gp/','瓦力红包',index,(code,message) =>{
            Toast.info(message, config.ToestTime, null, false)
           devlog(code,message,'微信信息')
          

           
            devlog('--分享结果-------',code,'---------',message);
        });
      }
  
    }
}
//---------------------------------------分享函数终止位置-----------------------------------------

  render() {
    const { item } = this.props
    const {
      post_id,
      post_member_name,
      post_avatar,
      pack_preview,
      link_url,
      link_title,
      member_id,
    } = item
    const {isBlack,share,} = this.state;
    if(isBlack){
      return null;
    }
    let content = item.content

    if (contentStringHaveEmoji(content)) {
      content = emoticons.parse(content)
    }

    const hasURL = contentStringHaveURL(content)

    const imageList = item.post_url.map((ele, index) => {
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
    })

    const isShowDeleteBtn =                                                                                                 
      UserInfo.mobile == item.mobile || UserInfo.is_admin == 1
    
      let contentFontSize = null;
      //判断content内容字数
      if(content.length <=2 ){
        contentFontSize=styles.contentFontSize1;
      }else if(content.length<30){
        contentFontSize=styles.contentFontSize2;
      }else{
        contentFontSize=styles.contentFontSize3;
      }
      
    // 判断是否红包 true 帖子
    let isH = Array.isArray(pack_preview) && pack_preview.length === 0

    return (
      <View style={styles.container}>
        <Image style={styles.container} source={{uri:this.state.uri}} />
        <View style={styles.item}>
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
            <GroupLevel group_level_source={this.group_level_source} />
          </View>
          <View style={styles.items}>
            {/* 用户名 */}
            <View style={{justifyContent:'space-between',flexDirection:'row'}}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this.navigateToPortrayal}>
              <Text style={styles.item_title}>{post_member_name}</Text>
            </TouchableOpacity>
            {/* 举报   */}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={()=>this.report(member_id)}
            >
                <Image 
                  style={{
                    width:24,
                    height:24,
                  }}
                  source={require('../../BTImage/CommunityImages/community_black.png')}
                />
            </TouchableOpacity>
              </View> 
            
            {/* 帖子内容 */}
            {hasURL ? (
              this.onPressContentURLStyle(content)
            ) : (
              <Text style={styles.item_text} selectable={true}>
                {content}
              </Text>
            )}
            <Text style={styles.show}> </Text>

            {/* 分享 */}
            {hasURL ? (
              <URLShareCell
                url={contentStringHaveURL1(content)}
                {...item}
                onPress={url => {
                  this.onPressLinkToURL(link_url ? link_url : url[0], link_title)
                }}
              />
            ) : null}

            {/* 回复的图片 */}
            <View style={styles.allImg}>{imageList}</View>

            <View style={styles.info}>
              {/* 点击删除 */}
              <View style={styles.deleteAll}>
                <Text style={styles.time}>
                  {transTimeToString(item.created_at)}
                </Text>
                {/* {isShowDeleteBtn && 
                <DeleteModal onPress={()=>this.deletePost()} /> */}
                }
                {/* {isShowDeleteBtn && (
                  <TouchableOpacity onPress={this.alertDeleteModal}>
                    <Text style={styles.delete}>
                      {I18n.t('community.delete')}
                    </Text>
                  </TouchableOpacity>
                )} */}
              </View>

              {/* 下面是点击评论和点赞 */}
              <View style={styles.comments}>
                <TouchableOpacity onPress={this.triggerComment}>
                  <Image
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8
                    }}
                    source={require('../../BTImage/CommunityImages/community_comment_trigger.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.comment}>{item.reply.length}</Text>
                <TouchableOpacity
                  style={{ marginLeft: 5 }}
                  onPress={this.getLike}>
                  <Image
                    style={{ width: 18, height: 18 }}
                    source={
                      !!item.is_praise
                        ? require('../../BTImage/CommunityImages/forum_like_selected.png')
                        : require('../../BTImage/CommunityImages/forum_like.png')
                    }
                  />
                </TouchableOpacity>
                <Text style={[styles.comment]}>{item.praise}</Text>
              </View>
            </View>

            {pack_preview &&
              typeof pack_preview.pack_id == 'number' && (
                <RedPacketPostItem
                  group_level_source={this.group_level_source}
                  avatar={post_avatar}
                  pack_preview={pack_preview}
                  name={post_member_name}
                />
              )}

            {/* 下面是评论部分 */}
            {item.reply.length > 0 && (
              <PostComment
                replys={item.reply}
                scrollToIndex={this.scrollToIndex}
                post_id={post_id}
                routeName={this.routeName}
              />
            )}
          </View>
        </View>

        {this.state.visible && (
          <ImageShow
            post_url={item.post_url}
            index={this.state.index}
            onClose={() => this.setState({ visible: false })}
          />
        )}
        {/*---------------------------------------分享UI起始位置-----------------------------------------*/}
        <Modal
                        style={{flexDirection: 'column', height: isH ? 280 : 170, backgroundColor: '#FFFF0000',}}
                        position={'bottom'}//model视图的位置,top、center、bottom
                        entry={'bottom'}//动画的起始位置top、bottom
                        ref="modal"
                        coverScreen={true}//当true时,modal后面的背景是这个window。比如有navitor时,导航条也会遮住
                        backdropPressToClose={true}//点击背景是否关modal视图,当backdrop未false的情况下失效
                        backButtonClose={true}//仅安卓,当为true时安卓手机按返回键时modal视图close
                        openAnimationDuration={0}
                        swipeToClose={false}//是否滑动关闭
                    >
                        <View style={{ flexDirection: 'column', marginLeft:8,marginRight:8, backgroundColor: '#FFFFFF',height: isH ? 220 : 110,borderRadius:8}}>
                            
                            {
                              isH
                                &&
                                 <View style={{ flexDirection: 'row',backgroundColor: '#FFFF0000',height: 90}}>
                                    <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickButtonShare(3,item)}>
                                        <Image style = {{width:50, height: 50, marginTop:20}} source={require('../../BTImage/PublicComponent/umeng_socialize_wxcircle.png')}/>
                                        <Text style = {{width:90, height: 20, lineHeight:20, fontSize: 10, color: '#000000', textAlign: 'center'}}>朋友圈</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickButtonShare(2,item)}>
                                        <Image style = {{width:50, height: 50, marginTop:20}} source={require('../../BTImage/PublicComponent/umeng_socialize_wechat.png')}/>
                                        <Text style = {{width:90, height: 20, lineHeight:20, fontSize: 10, color: '#000000', textAlign: 'center'}}>微信</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                              isH
                                &&
                                <View style={{backgroundColor: '#EFF0F3',height:1,marginTop:20}}/>
                            }
                            

                            <View style={{ flexDirection: 'row',backgroundColor: '#FFFF0000',height: 90}}>
                                <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickButtonShare(100,item)}>
                                    <Image style = {{width:50, height: 50, marginTop:20}} source={require('../../BTImage/PublicComponent/report.png')}/>
                                    <Text style = {{width:90, height: 20, lineHeight:20, fontSize: 10, color: '#000000', textAlign: 'center'}}>举报</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickButtonShare(101,item)}>
                                    <Image style = {{width:50, height: 50, marginTop:20}} source={require('../../BTImage/PublicComponent/blacklist.png')}/>
                                    <Text style = {{width:90, height: 20, lineHeight:20, fontSize: 10, color: '#000000', textAlign: 'center'}}>黑名单</Text>
                                </TouchableOpacity>
                                {(
                                  Array.isArray(pack_preview) && pack_preview.length === 0
                                  && 
                                    <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickButtonShare(103,item)}>
                                    <Image style = {{width:50, height: 50, marginTop:20}} source={require('../../BTImage/CommunityImages/share_picture.png')}/>
                                    <Text style = {{width:90, height: 20, lineHeight:20, fontSize: 10, color: '#000000', textAlign: 'center'}}>保存图片</Text>
                                </TouchableOpacity>
                                  )}
                                <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickButtonShare(102)}>
                                    <Image style = {{width:50, height: 50, marginTop:20}} source={require('../../BTImage/PublicComponent/delete.png')}/>
                                    <Text style = {{width:90, height: 20, lineHeight:20, fontSize: 10, color: '#000000', textAlign: 'center'}}>删除</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column',margin:8, backgroundColor: '#FFFFFF',flex:1,borderRadius:8}}>
                            <TouchableOpacity activeOpacity={0.5} style={{justifyContent: 'center', alignItems: 'center',flex:1}} onPress={() => this.onClickCloseShare()}>
                                <Text style = {{width:100,lineHeight:30, fontSize: 15,  backgroundColor: '#0F0FFF00',color: '#000000', textAlign: 'center'}}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    {/*---------------------------------------分享UI终止位置-----------------------------------------*/}

      </View>
    )
  }
}

export default PostItem

interface Styles {
  container: ViewStyle
  item: ViewStyle
  items: ViewStyle
  item_title: TextStyle
  item_text: TextStyle
  show: TextStyle
  allImg: ViewStyle
  info: ViewStyle
  deleteAll: ViewStyle
  time: TextStyle
  comments: ViewStyle
  comment: TextStyle
  delete: TextStyle
  showimg: ImageStyle
  avatar_view: ViewStyle
  group_level_img: ImageStyle
  contentFontSize1:TextStyle
  contentFontSize2:TextStyle
  contentFontSize3:TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexGrow: 1
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
    fontSize: 14,
    color: '#1677CB',
    lineHeight: 20,
    fontFamily: 'PingFangSC-Semibold'
  },
  item_text: {
    fontSize: 14,
    lineHeight: 20
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
    alignItems: 'center'
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
    color: '#999',
    fontSize: 10
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
    width: 100,
    height: 100,
    marginRight: 13,
    marginBottom: 10
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
  contentFontSize1:{
    fontSize:72,
    color:'#596379',
    letterSpacing:3.75,
    textAlign:'center',
  },
  contentFontSize2:{
    fontSize:24,
    color:'#596379',
    letterSpacing:3.33,
  },
  contentFontSize3:{
    fontSize:14,
    color:'#596379',
    letterSpacing:5,
  }
})
