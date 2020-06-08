import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
    NetInfo,
  Dimensions,
  ImageBackground
} from 'react-native'
import BTFetch from '../../../../Tool/NetWork/BTFetch'
import UserInfo from '../../../../Tool/UserInfo'

import { Toast } from 'antd-mobile-rn'
import {
  clearMapForKey,
  setLocalStorage,
  getRequestBody,
  getLocalStorage,
  devlog
} from '../../../../Tool/FunctionTool'

import BTWaitView from '../../../../Tool/View/BTWaitView.config'
import NavStyle from '../../../../Tool/Style/NavStyle'
import Config from '../../../../Tool/Config'
import I18n from '../../../../Tool/Language'
import LongButton from '../../../../Tool/View/BTButton/LongButton'
import {Modal} from "antd-mobile-rn/lib/index.native";
// 组件

// 自有组件
import LocalImageAccess from '../../../../Tool/View/LocalImageAccess'
import {requestWithFile} from "../../../../Tool/NetWork/heightOrderFetch";

export default class HandWritten extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    return {
      headerLeft: (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
          style={NavStyle.leftButton}>
          <Image
            style={NavStyle.navBackImage}
            source={require('../../../../BTImage/navigation_back.png')}
          />
        </TouchableOpacity>
      ),
      headerRight: <Text style={NavStyle.rightButton}> </Text>,
      headerTitle: (
        <Text style={NavStyle.navTitle}>
          {I18n.t('dataCollection.hand_written_navigation_title')}
        </Text>
      ),
      headerTintColor: '#fff',
      headerStyle: NavStyle.navBackground
    }
  }

  constructor(props) {
    super(props);
    // this.task_id = this.props.navigation.state.params.task_id
      this.remaining = props.navigation.state.params.data.remaining;
      this.time = props.navigation.state.params.data.collection[0].end_at;
      this.now = props.navigation.state.params.data.time;
      this.countdown = this.time - this.now; //当前时间差
      const date = this.getDateData(this.countdown);

      this.rand = props.navigation.state.params.data.collection[0].rand; //单词
      this.task_id = props.navigation.state.params.data.collection[0].task_id;
      this.collection_id = props.navigation.state.params.data.collection[0].collection_id

    this.state = {
        remaining:this.remaining,
        timeLeft:date,
        rand : this.rand,
        task_id:this.task_id,
        collection_id:this.collection_id,
        images:[],
        network_status:null,
    }
      this.onChangeUploadImage = this.onChangeUploadImage.bind(this)
  }
  componentWillMount() {

      //监听网络状态改变
      NetInfo.addEventListener('change', this.handleConnectivityChange);
  }
  componentDidMount() {
      NetInfo.fetch().done((status)=> {
          this.setState({
              network_status:status,
          },()=>{
              devlog('1111222:'+status);
          })
      });
     /* NetInfo.fetch().done((status)=> {
          this.setState({
              network_status:status,
          })
          devlog('Status:'+status);
      });*/
    // this.loadData(this.state.taskId)
      //倒计时
      this.interval = setInterval(()=> {
          this.countdown -- ;
          const date = this.getDateData(this.countdown);
          if (date && this.countdown >= 0) {
              this.setState({timeLeft:date});
          } else {
              this.stop();
          }
      }, 1000);
  }

    getDateData(diff) {
        if (diff <= 0) {
            return false;
        }
        const timeLeft = {
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
        };
        if (diff >= (365.25 * 86400)) {
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) {
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) {
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        timeLeft.sec = diff;
        return timeLeft;
    }


    //放弃任务
    giveUpCollectionHandle(){
        Modal.alert(I18n.t('tip.confirm'), I18n.t('task.task_giveup'), [
            { text: I18n.t('tip.cancel'), onPress: () => devlog('cancel') },
            {
                text: I18n.t('tip.confirm'),
                onPress: ()=>this.giveUpCollection()
            }
        ])
    }

    giveUpCollection(){
        let formData = new FormData()
        formData.append('token', UserInfo.token)
        formData.append('collection_id', this.state.collection_id)
        formData.append('task_id', this.task_id)
        formData.append('handle', 0)
        BTWaitView.show(I18n.t('tip.wait_text'))

        requestWithFile('/collection/memberCollectionHandle', formData)
            .then((res) => {
                this.setState({
                    repeat: true
                })
                devlog('collection/memberCollectionHandle res', res);
                if (res.code === '0') {
                    BTWaitView.hide()
                    Toast.success(res.msg, Config.ToestTime, null, false)
                    this.setState({
                        images: [],
                    });
                    // this.props.navigation.state.params.callback(this.task_id);
                    this.props.navigation.goBack()
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
                Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
            })
    }

    //提交任务
    memberCollectionHandle(){
        if(this.state.images.length < 1) {
            Toast.info(I18n.t('task.task_choose_image'),1);
            return;
        }
        const { images } = this.state

        if(this.state.network_status !== 'WIFI' && this.state.network_status !== 'wifi'){
            Modal.alert(I18n.t('tip.confirm'), I18n.t('task.task_online'), [
                { text: I18n.t('tip.cancel'), onPress: () => {} },
                {
                    text: I18n.t('tip.confirm'),
                    onPress: ()=>this.saveDraftSure(images)
                }
            ])
        }else{
            this.saveDraftSure(images)
        }


    }

    saveDraftSure(){
        const { images } = this.state
        let formData = new FormData()

        for (let i = 0; i < images.length; i++) {
            let uri = images[i].path
            let index = uri.lastIndexOf('/')
            let name = uri.substring(index + 1)
            let file = { uri, type: 'application/octet-stream', name }
            formData.append('picture' + i, file)
        }

        //防止多次发送帖子
        BTWaitView.show(I18n.t('tip.wait_text'))

        formData.append('token', UserInfo.token)
        formData.append('collection_id', this.state.collection_id)
        formData.append('task_id', this.task_id)
        formData.append('handle', 2)
        devlog('formData', formData);

        requestWithFile('/collection/memberCollectionHandle', formData)
            .then((res) => {
                this.setState({
                    repeat: true
                })
                devlog(formData,'fomData')
                if (res.code === '0') {
                    BTWaitView.hide()
                    Toast.success(res.msg, Config.ToestTime, null, false)
                    // Toast.success(res.msg,1)
                    this.setState({
                        images: [],
                    });
                    let task = {task_id:this.task_id};
                    this.props.navigation.state.params.callback(task);
                    this.props.navigation.goBack()
                    devlog('collection/memberCollectionHandle res', res);
                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                } else {
                    let msg = res.msg
                    BTWaitView.hide()
                    Toast.fail(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch((error) => {
                Toast.hide()
                Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
            })
    }
    deleteTaskImg(){
        this.setState({
            images:[],
        });
    }
    //图片
    onChangeUploadImage = (fileList) => {
        this.setState({
            images: fileList
        },()=>{
          devlog(this.state.images)
        })
    }

    stop(){
        clearInterval(this.interval);
    }
    handleConnectivityChange(status) {
        // console.log('status change111:' + status);
       /* this.setState({
            network_status:status,
        },()=>{
            devlog('改变后:'+status);

        })*/
        //监听第一次改变后, 可以取消监听.或者在componentUnmount中取消监听
        // NetInfo.removeEventListener('change', this.handleConnectivityChange);
    }
    componentWillUnmount() {
        this.stop();

        NetInfo.removeEventListener('change', this.handleConnectivityChange);
    }


  render() {
    return (
        <View style={[NavStyle.container,{justifyContent: 'space-between'}]}>
            <ImageBackground
                style={{
                    height: (UserInfo.screenW * 400) / 375,
                    width: UserInfo.width,
                    justifyContent: 'space-between'
                }}
                source={require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_hand_write_bg.png')}>
                <View>
                    <View style={styles.itemBg}>
                        <View style={styles.handWriteEg}>
                            <Text style={styles.handWriteBgText}>{I18n.t('dataCollection.hand_example')}</Text>
                            <Text style={styles.handWriteEgText}>understand</Text>
                            <Text style={styles.handWriteBgTextBlank} />
                        </View>
                        <View style={styles.handWriteEgImg}>
                            <Image
                                style={styles.handWriteEgImgWord}
                                source={require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_test1.png')}
                            />
                        </View>
                    </View>

                    <View style={styles.handWriteTime}>
                        <Text style={styles.handWriteRemainingTime}>
                            {I18n.t('dataCollection.hand_overtime')}
                            {/* {this.state.timeLeft.days < 10 ? '0' + this.state.timeLeft.days:this.state.timeLeft.days}天*/}
                            {this.state.timeLeft.hours < 10 ? '0' + this.state.timeLeft.hours:this.state.timeLeft.hours}{I18n.t('task.task_hour')}
                            {this.state.timeLeft.min< 10 ? '0' + this.state.timeLeft.min:this.state.timeLeft.min}{I18n.t('task.task_minute')}
                            {this.state.timeLeft.sec< 10 ? '0' + this.state.timeLeft.sec:this.state.timeLeft.sec}{I18n.t('task.task_second')}
                        </Text>
                        <View style={styles.handWriteRemainingTask}>
                            <Text style={{fontSize:14,color:'#000', fontWeight:'bold',}}>
                                {I18n.t('dataCollection.hand_surplus_task')}：{this.state.remaining}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.handWriteContent}>
                        <View style={styles.handWriteContentHeader}>
                            <Text style={styles.handWriteContentText}> {I18n.t('dataCollection.hand_start')}
                            </Text>
                        </View>
                        <View style={styles.handTask}>
                            <Text style={styles.handTaskText}>{this.state.rand}</Text>
                            <View style={styles.handTaskContent}>
                                {/*<HandWrittenCamera onChange={this.onChangeUploadImage} />*/}
                                {this.state.images.length !== 0 ?
                                    <View style={styles.handTaskOperatingShow}>
                                        <Image style={styles.handTaskShapeImg} source={{uri: this.state.images[0].path}} />
                                        <TouchableOpacity activeOpacity={0.5} style={styles.handTaskDeleteAll} onPress={() => this.deleteTaskImg()}>
                                            <Image style={styles.handTaskDelete} source={require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_del.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <LocalImageAccess
                                        cropping={true}
                                        width={226}
                                        height={50}
                                        onChange={this.onChangeUploadImage}
                                        imageList={this.state.images}
                                        maxFileNum={1}
                                    >
                                        <View style={styles.handTaskOperating}>
                                            <Image style={styles.handTaskShape} source={require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_camera.png')} />
                                        </View>
                                    </LocalImageAccess>
                                }
                            </View>
                        </View>
                    </View>

                </View>

            </ImageBackground>
            <View style={styles.handWriteFooter}>
                <LongButton
                    onPress={() => {
                        this.giveUpCollectionHandle()
                    }}
                    style={{ width: 150, height: 50, backgroundColor:'#fff', borderWidth:1, borderColor:'#046FDB',  }}
                    textStyle={{color:'#046FDB', letterSpacing:2.3}}
                    title={I18n.t('dataCollection.collection_gaveup')}
                />
                <LongButton
                    onPress={() => {
                        this.memberCollectionHandle()
                    }}
                    style={{ width: 150, height: 50 }}
                    textStyle={{ letterSpacing:2.3}}
                    title={I18n.t('dataCollection.collection_submit')}
                />
            </View>
        </View>

    )
  }
}

const styles = StyleSheet.create({
  handWriteBg: {
    flex: 1,
    justifyContent: 'space-between'
  },
  itemBg: {
    height: 97,
    backgroundColor: '#fff',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 3
  },
  handWriteEg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#EFF0F3',
    height: 30,
    paddingLeft: 16,
    paddingRight: 16
  },
  handWriteBgText: {
    fontSize: 13,
    color: '#353B48'
  },
  handWriteBgTextBlank: {
    width: 26
  },
  handWriteEgText: {
    fontSize: 20,
    color: '#333'
  },
  handWriteEgImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  handWriteEgImgWord: {
    width: 200,
    height: 50
  },
  handWriteTime: {
    height: 79,
    backgroundColor: '#fff',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 10,
    borderRadius: 3,
    paddingLeft: 11,
    paddingRight: 11
  },
  handWriteRemainingTime: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    lineHeight: 20,
    height: 20,
    marginTop: 12,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  handWriteRemainingTask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#EFF0F3',
    borderTopWidth: 1
  },
  handWriteContent: {
    height: 141,
    backgroundColor: '#fff',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 10,
    borderRadius: 3
  },
  handWriteContentHeader: {
    borderColor: '#EFF0F3',
    borderBottomWidth: 1,
    paddingTop: 4,
    paddingBottom: 8
  },
  handWriteContentText: {
    paddingLeft: 16,
    color: '#354B48',
    fontSize: 13,
    height: 18,
    lineHeight: 18
  },
  handTask: {
    flex: 1
  },
  handTaskText: {
    fontSize: 20,
    lineHeight: 28,
    height: 28,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    // marginBottom: 8,
    fontWeight: 'bold'
  },
  handTaskContent: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center'
  },

  handWriteFooter: {
    height: 50,
    marginBottom: 31,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
    handTaskOperatingShow:{
        flex:1,
        width:248,
        position:'relative',
        borderRadius:3,
        alignItems:'center',
        justifyContent:'center',
    },
    handTaskOperating:{
        width:226,
        height:50,
        position:'relative',
        borderRadius:3,
        backgroundColor:'#eee',
        alignItems:'center',
        justifyContent:'center',
    },
    handTaskShape:{
        width:31,
        height:26,
    },
    handTaskShapeImg:{
        width:226,
        height:50,
    },
    handTaskDeleteAll:{
        position:'absolute',
        right:0,
        top:0,
    },
    handTaskDelete:{
        width:22,
        height:22,
    },

});
