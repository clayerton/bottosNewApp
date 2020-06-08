import React,{ Component } from 'react'
import { View, Text, StyleSheet,   TouchableOpacity, Image,
    Clipboard, ScrollView, TextInput } from 'react-native'
import { NavigationScreenProp, NavigationLeafRoute } from 'react-navigation'

import UserInfo from '../../../Tool/UserInfo'
import I18n from "../../../Tool/Language";
import NavStyle from "../../../Tool/Style/NavStyle";
import BTBackButton from '../../../Tool/View/BTBackButton'
import Config from '../../../Tool/Config'
import { Toast,Modal } from 'antd-mobile-rn'
import LongButton from '../../../Tool/View/BTButton/LongButton'
import LocalImageAccess from '../../../Tool/View/LocalImageAccess';
import BTWaitView from '../../../Tool/View/BTWaitView.config'
import {requestWithFile} from "../../../Tool/NetWork/heightOrderFetch";



interface Params {
    isDataExist: boolean;
    post_id: number;
  }
  


interface NavigationState extends NavigationLeafRoute<Params> {
    params: Params;
}

type Navigation = NavigationScreenProp<NavigationState>

interface Props {
    navigation: Navigation,
   
}

interface State {
    // images:Array
}

const defaultProps = {

}



// 导航栏选项
const navigationOptions = ({ navigation }: { navigation: Navigation }) => {
    return {
      headerLeft: (props) => {
        return <BTBackButton onPress={() => {
          const onBack = navigation.getParam('onBack', ()=>{})
          onBack()
          props.onPress()
        }} />
      },
      headerTitle: I18n.t('wankrRegister.wankrTitle'),
      headerRight: <View style={NavStyle.rightButton} />,
    };
  };
class WankrRegister extends Component<Props,State>{

    static defaultProps = defaultProps

    static navigationOptions = navigationOptions

    task_id:number
    collection_id:number
    recommend_code:string
    constructor(props: Props) {
        super(props);

        const navigation = props.navigation
        const { task_id, collection_id } = navigation.state.params.data.collection[0]
        const {recommend_code} =  navigation.state.params.data.warning_record

        this.task_id = task_id
        this.collection_id = collection_id
        this.recommend_code = recommend_code

        this.state = {
            images: [],
            value:''
        }
      this.onChangeUploadImage = this.onChangeUploadImage.bind(this)

    }

    componentDidMount () {
    }

    copy(value) {
        Clipboard.setString(value)
        try {
          Clipboard.getString()
          Toast.info(I18n.t('tip.copy_success'), Config.ToestTime, null, false)
        } catch (e) {}
      }
    
      onChangeUploadImage(fileList){
        this.setState(prevState => ({
            images: fileList,
        }))
    }
    // 放弃任务
    giveUpTask(){
        Modal.alert(I18n.t('tip.confirm'), I18n.t('task.task_giveup'), [
            { text: I18n.t('tip.cancel'), onPress: () => {} },
            {
                text: I18n.t('tip.confirm'),
                onPress: ()=>this.giveUpTaskSure()
            }
        ])
    }

