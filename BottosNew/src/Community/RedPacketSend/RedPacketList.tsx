import React, { Component } from 'react'
import { Text, View, FlatList, Image, ListRenderItemInfo, ImageBackground, TextStyle,TouchableOpacity,StyleSheet,Platform } from 'react-native'
import { NavigationLeafRoute, NavigationScreenProp } from 'react-navigation'

// 方法
import I18n from '../../Tool/Language'
import { transTimeToString, getRequestURL, calc_v_level_img, getImageURL } from "../../Tool/FunctionTool";
import UserInfo from '../../Tool/UserInfo'
import NavStyle from '../../Tool/Style/NavStyle'
import FontStyle from '../../Tool/Style/FontStyle'
import {redPacketListStyles as styles} from './redPackStyles'
// 组件
import BTBackButton from '../../Tool/View/BTBackButton'
import GroupLevel from '../Components/GroupLevel'
import Modal from 'react-native-modalbox'
import config from '../../Tool/Config'
import ShareUtil from "../../Tool/UM/ShareUtil";
import { Toast, ActivityIndicator } from 'antd-mobile-rn'
interface PickedDetail {
  avatar_thumb: string;
  group_id: string; // 用户组
  member_name: string; // 用户名
  pack_value: string; // 领取到的金额
  pick_member_id: number; // 用户的 id
  pick_time: number; // 领取时间，好像有的问题
  pieces_id: number; // 领取的顺序，从 1 开始
}

interface MainData {
  created_at: number;
  currency_id: number; // 币种对应的 id
  currency_name: string; // 币的名字
  giftpack_type: number; // 红包的类型，1 是拼手气红包
  intro: string; // 用户输入的内容
  member_id: number; // 发红包的用户的 id
  member_name: string; // 发红包的用户的名称
  pack_id: number; // 红包 id
  pack_members: number; // 红包个数
  status: number; // 
  total_amount: string; // 总金额
  total_members: number; // 总人数
  total_received: string; // 目前的总领取币量
  vaildtime: number; // 有效时间
}

export interface SuccessPickResData {
  list: PickedDetail[]; // 红包被领取详情
  main: MainData;
  my_pick: string; // 自己抢到的金额
}

interface Params {
  pickData: SuccessPickResData;
  avatar: string; // 发红包的用户的头像
  group_level_source: null | number; // 发红包的用户的 level img
  pack_preview:string
}

interface NavigationState extends NavigationLeafRoute<Params> {
  params: Params;
}

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
}

function ItemSeparatorComponent() {
  return <View style={{ backgroundColor: '#EFF0F3', height: 1, width: UserInfo.screenW }} />
}

interface HeaderTitleProps {
  onLayout(): void;
  allowFontScaling: any;
  style: TextStyle;
}
function renderHeaderTitle(props: HeaderTitleProps) {
  return <Text style={[props.style, { color: '#fff' }]}>{I18n.t('community.rp_list')}</Text>
}
 //获取ios设备是否安装微信
 let isInstallShareAPP = true;
 if (Platform.OS === 'ios') {
  ShareUtil.isInstallShareAPP(2,(code) => {
      if (code === '0'){
        isInstallShareAPP = false;
      }
  });
}
const navigationOptions = ({ navigation }) => {
  const onShareClick = navigation.getParam('onShareClick')
  return {
    headerLeft: function(props) {
          return <BTBackButton onPress={props.onPress} source={require('../../BTImage/CommunityImages/navigation_back_white.png')} />
        },
    headerRight: (
      isInstallShareAPP ?
      <TouchableOpacity activeOpacity={0.5} style={NavStyle.rightButton} onPress = {onShareClick}>
      <Image style={[style.closeButton,{width:22,height:22,}]} source={require('../../BTImage/navigation_share_white.png')}/>
    </TouchableOpacity>
    :
    ''
    ),
    headerTitle: renderHeaderTitle,
      headerStyle: styles.nav_header,
      headerTintColor: '#fff',
  }
}


class RedPacketList extends Component<Props> {
  static displayName = 'RedPacketList'
  static navigationOptions = navigationOptions
  token_type = this.props.navigation.state.params.pickData.main.currency_name // 币的名字

  constructor(props: Props) {
    super(props)
    this.state={
      isInstallShareAPP:true,
    }
    props.navigation.setParams({
      onShareClick:()=> this.onShareClick()
    })
  }
  onShareClick(){
    if(isInstallShareAPP ){
      this.refs.modal.open()
    }
    
  }
  componentDidMount() {
       //获取ios设备是否安装微信
       if (Platform.OS === 'ios') {
        ShareUtil.isInstallShareAPP(2,(code) => {
            if (code === '0'){
                this.setState({
                    isInstallShareAPP: false
                })
            }
        });
    }
  }
  renderItem = ({ item, index }: ListRenderItemInfo<PickedDetail>) => {
    const group_level_source = calc_v_level_img(item.group_id)
    return <View style={styles.picked_detail_item}>
      <View style={styles.small_avatar_view}>
        <Image style={styles.avatar_image}
          source={{ uri: getImageURL(item.avatar_thumb) }}
        />
        <GroupLevel group_level_source={group_level_source} />
      </View>
      <View>
        <Text style={styles.db16}>{item.member_name}</Text>
        <Text style={styles.pick_time_text}>{transTimeToString(item.pick_time)}</Text>
      </View>
      <Text style={[styles.picked_detail_item_value, styles.db16]}>{item.pack_value} {this.token_type}</Text>
    </View>
  }

