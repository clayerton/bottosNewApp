import React,{Component} from 'react';
import {
    Text,
    View,
    Image,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Clipboard,
    CameraRoll,
    ScrollView,
    Platform,
} from 'react-native'
import { Toast } from 'antd-mobile-rn'
import { getRequestBody, devlog } from '../../Tool/FunctionTool'
import BTFetch from '../../Tool/NetWork/BTFetch'
import Config from '../../Tool/Config'
import BTWaitView from '../../Tool/View/BTWaitView.config'
import I18n from '../../Tool/Language'
import NavStyle from '../../Tool/Style/NavStyle'
import UserInfo from "../../Tool/UserInfo";
import LongButton from '../../Tool/View/BTButton/LongButton'
// var ReactNative = require('react-native'); //保存图片调用
// import  ViewShot from "react-native-view-shot";  //android截屏第三方组件
class InviteItem extends Component{
    constructor(props){
        super(props);
    }
    copy(value) {
        Clipboard.setString(value)
        try {
          Clipboard.getString()
          Toast.info(I18n.t('tip.copy_success'), Config.ToestTime, null, false)
        } catch (e) {}
      }
    render(){
        const { data, recommendUseAmount, useCount,  } = this.props
        return (
            <View style={{ alignItems:'center',
            justifyContent:'center',}}>
                     <Image style={styles.invite_logo} source={require('../../BTImage/Base/Task/task_invite_logo.png')} />
                     <Text style={styles.invite_text}>{I18n.t('invite.Invite_title')}</Text>
                     <Text style={styles.invite_num}>{data}</Text>
                     <Text style={styles.invite_other}>
                         {I18n.t('invite.Invite_count')}{' '}
                         {`${useCount}/${recommendUseAmount}`}
                      </Text>
                     <Text style={styles.invite_friends}>{I18n.t('invite.Invite_sub_tip1')}</Text>
                     <Text style={[styles.invite_friends,{marginBottom:21}]}>+{I18n.t('invite.Invite_sub_tip2')}</Text>
                   <LongButton
                       onPress={() => {
                           this.copy(data)
                       }}
                       style={{ width: 132, height: 27, backgroundColor:'#046FDB',marginBottom:16,}}
                       textStyle={{color:'#fff',fontSize:12, }}
                       title={I18n.t('invite.Invite_copy_code')}
                   />
                   <TouchableOpacity
                         activeOpacity={1}
                         onPress={() => {
                            this.props.onClickSaveImg()
                         }}
                         style={{ width: 132, height: 27, backgroundColor:'#046FDB', marginBottom:25,justifyContent: 'center',
                             alignItems: 'center',
                             borderRadius: 100,
                            }}
                   >
                       <Text style={{color:'#fff',fontSize:12,
                           fontWeight: 'bold', }}>{I18n.t('invite.Invite_save_image')}</Text>
     
                   </TouchableOpacity>
                     <Image
                         style={{ width:93,
                           height:93,
                           alignSelf: 'center',
                           resizeMode: Image.resizeMode.cover,
                           }}
                          source={require('../../BTImage/Base/Task/base_task_download.png')}
                     />
                   <Text style={[styles.invite_download_text,{marginTop:16}]}>{I18n.t('invite.Invite_download')}</Text>
                   <Text style={[styles.invite_download_text,{marginBottom:16}]}>{I18n.t('invite.Invite_download_text')}</Text>
              </View>
         )
    }
}

export default InviteItem;

const styles = StyleSheet.create({
    mainBackground: {
        alignItems:'center',
        justifyContent:'center',
        width: '100%',
        height: '100%',
        //不加这句，就是按照屏幕高度自适应
        //加上这几，就是按照屏幕自适应
        //resizeMode:Image.resizeMode.contain,
        //祛除内部元素的白色背景
        backgroundColor:'rgba(0,0,0,0)',
        resizeMode:'contain'
    },
    invite_logo:{
        width:129,
        height:46,
        marginTop:84,
        marginBottom: 74,
    },
    invite_text:{
        lineHeight:27,
        color:'#fff',
        fontSize: 18,

    },
    invite_num:{
        fontSize:72,
        color:'#fff',
        fontWeight:'bold',

    },
    invite_other:{
        lineHeight: 17,
        color:'#fff',
        marginBottom: 12,
    },
    invite_friends:{
        lineHeight:17,
        fontSize:12,
        color:'#046FDB'
    },
    invite_download_text:{
        fontSize:12,
        color:'#fff',
        lineHeight:17,
    },





    mainBg:{
        marginLeft: 24,
        marginRight: 24,
        marginTop: 24,
        paddingLeft:12,
        paddingRight: 12,
        position:'relative',
    },
    mainBorderRadius:{
      position:'absolute',
        zIndex:99,

        width:12,
        height:12,
        borderRadius: 6,
        backgroundColor:'#046FDB'
    },
    mainBorderRadiusLeft:{
        left:6,
        top:71,
    },
    mainBorderRadiusRight:{
        right:6,
        top:71,
    },
    mainBorderRadiusLeftButton:{
        width:6,
        height:6,
        left:9,
        bottom:203,
    },
    mainBorderRadiusRightButton:{
        width:6,
        height:6,
        right:9,
        bottom:203,
    },

  logoStyles: {
    width: 198,
    height: 53,
    alignSelf: 'center'
  },
  fontStyle: {
    fontSize: 12,
    color: '#2280E0'
  },
  content: {
    backgroundColor: '#fff',
    marginTop: 25,
    flexDirection: 'column',
    justifyContent: 'space-between',
      paddingBottom:20,

    // alignItems: 'center'
  },
  dashLine: {
    flexDirection: 'row'
  },
  dashItem: {
    height: 1,
    width: 2,
    marginRight: 2,
    flex: 1,
    backgroundColor: '#f2a69b'
  }
})