     //弹出确认放弃任务
     giveUpTaskSure(){
        let formData = new FormData()
        formData.append('token', UserInfo.token)
        formData.append('collection_id', this.collection_id)
        formData.append('task_id', this.task_id)
        formData.append('handle', 0)
        BTWaitView.show(I18n.t('tip.wait_text'))
        requestWithFile('/collection/memberCollectionHandle', formData)
            .then(res => {
                BTWaitView.hide()
                if (res.code === '0') {
                    Toast.hide()
                    Toast.success(res.msg, Config.ToestTime, null, false)
                    this.setState({
                        images: [],
                    });
                    let task={task_id:this.task_id};
                    this.props.navigation.state.params.callback(task);//返回父级刷新状态
                    this.props.navigation.goBack()
                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
                } else {
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                BTWaitView.hide();
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            })

    }

    // 提交任务
    submiTask() {
        const { images,value } = this.state;
        if(!value){
            Toast.info(I18n.t('wankrRegister.wankrTip'),Config.ToestTime, null, false)
            return;
        }
        // 上传图片数量需是2张
        if(images.length !== 1) {
            Toast.info(I18n.t('wankrRegister.wankrTip1'),Config.ToestTime, null, false)
            return;
        }

        let formData = new FormData();
        for(let i = 0; i< images.length; i++) {
            let uri = images[i].path;
            let index = uri.lastIndexOf('/')
            let name = uri.substring(index + 1)
            let file = {uri, type: 'application/octet-stream',name}
            formData.append('picture' + i, file);
        }
        //防止多次发送
        BTWaitView.show(I18n.t('tip.wait_text'))
        formData.append('token', UserInfo.token);
        formData.append('collection_id', this.collection_id);
        formData.append('task_id', this.task_id);
        formData.append('recommend_code',value);
        formData.append('handle', 2);
        requestWithFile('/collection/memberCollectionHandle', formData)
            .then((res) => {
                this.setState({
                    repeat: true
                })
                BTWaitView.hide()
                if (res.code === '0') {
                    Toast.success(res.msg, Config.ToestTime, null, false)
                    let task={task_id:this.task_id};
                    this.props.navigation.state.params.callback(task);//返回父级刷新状态
                    this.props.navigation.goBack();
                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                } else {
                    
                    let msg = res.msg
                    Toast.hide()
                    Toast.fail(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch((error) => {
                Toast.hide()
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            })

    }
    _onChangeText(value) {
        this.setState({
          value,
        })
      }
    render () {
        const {images,value} = this.state;
        return (
           <View style={[NavStyle.container,{backgroundColor:'#fff',justifyContent:'space-between'}]}>
               <View style={{flex:1,}}>  
                    <View style={styles.wankrContainer}>
                        <Text style = {styles.wankrConText}>{I18n.t('wankrRegister.wankrCode')} {this.recommend_code}</Text>
                        <LongButton
                            onPress={() => {
                                this.copy(this.recommend_code)
                            }}
                            style={{ width: 58, height: 24, backgroundColor:'#046FDB',}}
                            textStyle={{color:'#fff',fontSize:13, }}
                            title={I18n.t('tip.copy')}
                        />
                    </View>
                    <View style={{alignItems:'center',marginBottom:32,marginTop:32,}}>
                        <LongButton
                            onPress={() => {
                                    this.props.navigation.navigate('BTPublicWebView',{url:'http://playercity.game.wonderfrog.cn/Download/invitgame',navTitle:'玩客城下载'})
                            }}
                            style={{width:235,height:31,backgroundColor:'#046FDB',borderColor:'#046FDB',borderWidth:1,}}
                            textStyle={{ color:'#fff',fontSize:14, }}
                            title={I18n.t('wankrRegister.wankrDownload')}
                        />
                    </View>
                    <View style={styles.lines} />   
                    
                    <View style={{paddingLeft:16,paddingRight:16,marginBottom:32}}>
                        <Text style={{fontSize:16,color:'#353B48',lineHeight:18,marginBottom:16,}}>{I18n.t('wankrRegister.wankrInfo')}</Text>
                        <View  style={{
                              width: 235,
                              height: 31, 
                              borderRadius:31/2,
                              borderWidth:1,
                              borderColor:'#DFEFFE',
                              alignSelf:'center',
                              flexDirection:'row',
                              justifyContent:'space-between',
                              alignItems:'center',
                        }}>
                            <TextInput 
                                style = {{
                                    flex:1,
                                    padding:0,
                                    // paddingLeft:32,
                                    // paddingRight:32,
                                    textAlign:'center',
                                    fontSize:14,
                                }} 
                                value={value}
                                keyboardType="phone-pad"
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#8395A7"
                                placeholder={I18n.t('wankrRegister.wankrSumbit')}
                                onChangeText={value => {
                                  this._onChangeText(value)
                                }}
                            />
                        </View>
                    </View> 
                    {/* 上传截图组件 */}
                    <ScrollView style={{flex:1,}}> 
                        <View style={{paddingLeft:16,paddingRight:16,}}>
                            <Text style={{lineHeight:20,fontSize:14,color:'#8395A7',}}>{I18n.t('wankrRegister.wankrPicture')}</Text>
                            < View style={{flexDirection:'row',flexWrap:'wrap',marginTop:12,marginLeft:8,}}>
                                    <LocalImageAccess
                                    onChange={this.onChangeUploadImage}
                                    maxFileNum={1}
                                    imageList={images}
                                    rootStyle={{margin:0,flexGrow:0,}}
                                    imgWidth= {(UserInfo.screenW - 28)/4 - 4}
                                >
                                    <View style={[styles.localView,styles.localViewImg,{marginBottom:20,}]}>
                                        <Image style={styles.localCamera} source={require('../../../BTImage/Base/DataCollectionReview/base_task_data_collection_camera.png')}/>
                                    </View>
                                </LocalImageAccess>
                            </View>
                        </View>
                    </ScrollView>

                </View>
                <View style={styles.collectionDetailBottem}>
                    <LongButton
                        onPress={() => {
                                this.giveUpTask()
                        }}
                        style={styles.longButtonStyle}
                        textStyle={{ color:'#046FDB' }}
                        title={I18n.t('dataCollection.collection_gaveup')}
                    />
                   
                    <LongButton
                        onPress={() => {
                            this.submiTask()
                        }}
                        style={[styles.longButtonStyle,{backgroundColor:'#046FDB'}]}
                        textStyle={{ color:'#fff' }}
                        title={I18n.t('dataCollection.collection_submit')}
                    />
                </View>
           </View> 
        )
    }

}

const styles = StyleSheet.create({
    wankrContainer: {
        paddingTop:15,
        paddingLeft:16,
        paddingRight:24,
        justifyContent:'space-between',
        flexDirection:'row',
        // marginBottom:32,
    },
    wankrConText:{
        fontSize:16,
        color:'#353B48',
        lineHeight:24,
        height:24,
    },
    lines:{
        // marginTop:24,
        marginBottom:22,
        marginLeft:8,
        marginRight:8,
        height:1,
        backgroundColor:'#EFF0F3'
    },
    localView:{
        width:(UserInfo.screenW - 28)/4 - 4,
        height:(UserInfo.screenW - 28)/4 - 4, 
        marginRight:20,
        borderRadius:4,
        marginBottom:4,
        position:'relative',
    },
    localViewImg:{
        backgroundColor:'#eee',
        justifyContent:'center',
        alignItems:'center',
    },
    localCamera:{
        width:34,
        height:30,
    },
    collectionDetailBottem:{
        marginTop:15,
        marginBottom:16,
        paddingLeft:16,
        paddingRight:16,
        justifyContent:'space-between',
        flexDirection:'row',
    },
    longButtonStyle:{
        width:165,
        height:50,
        borderWidth:1,
        borderColor:'#046FDB',
        backgroundColor:'#fff',
    },
  
})

export default WankrRegister;




