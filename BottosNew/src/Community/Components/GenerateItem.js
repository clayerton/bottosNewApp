import React, { Component } from 'react'
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
  CameraRoll,
  ScrollView,
} from 'react-native'
import {  Toast, ActionSheet } from 'antd-mobile-rn'
import config from '../../Tool/Config'
import UserInfo from '../../Tool/UserInfo'
import * as emoticons from '../../Tool/View/Emoticons'
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
  import URLShareCell from '../Components/URLShareCell'
  import Modal from 'react-native-modalbox'

  var ReactNative = require('react-native');
  import  ViewShot from "react-native-view-shot";  //android截屏第三方组件

  const GenerateItem = props => {
      const {item,inviteCode,numberRandom} = props;
      const {
        post_id,
        post_member_name,
        post_avatar,
        pack_preview,
        link_url,
        link_title,
        member_id,
        reply,
        praise,
        created_at
    } = item

      let content = item.content
  if (contentStringHaveEmoji(content)) {
      content = emoticons.parse(content)
    }
    let contentFontSize = null;
    let imageS = '' ;// 背景图片
    let imageH = 0 ; //image 背景高度
    let imageBg = ''; //  文字卡片
    let imageCode = '';//二维码
    let imageCommit = '',imageAgree = '',contentFontS=null ;

    //判断content内容字数
    // let numberRandom = Math.floor(Math.random()*2+1); //生成1,2随机数 背景颜色随机判定
    imageCode = numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_code.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_code_z.png')
    imageCommit = numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_commit.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_commit_z.png')
    imageAgree = numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_agree.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_agree_z.png')


    if(content&&content.length <=60 ){
      contentFontSize=styles.contentFontSize1;
      imageS=require('../../BTImage/CommunityImages/share_icon/share_sub_textbg1.png')
      imageBg=numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_bg1.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_bgz1.png')
      imageH=545
    }else if(content.length<=100){
      contentFontSize=styles.contentFontSize2;
      imageS=require('../../BTImage/CommunityImages/share_icon/share_sub_textbg1.png')
      imageBg=numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_bg1.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_bgz1.png')
      imageH=545
    }else if(content.length<=190){
      contentFontSize=styles.contentFontSize2;
      imageS=require('../../BTImage/CommunityImages/share_icon/share_sub_textbg2.png')
      imageBg=numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_bg2.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_bgz2.png')
      imageH=682
    }else if(content.length<=300){
      contentFontSize=styles.contentFontSize2;
      imageS=require('../../BTImage/CommunityImages/share_icon/share_sub_textbg4.png')
      imageBg=numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_bg4.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_bgz4.png')
      imageH=800
    }else{
      contentFontSize=styles.contentFontSize3;
      imageS=require('../../BTImage/CommunityImages/share_icon/share_sub_textbg3.png')
      imageBg=numberRandom === 1 ? require('../../BTImage/CommunityImages/share_icon/share_sub_bg3.png') : require('../../BTImage/CommunityImages/share_icon/share_sub_bgz3.png')
      imageH=1003
    }


    return (
        <View >
                <Image source={require('../../BTImage/CommunityImages/share_icon/share_sub_logo.png')} style={{
                  width:133,
                  height:32,
                  marginTop:74,
                  marginLeft:12,
                }} />
                <View style={{paddingTop:6}}>
                    <ImageBackground source={imageS}
                      style={{
                        width:324,
                        height:imageH,
                        alignSelf:'center',
                        flexDirection:'column',
                        justifyContent:'space-between',
                      }}
                    > 
                      <View style={{alignItems:'center',}}>

                      
                        <View style={[styles.avatar_view,{width:68,height:68,alignSelf:'center',marginTop:4,}]}>
                          <Image
                            style={{
                              width: 68,
                              height: 68,
                              borderRadius: 34,
                            }}
                            source={{ uri: getImageURL(post_avatar) }}
                          />
                          {this.group_level_source?<Image style={{
                            width: 24,
                            height: 24,
                            position: 'absolute',
                            bottom: 0,
                            right: 9,
                          }} source={this.group_level_source} />:null}
                        </View>
                          <Text style={{
                            color:'#000',
                            fontSize:20,
                            fontWeight:'bold',
                            paddingTop:22,
                            paddingBottom:12
                          }}>{post_member_name}</Text>
                          <Text style={{
                            fontSize:12,
                            color:'#363F4D',
                            paddingBottom:15,
                          }}>
                              邀请码: {inviteCode}
                          </Text>
                          <Image  source={require('../../BTImage/CommunityImages/share_icon/share_sub_line.png')}
                            style={{width:206,height:1,marginBottom:24,}}
                            />
                            {/* 文本 */}
                            <View style={[{
                              justifyContent:'center',
                              alignItems:'center',
                              minHeight:imageH - 177 - 262
                            },contentFontS]}>
                            <Text style={[{
                              paddingLeft:36,
                              paddingRight:36,
                              textAlign:'center',
                              alignItems:'center',
                              color:'#212936',
                            },contentFontSize]}>
                              “ {content} ”
                            </Text>
                            </View>
                            
                            </View>
                            {/* 下部分 */}
                            <View style={{ alignItems:'center',marginBottom:50,}}>

                            
                            <View style={{
                              paddingLeft:36,
                              paddingRight:36,
                              width:324,
                              marginLeft:36,
                              marginRight:36,
                              height:24,
                              marginTop:23,
                              marginBottom:37,
                             justifyContent:'space-between',
                              flexDirection:'row',
                              alignItems:'center'
                            }}>
                              <Text style={{
                                fontSize:12,
                                color:'#363F4D',
                                // marginRight:59,
                                
                              }}>{transTimeToString(created_at)}</Text>
                              <View style={{
                                flexDirection:'row',
                                alignItems:'center',

                              }}>
                              
                                <Image
                                    style={{
                                      width: 24,
                                      height: 24,
                                    }}
                                    source={imageCommit}
                                  />
                                <Text style={styles.comment}>{reply.length}</Text>
                                  <Image
                                    style={{ width: 24, height: 24,marginLeft:17, }}
                                    source={
                                      imageAgree
                                    }
                                  />
                                <Text style={[styles.comment]}>{praise}</Text>
                              </View>
                            </View>
                            <Image style={{width:125,height:130, resizeMode: Image.resizeMode.cover,}} source={imageCode} />
                                    </View>
                    </ImageBackground>
                    </View>
            
            </View>
    )

  }
  export default GenerateItem;
  const styles = StyleSheet.create({
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
      color: '#363F4D',
      fontSize: 12,
      marginLeft: 8
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
      fontSize:18,
      lineHeight:22,
      // minHeight:107,

    },
    contentFontSize2:{
      fontSize:16,
      lineHeight:18,
      // minHeight:105,

    },
    contentFontSize3:{
      fontSize:14,
      lineHeight:18,
    }
  })