  renderListHeader = () => {
    const params = this.props.navigation.state.params

    const { avatar, pickData, group_level_source } = params

    return <View style={styles.infoContainer}>
      <ImageBackground style={styles.bg_image_view} imageStyle={styles.bg_image} source={require('../../BTImage/CommunityImages/community_rp_detail_bg.png')}>
        {/* 来自 xx 的红包 */}
        <Text style={styles.from_text}> {I18n.t('community.rp_from_1')} {pickData.main.member_name} {I18n.t('community.rp_from_2')} </Text>
  
        {/* 还是显示领到的金额 */}
        <Text style={styles.amount_text}> {pickData.my_pick} </Text>
  
        {/* 领到的币的种类 */}
        <Text style={{ color: '#fff' }}> {this.token_type} </Text>
  
        <View style={styles.avatar_view}>
          <Image style={styles.big_avatar}
            source={{ uri:getImageURL(avatar) }}
          />
          <GroupLevel style={{ width: 24, height: 24 }} group_level_source={group_level_source} />

        </View>
      </ImageBackground>
      <Text style={[FontStyle.fontDarkGray, styles.overview_text]}>
        已领取{pickData.main.pack_members}/{pickData.main.total_members}个
      </Text>
    </View>
  }
        //---------------------------------------分享函数起始位置-----------------------------------------
        onClickButtonShare(index,pickData,pack_preview){
          this.refs.modal.close()
          if (index === 100){//举报
          //   this.onActionPress(1,item.member_id)
          } else if (index === 101){//黑名单
          //   this.onActionPress(0,item.member_id)
          } else if (index === 102){//删除
      
          } else if(index === 103){ //生成图片
            // URL:  https://dapp.botfans.org/gp/ 编码:  https%3a%2f%2fdapp.botfans.org%2fgp%2f
            // appid wx84408a7ef37b055f
          }else{
            ShareUtil.share(
              `【瓦力社区】${pickData.main.total_members}人瓜分${pickData.main.total_amount}${pickData.main.currency_name}积分！`,
              'http://dapp.botfans.org/gp/gp.png',
              'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx84408a7ef37b055f&redirect_uri=https%3a%2f%2fdapp.botfans.org%2fgp%2f&response_type=code&scope=snsapi_userinfo&state='+pack_preview+'#wechat_redirect',
              `${pickData.main.member_name}发了一个大礼包，手慢无～`,
              index,(code,message) =>{
              Toast.info(message, config.ToestTime, null, false)
            
          });
         
          }
      }
      //---------------------------------------分享函数终止位置-----------------------------------------
      onClickCloseShare(){
        this.refs.modal.close()
    
    }

  render() {
    const params = this.props.navigation.state.params
    const { pickData, pack_preview} = params
    return (
      <View style={styles.container}>
        <FlatList
          style={[styles.container, styles.list_bg]}
          ListHeaderComponent={this.renderListHeader}
          data={pickData.list}
          renderItem={this.renderItem}
          ItemSeparatorComponent={ItemSeparatorComponent}
          keyExtractor={(item: PickedDetail) => item.pick_member_id.toString()}
        />
         {/*---------------------------------------分享UI起始位置-----------------------------------------*/}
         <Modal
                        style={{flexDirection: 'column', height: 280 -110, backgroundColor: '#FFFF0000',}}
                        position={'bottom'}//model视图的位置,top、center、bottom
                        entry={'bottom'}//动画的起始位置top、bottom
                        ref="modal"
                        coverScreen={true}//当true时,modal后面的背景是这个window。比如有navitor时,导航条也会遮住
                        backdropPressToClose={true}//点击背景是否关modal视图,当backdrop未false的情况下失效
                        backButtonClose={true}//仅安卓,当为true时安卓手机按返回键时modal视图close
                        openAnimationDuration={0}
                        swipeToClose={false}//是否滑动关闭
                    >
                        <View style={{ flexDirection: 'column', marginLeft:8,marginRight:8, backgroundColor: '#FFFFFF',height: 220 - 110,borderRadius:8}}>
                            <View style={{ flexDirection: 'row',backgroundColor: '#FFFF0000',height: 90}}>
                                <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickButtonShare(3,pickData,pack_preview)}>
                                    <Image style = {{width:50, height: 50, marginTop:20}} source={require('../../BTImage/PublicComponent/umeng_socialize_wxcircle.png')}/>
                                    <Text style = {{width:90, height: 20, lineHeight:20, fontSize: 10, color: '#000000', textAlign: 'center'}}>朋友圈</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickButtonShare(2,pickData,pack_preview)}>
                                    <Image style = {{width:50, height: 50, marginTop:20}} source={require('../../BTImage/PublicComponent/umeng_socialize_wechat.png')}/>
                                    <Text style = {{width:90, height: 20, lineHeight:20, fontSize: 10, color: '#000000', textAlign: 'center'}}>微信</Text>
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

export default RedPacketList

const style = StyleSheet.create({

  closeButton: {
      width: 18,
      height: 18
  },
});
